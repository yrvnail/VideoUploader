/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/mdc/p13n/AdaptationProvider",
	"sap/base/util/merge",
	"sap/base/Log",
	"sap/ui/mdc/util/PropertyHelper",
	"sap/ui/mdc/p13n/modification/FlexModificationHandler",
	"sap/m/MessageStrip",
	"sap/ui/core/library",
	"sap/ui/mdc/p13n/StateUtil",
	"sap/ui/core/Element",
	"sap/ui/mdc/p13n/DefaultProviderRegistry",
	"sap/ui/mdc/p13n/UIManager"
], function (AdaptationProvider, merge, Log, PropertyHelper, FlexModificationHandler, MessageStrip, coreLibrary, StateUtil, Element, DefaultProviderRegistry, UIManager) {
	"use strict";

	var ERROR_INSTANCING = "Engine: This class is a singleton. Please use the getInstance() method instead.";

	//Shortcut to 'MessageType'
	var MessageType = coreLibrary.MessageType;

	/*global WeakMap */
	var _mRegistry = new WeakMap();

	//Singleton storage
	var oEngine;

	/**
	 * Constructor for a new Engine. The Engine should always be accessed
	 * via 'getInstance' and not by creating a new instance of it. The class should only be used
	 * to create derivations.
	 *
	 * @class
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.90.1
	 *
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 * @experimental
	 * @since 1.87
	 * @alias sap.ui.mdc.p13n.Engine
	 */
	var Engine = AdaptationProvider.extend("sap.ui.mdc.p13n.Engine", {
		constructor: function() {
			AdaptationProvider.call(this);

			if (oEngine) {
				throw Error(ERROR_INSTANCING);
			}

			this._aRegistry = [];

			//Default Provider Registry to be used for internal PersistenceProvider functionality access
			this.defaultProviderRegistry = DefaultProviderRegistry.getInstance();

			//UIManager to be used for p13n UI creation
			this.uimanager = UIManager.getInstance(this);
		}
	});

	/**
	 * This method should only be called once per instance to register provided
	 * classes of <code>sap.ui.mdc.p13n.Controller</code> for the control instance
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * @param {sap.ui.mdc.Control} oControl The control insance to be registered for adaptation
	 * @param {Object} oConfig The config object providing key value pairs of keys and
	 * <code>sap.ui.mdc.p13n.Controller</code> classes.
	 *
	 * @example
	 *  {
	 * 		controller: {
	 * 			Item: ColumnController,
	 * 			Sort: SortController,
	 * 			Filter: FilterController
	 * 		}
	 *	}
	 */
	Engine.prototype.registerAdaptation = function(oControl, oConfig) {

		if (!oConfig.hasOwnProperty("controller")) {
			throw new Error("Please provide atleast a configuration 'controller' containing a map of key-value pairs (key + Controller class) in order to register adaptation.");
		}

		if (this._getRegistryEntry(oControl)){
			this.deregisterAdaptation(oControl);
		}

		var aControllerKeys = Object.keys(oConfig.controller);

		aControllerKeys.forEach(function(sKey){

			var SubController = oConfig.controller[sKey];

			if (!this.getController(oControl, sKey)) {
				if (this._aRegistry.indexOf(oControl.getId()) < 0){
					this._aRegistry.push(oControl.getId());
				}
				var oController = new SubController(oControl);

				this.addController(oController, sKey);
			}

		}.bind(this));

	};

	/**
	 * Deregister a registered control. By deregistering a control the control will
	 * be removed from the <code>Engine</code> registry and all instance specific sub
	 * modules such as the registered controllers are going to be destroyed.
	 *
	 * @param {sap.ui.mdc.Control} oControl
	 */
	Engine.prototype.deregisterAdaptation = function(oControl) {
		var oRegistryEntry = this._getRegistryEntry(oControl);

		//destroy subcontroller
		Object.keys(oRegistryEntry.controller).forEach(function(sKey){
			var oController = oRegistryEntry.controller[sKey];
			oController.destroy();

			delete oRegistryEntry.controller[sKey];
		});

		//Remove the control from the weakmap housekeeping
		_mRegistry.delete(oControl);

		//Remove the control from the array to maintain debugging
		var iControlIndex = this._aRegistry.indexOf(oControl.getId());
		this._aRegistry.splice(iControlIndex, 1);
	};

	/**
	 * This method can be used to set the modification handling for a control instance.
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered control instance
	 * @param {sap.ui.mdc.p13n.modification.ModificationHandler} ModificationHandler The modification handler singleton instance
	 */
	Engine.prototype._setModificationHandler = function(vControl, oModificationHandler) {
		if (!oModificationHandler.isA("sap.ui.mdc.p13n.modification.ModificationHandler")) {
			throw new Error("Only sap.ui.mdc.p13n.modification.ModificationHandler derivations are allowed for modification");
		}
		var oModificationSetting = this._determineModification(vControl); //check and calculate modification basics
		oModificationSetting.handler = oModificationHandler;
		this._getRegistryEntry(vControl).modification = oModificationSetting;
	};

	/**
	 * <code>Engine#createChanges</code> can be used to programmatically trigger the creation
	 * of a set of changes based on the current control state and the provided state.
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * @param {object} mDiffParameters A map defining the configuration to create the changes.
	 * @param {sap.ui.mdc.Control} mDiffParameters.control The control instance tht should be adapted.
	 * @param {string} mDiffParameters.key The key used to retrieve the corresponding Controller.
	 * @param {object} mDiffParameters.state The state which should be applied on the provided control instance
	 * @param {boolean} [mDiffParameters.applyAbsolute] Decides whether unmentioned entries should be affected,
	 * for example if "A" is existing in the control state, but not mentioned in the new state provided in the
	 * mDiffParameters.state then the absolute appliance decides whether to remove "A" or to keep it.
	 * @param {boolean} [mDiffParameters.suppressAppliance] Decides whether the change should be applied directly.
	 * Controller
	 *
	 * @returns {Promise} A Promise resolving in the according delta changes.
	 */
	Engine.prototype.createChanges = function(mDiffParameters) {

		var vControl = mDiffParameters.control;
		var sKey = mDiffParameters.key;
		var aNewState = mDiffParameters.state;
		var bApplyAbsolute = !!mDiffParameters.applyAbsolute;
		var bSuppressCallback = !!mDiffParameters.suppressAppliance;
		if (!sKey || !vControl || !aNewState) {
			throw new Error("To create changes via Engine, atleast a 1)Control 2)Key and 3)State needs to be provided.");
		}

		return this.initAdaptation(vControl, sKey).then(function(){

			var oController = this.getController(vControl, sKey);
			var mchangeOperations = oController.getChangeOperations();

			var oRegistryEntry = this._getRegistryEntry(vControl);
			var oCurrentState = oController.getCurrentState();
			var oPriorState = merge(oCurrentState instanceof Array ? [] : {}, oCurrentState);

			var mDeltaConfig = {
				existingState: oPriorState,
				applyAbsolute: bApplyAbsolute,
				changedState: aNewState,
				control: oController.getAdaptationControl(),
				changeOperations: mchangeOperations,
				deltaAttributes: ["name"],
				propertyInfo: oRegistryEntry.helper.getProperties().map(function(a){return {name: a.getName()};})
			};

			//Only execute change calculation in case there is a difference (--> example: press 'Ok' without a difference)
			var aChanges = oController.getDelta(mDeltaConfig);

			if (!bSuppressCallback) {
				this._processChanges(vControl, aChanges);
			}

			return aChanges || [];

		}.bind(this));

	};

	/**
	 * This method can be used to trigger a reset on the provided control instance.
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * @param {sap.ui.mdc.Control} oControl The according control instance.
	 * @param {string} aKeys The key for the affected config.
	 *
	 * @returns {Promise} A Promise resolving once the reset is completed.
	 */
	Engine.prototype.reset = function(oControl, aKeys) {

		aKeys = aKeys instanceof Array ? aKeys : [aKeys];

		var oResetConfig = {
			selector: oControl
		};

		var oModificationSetting = this._determineModification(oControl);
		return oModificationSetting.handler.reset(oResetConfig, oModificationSetting.payload).then(function(){
			//Re-Init housekeeping after update
			return this.initAdaptation(oControl, aKeys).then(function(oPropertyHelper){
				aKeys.forEach(function(sKey){
					var oController = this.getController(oControl, sKey);
					oController.update(oPropertyHelper);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Returns a promise resolving after all currently pending modifications have been applied.
	 *
	 * @private
	 * @param {sap.ui.mdc.Control} oControl The according control instance.
	 * @returns {Promise} A Promise resolving after all pending modifications have been applied.
	 */
	Engine.prototype.waitForChanges = function(oControl) {
		var oModificationSetting = this._determineModification(oControl);
		return oModificationSetting.handler.waitForChanges({
			element: oControl
		}, oModificationSetting.payload);
	};

	/**
	 * Determines whether the environment is suitable for the desired modification of the provided control instance.
	 *
	 * @private
	 * @param {sap.ui.mdc.Control} oControl The according control instance.
	 */
	Engine.prototype.isModificationSupported = function(oControl) {
		var oModificationSetting = this._determineModification(oControl);
		return oModificationSetting.handler.isModificationSupported({
			element: oControl
		}, oModificationSetting.payload);
	};

	/**
	 * This method can be used to process an array of changes.
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered control instance
	 * @returns {Promise} The change appliance promise.
	 */
	Engine.prototype._processChanges = function(vControl, aChanges) {
		if (aChanges instanceof Array && aChanges.length > 0) {
			var oModificationSetting = this._determineModification(vControl);
			return oModificationSetting.handler.processChanges(aChanges, oModificationSetting.payload);
		}else {
			return Promise.resolve([]);
		}
	};

	/**
	 * This method can be used in the control's according designtime metadata
	 * for keyuser personalization.
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * @param {sap.ui.mdc.Control} oControl The registered control instance.
	 * @param {object} mPropertyBag The propertybag provided in the settings action.
	 * @param {string} aKeys The keys to be used to display in the corresponding Controller
	 *
	 * @returns {Promise} A Promise resolving in the set of changes to be created during RTA.
	 */
	Engine.prototype.getRTASettingsActionHandler = function (oControl, mPropertyBag, aKeys) {

		var fResolveRTA;

		//var aVMs = Engine.hasForReference(oControl, "sap.ui.fl.variants.VariantManagement");
		var aPVs = Engine.hasForReference(oControl, "sap.ui.mdc.p13n.PersistenceProvider");

		if (aPVs.length > 0) {
			return Promise.reject("Please do not use a PeristenceProvider in RTA.");
		}

		var oModificationHandler = this.getModificationHandler(oControl);
		var fnInitialAppliance = oModificationHandler.processChanges;

		var oRTAPromise = new Promise(function(resolve, reject){
			fResolveRTA = resolve;
		});

		oModificationHandler.processChanges = fResolveRTA;

		this._setModificationHandler(oControl, oModificationHandler);

		this.uimanager.show(oControl, aKeys).then(function(oContainer){
			var oCustomHeader = oContainer.getCustomHeader();
			if (oCustomHeader) {
				oCustomHeader.getContentRight()[0].setVisible(false);
			}
			oContainer.addStyleClass(mPropertyBag.styleClass);
		});

		oRTAPromise.then(function(){
			oModificationHandler.processChanges = fnInitialAppliance;
		});

		return oRTAPromise;

	};

	/**
	 * Apply a State on a control by passing an object that contains the
	 * registered controller key and an object matching the innter subcontroller housekeeping.
	 *
	 * @example {
	 * 		ControllerKey: [{<someState>}, {...}]
	 * }
	 *
	 * @param {sap.ui.mdc.Control} oControl The registered control instance
	 * @param {object} oState The state object
	 * @param {boolean} bApplyAbsolute Defines whether the state should be an additional delta on the current control state
	 *
	 * @returns {Promise} A Promise resolving after the state has been applied
	 */
	Engine.prototype.applyState = function(oControl, oState, bApplyAbsolute) {

		//Call retrieve only to ensure that the control is initialized and enabled for modification
		return this.retrieveState(oControl).then(function(oCurrentState){

			var aStatePromise = [], aChanges = [], mInfoState = {};

			if (oControl.validateState instanceof Function) {
				mInfoState = oControl.validateState(StateUtil._externalizeKeys(oState));
			}

			if (mInfoState.validation === MessageType.Error){
				Log.error(mInfoState.message);
			}

			Object.keys(oState).forEach(function(sControllerKey){

				var oController = this.getController(oControl, sControllerKey);

				if (!oController){
					//TODO: p13nMode <> registerAdaptation <> StateUtil key alignment
					return;
				}

				var oStatePromise = this.createChanges({
					control: oControl,
					key: sControllerKey,
					state: oController.sanityCheck(oState[sControllerKey]),
					suppressAppliance: true,
					applyAbsolute: bApplyAbsolute
				});

				aStatePromise.push(oStatePromise);
			}.bind(this));

			return Promise.all(aStatePromise).then(function(aRawChanges){
				aRawChanges.forEach(function(aSpecificChanges){
					if (aSpecificChanges && aSpecificChanges.length > 0){
						aChanges = aChanges.concat(aSpecificChanges);
					}
				});
				return this._processChanges(oControl, aChanges);
			}.bind(this));

		}.bind(this));
	};

	/**
	 *  Retrieves the externalized state for a given control instance.
	 *  The retrieved state is equivalent to the "getCurrentState" API for the given Control,
	 *  after all necessary changes have been applied (e.g. variant appliance and P13n/StateUtil changes).
	 *  After the returned Promise has been resolved, the returned State is in sync with the according
	 *  state object of the MDC control (for example "filterConditions" for the FilterBar).
	 *
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * @param {object} oControl The control instance implementing IxState to retrieve the externalized state
	 *
	 * @returns {Promise} a Promise resolving in the current control state.
	 */
	Engine.prototype.retrieveState = function(oControl) {

		var bValidInterface = this.checkXStateInterface(oControl);

		if (!bValidInterface){
			throw new Error("The control needs to implement the interface IxState.");
		}

		//ensure that the control has been initialized
		return oControl.initialized().then(function() {

			//ensure that all changes have been applied
			return Engine.getInstance().waitForChanges(oControl).then(function() {

				var oRetrievedState = {};
				Engine.getInstance().getRegisteredControllers(oControl).forEach(function(sKey){
					oRetrievedState[sKey] = Engine.getInstance().getController(oControl, sKey).getCurrentState();
				});

				return merge({}, oRetrievedState);

			});

		});

	};

	/**
	 * This method sanity checks a control for state appliance.
	 * The according interface is <code>sap.ui.mdc.IxState</code>
	 * @private
	 *
	 * @param {object} oControl The registered control instance
	 *
	 * @returns {boolean} Returns true/false depending on the sanity state.
	 */
	Engine.prototype.checkXStateInterface = function(oControl) {

		//check if a control instance is available
		if (!oControl) {
			return false;
		}

		//check if flex is enabled
		if (!this.isModificationSupported(oControl)) {
			return false;
		}

		//check for IxState 'initialized'
		if (!oControl.isA("sap.ui.mdc.IxState")) {
			return false;
		}

		return true;
	};

	/**
	 * This method can be used to initialize the Controller housekeeping.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered control instance
	 * @param {string} sKey The key for the according Controller
	 * @param {Object[]} aCustomInfo A custom set of propertyinfos as base to create the UI
	 *
	 * @returns {Promise} A Promise resolving after the adaptation housekeeping has been initialized.
	 */
	Engine.prototype.initAdaptation = function(vControl, aKeys, aCustomInfo) {
		this.verifyController(vControl, aKeys);

		//1) Init property helper
		return this._retrievePropertyHelper(vControl, aCustomInfo);

	};

	/**
	 * This method should only be used to register a new Controller.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.p13n.subcontroller.Controller} oController The controller instance.
	 * @param {string} sKey The key that defines the later access to the controller instance.
	 */
	Engine.prototype.addController = function(oController, sKey, oPreConfig) {
		var oRegistryEntry = this._createRegistryEntry(oController.getAdaptationControl(), oPreConfig);
		oRegistryEntry.controller[sKey] = oController;
	};

	/**
	 * This method can be used to get a controller instance.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered Control instance.
	 * @param {string} sKey The key for which the controller has been registered.
	 */
	Engine.prototype.getController = function(vControl, sKey) {
		var oRegistryEntry = this._getRegistryEntry(vControl);

		if (oRegistryEntry && oRegistryEntry.controller.hasOwnProperty(sKey)) {
			return oRegistryEntry.controller[sKey];
		}
	};

	/**
	 * Verifies the existence of a set of subcontrollers registered for a provided control instance.
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered Control instance.
	 * @param {string|array} vKey A key as string or an array of keys
	 */
	Engine.prototype.verifyController = function(vControl, vKey) {
		var aKeys = vKey instanceof Array ? vKey : [vKey];

		aKeys.forEach(function(sKey){
			if (!this.getController(vControl, sKey)) {
				var oControl = Engine.getControlInstance(vControl);
				throw new Error("No controller registered yet for " + oControl.getId() + " and key: " + sKey);
			}
		}.bind(this));

	};

	/**
	 * Retrieves the subcontroller UI settings for a provided control instance
	 * and the set of provided registered keys.
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered Control instance.
	 * @param {string|array} vKey A key as string or an array of keys
	 *
	 * @returns {object} The requested UI settings of the control instance and provided keys
	 */
	Engine.prototype.getUISettings = function(vControl, aKeys) {
		this.verifyController(vControl, aKeys);
		var oPropertyHelper = this._getRegistryEntry(vControl).helper;
		var mUiSettings = {};

		aKeys.forEach(function(sKey){
			var oController = this.getController(vControl, sKey);
			var pAdaptationUI = oController.getAdaptationUI(oPropertyHelper);
			//Check faceless controller implementations and skip them
			if (pAdaptationUI instanceof Promise){
				mUiSettings[sKey] = {};
				mUiSettings[sKey] = {
					resetEnabled: oController.getResetEnabled(),
					containerSettings: oController.getContainerSettings(),
					adaptationUI: pAdaptationUI
				};
			}
		}.bind(this));

		return mUiSettings;
	};

	/**
	 * This method can be used to determine if modification settings for a control have already been created.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered Control instance
 	 * @returns {boolean} true if modification settings were already determined
	 */
	Engine.prototype.isRegisteredForModification = function(vControl) {
		var oRegistryEntry = this._getRegistryEntry(vControl);
		return oRegistryEntry && !!oRegistryEntry.modification;
	};

	/**
	 * Retruns an array of all registered controllers
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered Control instance
	 * @returns {array} An array of all registered controller instances
	 */
	Engine.prototype.getRegisteredControllers = function(vControl){
		var oRegistryEntry = this._getRegistryEntry(vControl);
		return Object.keys(oRegistryEntry.controller);
	};

	/**
	 * This method can be used to get the registry entry for a control instance
	 *
	 * @private
	 * @param {sap.ui.mdc.Control} vControl
	 *
	 * @returns {object} The according registry entry
	 */
	Engine.prototype._getRegistryEntry = function(vControl) {

		var oControl = Engine.getControlInstance(vControl);
		return _mRegistry.get(oControl);

	};

	/**
	 * This method can be used to get the modification handling for a control instance
	 *
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * @param {sap.ui.mdc.Control} vControl
	 *
	 * @returns {object} The according ModificationHandler.
	 */
	Engine.prototype.getModificationHandler = function(vControl) {
		var oModificationSetting = this._determineModification(vControl);

		//This method might also be retrieved by non-registered Controls (such as FilterBarBase) - the default should always be Flex.
		return oModificationSetting.handler;

	};

	/**
	 * This method can be used to create the registry entry for a control instance
	 *
	 * @private
	 * @param {sap.ui.mdc.Control} vControl
	 *
	 * @returns {object} The according registry entry
	 */
	Engine.prototype._createRegistryEntry = function(vControl, oPreConfiguration) {

		var oControl = Engine.getControlInstance(vControl);

		if (!_mRegistry.has(oControl)) {

			_mRegistry.set(oControl, {
				modification: oPreConfiguration && oPreConfiguration.modification ? oPreConfiguration.modification : null,
				controller: {},
				activeP13n: null,
				helper: null
			});

		}

		return _mRegistry.get(oControl);
	};


	/**
	 * Determines and registeres the ModificationHandler per control instance
	 *
	 * @private
	 * @param {sap.ui.mdc.Control} vControl
	 * @returns {object} The according modification registry entry
	 */
	Engine.prototype._determineModification = function (vControl) {

		var oRegistryEntry = this._getRegistryEntry(vControl);

		//Modification setting is only calculated once per control instance
		if (oRegistryEntry && oRegistryEntry.modification) {
			return oRegistryEntry.modification;
		}

		var aPPResults = Engine.hasForReference(vControl, "sap.ui.mdc.p13n.PersistenceProvider");
		var aVMResults = Engine.hasForReference(vControl, "sap.ui.fl.variants.VariantManagement");

		var aPersistenceProvider = aPPResults.length ? aPPResults : undefined;
		var sHandlerMode = aPersistenceProvider ? aPersistenceProvider[0].getMode() : "Standard";

		var mHandlerMode = {
			Global: FlexModificationHandler,
			Transient: FlexModificationHandler,
			Standard: FlexModificationHandler,
			Auto: FlexModificationHandler
		};

		var ModificiationHandler = mHandlerMode[sHandlerMode];

		if (!ModificiationHandler) {
			throw new Error("Please provide a valid ModificationHandler! - valid Modification handlers are:" + Object.keys(mHandlerMode));
		}

		var oModificationSetting = {
			handler: ModificiationHandler.getInstance(),
			payload: {
				hasVM: aVMResults && aVMResults.length > 0,
				hasPP: aPPResults && aPPResults.length > 0,
				mode: sHandlerMode
			}
		};

		if (oRegistryEntry && !oRegistryEntry.modification) {
			oRegistryEntry.modification = oModificationSetting;
		}

		return oModificationSetting;
	};

	Engine.hasForReference = function(vControl, sControlType) {
		var sControlId = vControl && vControl.getId ? vControl.getId() : vControl;
		var aResults = Element.registry.filter(function (oElement) {
			if (!oElement.isA(sControlType)) {
				return false;
			}
			var aFor = oElement.getFor();
			for (var n = 0; n < aFor.length; n++) {
				if (aFor[n] === sControlId || Engine.hasControlAncestorWithId(sControlId, aFor[n])) {
					return true;
				}
			}
			return false;
		});
		return aResults;
	};

	/**
	 * Determines and registeres the ModificationHandler per control instance
	 *
	 * @private
	 * @param {String} sControlId The control id
	 * @param {String} sAncestorControlId The control ancestor id
	 *
	 * @returns {boolean} Returns whether an according ancestor could be found.
	 */
	Engine.hasControlAncestorWithId = function(sControlId, sAncestorControlId) {
		var oControl;

		if (sControlId === sAncestorControlId) {
			return true;
		}

		oControl = sap.ui.getCore().byId(sControlId);
		while (oControl) {
			if (oControl.getId() === sAncestorControlId) {
				return true;
			}

			if (typeof oControl.getParent === "function") {
				oControl = oControl.getParent();
			} else {
				return false;
			}
		}

		return false;
	};


	/**
	 * This method can be used to get a control instance by passing either the control
	 * or the Control's Id.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.Control|string} vControl
	 * @returns {sap.ui.core.Control} The control instance
	 */
	Engine.getControlInstance = function(vControl) {
		return typeof vControl == "string" ? sap.ui.getCore().byId(vControl) : vControl;
	};

	/**
	 * This method can be used to get the active p13n state of a registered Control.
	 * E.g. the method will return the key of the Controller that is currently being
	 * used to display a p13n UI.
	 *
	 * @private
	 * @param {sap.ui.mdc.Control} vControl
	 *
	 * @returns {boolean} The according flag is the Control has an open P13n container
	 */
	Engine.prototype.hasActiveP13n = function(vControl) {
		return !!this._getRegistryEntry(vControl).activeP13n;
	};

	/**
	 * This method can be used to set the active p13n state of a registered Control.
	 * E.g. the method will return the key of the Controller that is currently being
	 * used to display a p13n UI.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered control instance.
	 * @param {string} sKey The registerd key to get the corresponding Controller.
	 */
	Engine.prototype.setActiveP13n = function(vControl, sKey) {
		this._getRegistryEntry(vControl).activeP13n = sKey;
	};

	/**
	 * Triggers a validation for a certain controller - The method will create a
	 * MessageStrip and place it on the according oP13nUI. The BaseController needs
	 * to implement <code>BaseController#validateP13n</code>.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered control instance.
	 * @param {string} sKey The registerd key to get the corresponding Controller.
	 * @param {sap.ui.core.Control} oP13nUI The adaptation UI displayed in the container (e.g. BasePanel derivation).
	 */
	Engine.prototype.validateP13n = function(vControl, sKey, oP13nUI) {
		var oController = this.getController(vControl, sKey);
		var oControl = Engine.getControlInstance(vControl);


		var mControllers = this._getRegistryEntry(vControl).controller;
		var oTheoreticalState = {};

		Object.keys(mControllers).forEach(function(sControllerKey){
			oTheoreticalState[sControllerKey] = mControllers[sControllerKey].getCurrentState();
		});

		//Only execeute validation for controllers that support 'model2State'
		if (oController.model2State instanceof Function) {
			oTheoreticalState[sKey] = oController.model2State();

			var mInfoState = oControl.validateState(StateUtil._externalizeKeys(oTheoreticalState));

			var oMessageStrip;

			if (mInfoState.validation !== MessageType.None) {
				oMessageStrip = new MessageStrip({
					type: mInfoState.validation,
					text: mInfoState.message
				});
			}

			oP13nUI.setMessageStrip(oMessageStrip);
		}

	};

	/**
	 * Reads the current state of the subcontrollers and triggers a state appliance
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered Control instance.
	 * @param {array} aKeys An array of keys
	 * @returns {Promise} A Promise resolving after all p13n changes have been calculated and processed
	 */
	Engine.prototype.handleP13n = function(oControl, aKeys) {

		var pChanges = [];

		aKeys.forEach(function(sControllerKey){

			var oController = this.getController(oControl, sControllerKey);

			var p = this.createChanges({
				control: oControl,
				key: sControllerKey,
				state: oController.getP13nData(),
				suppressAppliance: true,
				applyAbsolute: true
			})
			.then(function(aItemChanges){

				return oController.getBeforeApply().then(function(aChanges){

					var aComulatedChanges = aChanges ? aChanges.concat(aItemChanges) : aItemChanges;
					return aComulatedChanges;

				});
			});

			pChanges.push(p);
		}.bind(this));

		return Promise.all(pChanges).then(function(aChangeMatrix){

			var aApplyChanges = [];

			aChangeMatrix.forEach(function(aTypeChanges){
				aApplyChanges = aApplyChanges.concat(aTypeChanges);
			});

			if (aApplyChanges.length > 0) {
				Engine.getInstance()._processChanges(oControl, aApplyChanges);
			}
		});

    };

	/**
	 * This method can be used to retrieve the PropertyHelper for a registered Control.
	 *
	 * @private
	 *
	 * @param {sap.ui.mdc.Control} vControl The registered control instance.
	 * @param {object[]} [aCustomPropertyInfo] A custom set of propertyinfo.
	 *
	 */
	Engine.prototype._retrievePropertyHelper = function(vControl, aCustomPropertyInfo){

		var oRegistryEntry = this._getRegistryEntry(vControl);

		if (aCustomPropertyInfo) {
			if (oRegistryEntry.helper){
				oRegistryEntry.helper.destroy();
			}
			oRegistryEntry.helper = new PropertyHelper(aCustomPropertyInfo);
			return Promise.resolve(oRegistryEntry.helper);
        }

		if (oRegistryEntry.helper) {
			return Promise.resolve(oRegistryEntry.helper);
		}

		return vControl.initPropertyHelper().then(function(oPropertyHelper){
			oRegistryEntry.helper = oPropertyHelper;
			return oPropertyHelper;
		}, function(sHelperError){
			throw new Error(sHelperError);
		});
	};

	/**
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * This method is the central point of access to the Engine Singleton.
	 */
	Engine.getInstance = function() {
		if (!oEngine) {
			oEngine = new Engine();
		}
		return oEngine;
	};

	/**
	 * @private
	 *
	 * This method can be used for debugging to retrieve the complete registry.
	 */
	Engine.prototype._getRegistry = function() {
		var oRegistry = {};
		this._aRegistry.forEach(function(sKey){
			var oControl = sap.ui.getCore().byId(sKey);
			oRegistry[sKey] = _mRegistry.get(oControl);
		});
		return oRegistry;
	};

	/**
	 * @override
	 * @inheritDoc
	 */
	Engine.prototype.destroy = function() {
		AdaptationProvider.prototype.destroy.apply(this, arguments);
		oEngine = null;
		this._aRegistry = null;
		_mRegistry.delete(this);
		this.defaultProviderRegistry.destroy();
		this.defaultProviderRegistry = null;
		this.uimanager.destroy();
		this.uimanager = null;
	};

	return Engine;
});
