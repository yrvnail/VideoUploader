/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/apply/_internal/flexState/FlexState",
	"sap/ui/fl/write/_internal/Versions",
	"sap/ui/fl/Utils",
	"sap/ui/fl/apply/_internal/flexState/ManifestUtils"
], function(
	FlexState,
	Versions,
	Utils,
	ManifestUtils
) {
	"use strict";

	function getReference(oAppComponent) {
		var sReference;
		if (oAppComponent) {
			var oManifest = oAppComponent.getManifest();
			sReference = ManifestUtils.getFlexReference({
				manifest: oManifest,
				componentData: oAppComponent.getComponentData()
			});
		}

		if (!sReference) {
			throw Error("The application ID could not be determined");
		}

		return sReference;
	}

	function getVersionsModel(mPropertyBag) {
		if (!mPropertyBag.selector) {
			throw Error("No selector was provided");
		}
		if (!mPropertyBag.layer) {
			throw Error("No layer was provided");
		}

		var oAppComponent = Utils.getAppComponentForControl(mPropertyBag.selector);
		return Versions.getVersionsModel({
			reference: Utils.normalizeReference(getReference(oAppComponent)),
			layer: mPropertyBag.layer
		});
	}

	/**
	 * Provides an API for tools like {@link sap.ui.rta} to activate, discard and retrieve versions.
	 *
	 * @namespace sap.ui.fl.write.api.VersionsAPI
	 * @experimental Since 1.74
	 * @since 1.74
	 * @ui5-restricted sap.ui.rta, similar tools
	 *
	 */
	var VersionsAPI = /** @lends sap.ui.fl.write.api.VersionsAPI */ {};

	/**
	 * Initializes the versions for a given selector and layer.
	 *
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 *
	 * @returns {Promise<sap.ui.model.json.JSONModel>} Model with list of versions if available and further version properties;
	 * Rejects if not all parameters were passed or the application could not be determined
	 */
	VersionsAPI.initialize = function (mPropertyBag) {
		if (!mPropertyBag.selector) {
			return Promise.reject("No selector was provided");
		}
		if (!mPropertyBag.layer) {
			return Promise.reject("No layer was provided");
		}

		var oAppComponent = Utils.getAppComponentForControl(mPropertyBag.selector);

		return Versions.initialize({
			reference: Utils.normalizeReference(getReference(oAppComponent)),
			layer: mPropertyBag.layer
		});
	};

	/**
	 * Returns a flag if a draft exists for the current application and layer.
	 *
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 *
	 * @return {boolean} Flag if a draft is available;
	 * Throws an error in case no initialization took place upfront
	 */
	VersionsAPI.isDraftAvailable = function (mPropertyBag) {
		var oModel = getVersionsModel(mPropertyBag);

		var aVersions = oModel.getProperty("/versions");
		var oDraft = aVersions.find(function (oVersion) {
			return oVersion.version === sap.ui.fl.Versions.Draft;
		});

		return !!oDraft;
	};

	/**
	 * Returns a flag if the displayed version is not the active version for the current application and layer.
	 *
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 *
	 * @return {boolean} Flag if the displayed version is not the active version
	 * Throws an error in case no initialization took place upfront
	 */
	VersionsAPI.isOldVersionDisplayed = function (mPropertyBag) {
		var oModel = getVersionsModel(mPropertyBag);

		var displayedVersion = oModel.getProperty("/displayedVersion");
		var activeVersion = oModel.getProperty("/activeVersion");

		return displayedVersion !== sap.ui.fl.Versions.Draft && displayedVersion !== activeVersion;
	};

	/**
	 * Removes the internal stored state of a given application and refreshes the state including a draft for the given layer;
	 * an actual reload of the application has to be triggered by the caller.
	 *
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 *
	 * @returns {Promise} Resolves as soon as the clearance and the requesting is triggered.
	 */
	VersionsAPI.loadDraftForApplication = function (mPropertyBag) {
		mPropertyBag.version = sap.ui.fl.Versions.Draft;
		return VersionsAPI.loadVersionForApplication(mPropertyBag);
	};

	/**
	 * Removes the internal stored state of a given application and refreshes the state including a draft for the given layer;
	 * an actual reload of the application has to be triggered by the caller.
	 *
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 * @param {number} [mPropertyBag.version] - Version number to be loaded
	 * @param {boolean} [mPropertyBag.allContexts] - Includes also restricted contexts
	 *
	 * @returns {Promise} Resolves as soon as the clearance and the requesting is triggered.
	 */
	VersionsAPI.loadVersionForApplication = function (mPropertyBag) {
		if (!mPropertyBag.selector) {
			return Promise.reject("No selector was provided");
		}
		if (!mPropertyBag.layer) {
			return Promise.reject("No layer was provided");
		}
		if (mPropertyBag.version === undefined) {
			var oModel = getVersionsModel(mPropertyBag);
			if (oModel) {
				mPropertyBag.version = oModel.getProperty("/activeVersion");
			}
		}

		var oAppComponent = Utils.getAppComponentForControl(mPropertyBag.selector);
		return Promise.resolve()
		.then(getReference.bind(undefined, oAppComponent))
		.then(function (sReference) {
			return FlexState.clearAndInitialize({
				componentId: oAppComponent.getId(),
				reference: sReference,
				version: mPropertyBag.version,
				allContexts: mPropertyBag.allContexts
			});
		});
	};

	/**
	 * (Re-)activates a version.
	 *
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 * @param {string} mPropertyBag.title - Title of the to be activated version
	 *
	 * @ui5-restricted sap.ui.rta
	 *
	 * @returns {Promise<sap.ui.fl.Version>} Promise resolving with the updated list of versions for the application
	 * when the version was activated;
	 * rejects if an error occurs, the layer does not support draft handling, there is no draft to activate or
	 * when the displayed version is already active
	 */
	VersionsAPI.activate = function (mPropertyBag) {
		if (!mPropertyBag.selector) {
			return Promise.reject("No selector was provided");
		}
		if (!mPropertyBag.layer) {
			return Promise.reject("No layer was provided");
		}
		if (!mPropertyBag.title) {
			return Promise.reject("No version title was provided");
		}

		var oAppComponent = Utils.getAppComponentForControl(mPropertyBag.selector);

		return Promise.resolve()
		.then(getReference.bind(undefined, oAppComponent))
		.then(function (sReference) {
			return Versions.activate({
				nonNormalizedReference: sReference,
				reference: Utils.normalizeReference(sReference),
				layer: mPropertyBag.layer,
				title: mPropertyBag.title,
				appComponent: oAppComponent
			});
		});
	};

	/**
	 * Discards the current draft within a given layer; This sends a call to the connector in case a draft exists and will
	 * update the FlexState accordingly in case the <code>updateState</code> flag is set; This API does not revert the changes
	 * and the consumer must take care of making a reload of the application itself.
	 *
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 * @returns {Promise<boolean>} Promise resolving with a flag if a discarding took place;
	 * rejects if an error occurs or the layer does not support draft handling
	 */
	VersionsAPI.discardDraft = function (mPropertyBag) {
		if (!mPropertyBag.selector) {
			return Promise.reject("No selector was provided");
		}
		if (!mPropertyBag.layer) {
			return Promise.reject("No layer was provided");
		}

		var oAppComponent = Utils.getAppComponentForControl(mPropertyBag.selector);

		return Promise.resolve()
		.then(getReference.bind(undefined, oAppComponent))
		.then(function (sReference) {
			return Versions.discardDraft({
				nonNormalizedReference: sReference,
				reference: Utils.normalizeReference(sReference),
				layer: mPropertyBag.layer
			}).then(function(oDiscardInfo) {
				if (oDiscardInfo.backendChangesDiscarded) {
					//invalidate flexState to trigger getFlexData for the current active version after discard
					FlexState.clearAndInitialize({
						componentId: oAppComponent.getId(),
						reference: sReference
					});
				}
				return oDiscardInfo;
			});
		});
	};

	return VersionsAPI;
});
