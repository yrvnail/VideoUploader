/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/registry/Settings",
	"sap/ui/fl/ChangePersistenceFactory",
	"sap/ui/fl/write/_internal/Storage",
	"sap/base/util/UriParameters",
	"sap/ui/model/json/JSONModel",
	"sap/ui/fl/Utils",
	"sap/ui/model/BindingMode"
], function(
	Settings,
	ChangePersistenceFactory,
	Storage,
	UriParameters,
	JSONModel,
	Utils,
	BindingMode
) {
	"use strict";

	var _mInstances = {};
	var MODEL_SIZE_LIMIT = 9;
	// Limiting the data requested from the back end but one additional version is requested to
	// ensure sufficient data is present even if a draft was returned and later discarded
	var BACKEND_REQUEST_LIMIT = MODEL_SIZE_LIMIT + 1;

	function createModel(mPropertyBag, bVersioningEnabled, aVersions) {
		var bBackendDraft = _doesDraftExistInVersions(aVersions);

		var nActiveVersion = sap.ui.fl.Versions.Original;
		aVersions.forEach(function (oVersion) {
			if (oVersion.version === sap.ui.fl.Versions.Draft) {
				oVersion.type = "draft";
			} else if (nActiveVersion === sap.ui.fl.Versions.Original) {
				// no active version found yet; the first non-draft version is always the active version
				oVersion.type = "active";
				nActiveVersion = oVersion.version;
			} else {
				oVersion.type = "inactive";
			}
		});

		var sPersistedBasisForDisplayedVersion = Utils.getParameter(sap.ui.fl.Versions.UrlParameter);
		var nPersistedBasisForDisplayedVersion;
		if (sPersistedBasisForDisplayedVersion) {
			nPersistedBasisForDisplayedVersion = parseInt(sPersistedBasisForDisplayedVersion);
		} else if (aVersions.length > 0) {
			nPersistedBasisForDisplayedVersion = aVersions[0].version;
		} else {
			nPersistedBasisForDisplayedVersion = sap.ui.fl.Versions.Original;
		}

		var oModel = new JSONModel({
			versioningEnabled: bVersioningEnabled,
			versions: aVersions,
			activeVersion: nActiveVersion,
			backendDraft: bBackendDraft,
			dirtyChanges: false,
			draftAvailable: bBackendDraft,
			activateEnabled: bBackendDraft,
			persistedVersion: nPersistedBasisForDisplayedVersion,
			displayedVersion: nPersistedBasisForDisplayedVersion
		});

		oModel.setDefaultBindingMode(BindingMode.OneWay);
		oModel.setSizeLimit(MODEL_SIZE_LIMIT);

		// TODO: currently called by sap.ui.rta.RuntimeAuthoring but should be by a ChangesState
		oModel.setDirtyChanges = function (bDirtyChanges) {
			oModel.setProperty("/dirtyChanges", bDirtyChanges);
			oModel.updateDraftVersion();
			oModel.updateBindings(true);
		};

		oModel.updateDraftVersion = function () {
			var aVersions = oModel.getProperty("/versions");
			var bVersioningEnabled = oModel.getProperty("/versioningEnabled");
			var bDirtyChanges = oModel.getProperty("/dirtyChanges");
			var bBackendDraft = oModel.getProperty("/backendDraft");
			var bDraftAvailable = bVersioningEnabled && (bDirtyChanges || bBackendDraft);
			oModel.setProperty("/draftAvailable", bDraftAvailable);

			var nDisplayedVersion = bDirtyChanges ? sap.ui.fl.Versions.Draft : oModel.getProperty("/persistedVersion");
			oModel.setProperty("/displayedVersion", nDisplayedVersion);

			// add draft
			if (!_doesDraftExistInVersions(aVersions) && bDraftAvailable) {
				aVersions.splice(0, 0, {version: sap.ui.fl.Versions.Draft, type: "draft"});
			}

			// remove draft
			if (_doesDraftExistInVersions(aVersions) && !bDraftAvailable) {
				aVersions.shift();
				oModel.setProperty("/displayedVersion", oModel.getProperty("/persistedVersion"));
			}

			var bActivateEnabled = oModel.getProperty("/displayedVersion") !== oModel.getProperty("/activeVersion");
			oModel.setProperty("/activateEnabled", bActivateEnabled);
		};

		return oModel;
	}

	// TODO: the handling should move to the FlexState as soon as it is ready
	function _removeDirtyChanges(mPropertyBag, oDirtyChangeInfo) {
		// remove all dirty changes
		var aDirtyChanges = [];
		var aChangePersistences = oDirtyChangeInfo.changePersistences;
		aChangePersistences.forEach(function (oChangePersistence) {
			aDirtyChanges = oChangePersistence.getDirtyChanges().concat();
			aDirtyChanges.forEach(function(oChange) {
				oChangePersistence.deleteChange(oChange, true);
			});
		});
		return aDirtyChanges.length > 0;
	}

	function _getDirtyChangesInfo(mPropertyBag) {
		var oDirtyChangesInfo = {
			dirtyChangesExist: false,
			changePersistences: []
		};

		if (mPropertyBag.reference) {
			var oChangePersistenceForAppDescriptorChanges = ChangePersistenceFactory.getChangePersistenceForComponent(mPropertyBag.reference);
			if (oChangePersistenceForAppDescriptorChanges.getDirtyChanges().length > 0) {
				oDirtyChangesInfo.dirtyChangesExist = true;
				oDirtyChangesInfo.changePersistences.push(oChangePersistenceForAppDescriptorChanges);
			}
		}
		if (mPropertyBag.nonNormalizedReference) {
			var oChangePersistence = ChangePersistenceFactory.getChangePersistenceForComponent(mPropertyBag.nonNormalizedReference);
			if (oChangePersistence.getDirtyChanges().length > 0) {
				oDirtyChangesInfo.dirtyChangesExist = true;
				oDirtyChangesInfo.changePersistences.push(oChangePersistence);
			}
		}
		return oDirtyChangesInfo;
	}

	function _doesDraftExistInVersions(aVersions) {
		return aVersions.some(function(oVersion) {
			return oVersion.version === sap.ui.fl.Versions.Draft;
		});
	}

	/**
	 *
	 *
	 * @namespace sap.ui.fl.write._internal.Versions
	 * @since 1.74
	 * @version 1.90.1
	 * @private
	 * @ui5-restricted sap.ui.fl
	 */
	var Versions = {};

	/**
	 * @param {object} mPropertyBag - Property Bag
	 * @param {string} mPropertyBag.reference - ID of the application for which the versions are requested
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 * @returns {sap.ui.model.json.JSONModel} Model containing version data like <code>versions</code>,
	 *  <code>dirtyChanges</code> and <code>backendDraft</code>
	 * rejects if an error occurs or the layer does not support draft handling
	 */
	Versions.initialize = function(mPropertyBag) {
		var sReference = mPropertyBag.reference;
		var sLayer = mPropertyBag.layer;
		mPropertyBag.limit = BACKEND_REQUEST_LIMIT;

		return Settings.getInstance()
			.then(function (oSettings) {
				var bVersionsEnabled = oSettings.isVersioningEnabled(sLayer);
				var aVersionsPromise = bVersionsEnabled ? Storage.versions.load(mPropertyBag) : Promise.resolve([]);
				return aVersionsPromise
					.then(function (aVersions) {
						_mInstances[sReference] = _mInstances[sReference] || {};
						_mInstances[sReference][sLayer] = _mInstances[sReference][sLayer] || {};
						_mInstances[sReference][sLayer] = createModel(mPropertyBag, bVersionsEnabled, aVersions);
						return _mInstances[sReference][sLayer];
					});
			});
	};

	/**
	 * @param {object} mPropertyBag - Property Bag
	 * @param {string} mPropertyBag.reference - ID of the application for which the versions are requested
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 * @returns {sap.ui.model.json.JSONModel} Model containing version data like <code>versions</code>,
	 *  <code>dirtyChanges</code> and <code>backendDraft</code>
	 * throws an error if versions were not initialized for the given reference and layer
	 */
	Versions.getVersionsModel = function(mPropertyBag) {
		var sReference = mPropertyBag.reference;
		var sLayer = mPropertyBag.layer;

		if (!_mInstances[sReference] || !_mInstances[sReference][sLayer]) {
			throw Error("Versions Model for reference '" + sReference + "' and layer '" + sLayer + "' were not initialized.");
		}

		var oDirtyChangesInfo = _getDirtyChangesInfo(mPropertyBag);
		if (oDirtyChangesInfo.dirtyChangesExist) {
			_mInstances[sReference][sLayer].updateDraftVersion(mPropertyBag);
		}
		return _mInstances[sReference][sLayer];
	};

	Versions.clearInstances = function() {
		_mInstances = {};
	};

	/**
	 * Updates dirty changes and the backendDraft property of the model after a saveAll was called.
	 *
	 * @param {object} mPropertyBag - Property Bag
	 * @param {string} mPropertyBag.reference - ID of the application for which the versions are requested (this reference must not contain the ".Component" suffix)
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 */
	Versions.onAllChangesSaved = function (mPropertyBag) {
		mPropertyBag.reference = Utils.normalizeReference(mPropertyBag.reference);
		var oModel = Versions.getVersionsModel(mPropertyBag);
		var bVersioningEnabled = oModel.getProperty("/versioningEnabled");
		var bDirtyChanges = oModel.getProperty("/dirtyChanges");
		oModel.setProperty("/dirtyChanges", true);
		oModel.setProperty("/backendDraft", bVersioningEnabled && bDirtyChanges);
		oModel.updateDraftVersion();
	};

	/**
	 * (Re-)activates a version.
	 *
	 * @param {object} mPropertyBag - Property Bag
	 * @param {string} mPropertyBag.reference - ID of the application for which the versions are requested (this reference must not contain the ".Component" suffix)
	 * @param {string} mPropertyBag.nonNormalizedReference - ID of the application for which the versions are requested
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 * @param {string} mPropertyBag.title - Title of the to be activated version
	 * @param {string} mPropertyBag.appComponent - Application Component
	 * @returns {Promise<sap.ui.fl.Version>} Promise resolving with the updated list of versions for the application
	 * when the version was activated;
	 * rejects if an error occurs, the layer does not support draft handling, there is no draft to activate or
	 * when the displayed version is already active
	 */
	Versions.activate = function(mPropertyBag) {
		var oModel = Versions.getVersionsModel(mPropertyBag);
		var aVersions = oModel.getProperty("/versions");
		var bDraftExists = _doesDraftExistInVersions(aVersions);
		var sDisplayedVersion = oModel.getProperty("/displayedVersion");
		var sActiveVersion = oModel.getProperty("/activeVersion");
		var nParentVersion = oModel.getProperty("/persistedVersion");
		if (sDisplayedVersion === sActiveVersion) {
			return Promise.reject("Version is already active");
		}
		mPropertyBag.version = sDisplayedVersion;

		var aSaveDirtyChangesPromise = [];
		if (oModel.getProperty("/dirtyChanges")) {
			// TODO: the handling should move to the FlexState as soon as it is ready
			var oDirtyChangeInfo = _getDirtyChangesInfo(mPropertyBag);
			var aChangePersistences = oDirtyChangeInfo.changePersistences;
			aSaveDirtyChangesPromise = aChangePersistences.map(function (oChangePersistence) {
				return oChangePersistence.saveDirtyChanges(mPropertyBag.appComponent, false, undefined, nParentVersion);
			});
		}
		return Promise.all(aSaveDirtyChangesPromise)
		.then(Storage.versions.activate.bind(undefined, mPropertyBag))
		.then(function (oVersion) {
			aVersions.forEach(function (oVersionEntry) {
				oVersionEntry.type = "inactive";
			});
			oVersion.type = "active";
			if (bDraftExists) {
				aVersions.shift();
			}
			aVersions.splice(0, 0, oVersion);
			oModel.setProperty("/backendDraft", false);
			oModel.setProperty("/dirtyChanges", false);
			oModel.setProperty("/draftAvailable", false);
			oModel.setProperty("/activateEnabled", false);
			oModel.setProperty("/activeVersion", oVersion.version);
			oModel.setProperty("/displayedVersion", oVersion.version);
			oModel.setProperty("/persistedVersion", oVersion.version);
			oModel.updateBindings(true);
		});
	};

	/**
	 * Discards the draft for a given application and layer; dirty changes are only.
	 *
	 * @param {object} mPropertyBag - Property Bag
	 * @param {string} mPropertyBag.reference - ID of the application for which the versions are requested (this reference must not contain the ".Component" suffix)
	 * @param {string} mPropertyBag.nonNormalizedReference - ID of the application for which the versions are requested
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 * @returns {Promise<object>} Promise resolving to an object to indicate if a discarding took place on backend side and/or dirty changes were discarded;
	 * rejects if an error occurs or the layer does not support draft handling
	 */
	Versions.discardDraft = function(mPropertyBag) {
		var oModel = Versions.getVersionsModel(mPropertyBag);
		var aVersions = oModel.getProperty("/versions");
		var oDirtyChangesInfo = _getDirtyChangesInfo(mPropertyBag);
		var bBackendDraftExists = oModel.getProperty("/backendDraft");
		var oDiscardPromise = bBackendDraftExists ? Storage.versions.discardDraft(mPropertyBag) : Promise.resolve();

		return oDiscardPromise.then(function () {
			aVersions.shift();
			oModel.setProperty("/backendDraft", false);
			oModel.setProperty("/dirtyChanges", false);
			oModel.setProperty("/draftAvailable", false);
			oModel.setProperty("/activateEnabled", false);
			oModel.setProperty("/displayedVersion", oModel.getProperty("/persistedVersion"));
			oModel.updateBindings(true);
			// in case of a existing draft known by the backend;
			// we remove dirty changes only after successful DELETE request
			var bDirtyChangesRemoved = _removeDirtyChanges(mPropertyBag, oDirtyChangesInfo);
			return {
				backendChangesDiscarded: bBackendDraftExists,
				dirtyChangesDiscarded: bDirtyChangesRemoved
			};
		});
	};

	return Versions;
});
