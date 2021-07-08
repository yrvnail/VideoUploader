/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/mdc/p13n/PersistenceProvider"
], function (BaseObject, PersistenceProvider) {
	"use strict";

	var ERROR_INSTANCING = "DefaultProviderRegistry: This class is a singleton and should not be used without an AdaptationProvider. Please use 'sap.ui.mdc.p13n.Engine.getInstance().defaultProviderRegistry' instead";

	//Singleton storage
	var oDefaultProviderRegistry;

	/**
	 * Constructor for a new DefaultProviderRegistry.
	 * This registry creates and manages default persistence providers for each persistence mode.
	 * It is intended for use cases where no dedicated provider can or should be created by an application.
	 * The DefaultProviderRegistry currently resides in the Engine and must never be called separately.
	 *
	 * @class
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.90.1
	 *
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 * @experimental As of version 1.89
	 * @since 1.89
	 * @alias sap.ui.mdc.p13n.DefaultProviderRegistry
	 */
	var DefaultProviderRegistry = BaseObject.extend("sap.ui.mdc.p13n.DefaultProviderRegistry", {
		constructor: function() {

			if (oDefaultProviderRegistry) {
				throw Error(ERROR_INSTANCING);
			}

			BaseObject.call(this);
			this._mDefaultProviders = {};
		}
	});

	/**
	 * @override
	 * @inheritDoc
	 */
	DefaultProviderRegistry.prototype.destroy = function() {
		Object.keys(this._mDefaultProviders).forEach(function (sProviderName) {
			this._mDefaultProviders[sProviderName].destroy();
			delete this._mDefaultProviders[sProviderName];
		}.bind(this));
		BaseObject.prototype.destroy.apply(this, arguments);
	};

	/**
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * Attaches a control to a default persistence provider held inside the DefaultProviderRegistry for the given <code>PersistenceMode</code>
	 *
	 * @param {sap.ui.mdc.Control|string} vControl The control instance or a control id.
	 * @param {sap.ui.mdc.enum.PersistenceMode} sPersistenceMode Desired persistence mode for the retrieved persistence provider
	 * @returns {sap.ui.mdc.p13n.PersistenceProvider} Returns a persistence provider instance, if possible
	 */
	DefaultProviderRegistry.prototype.attach = function (vControl, sPersistenceMode) {
		if (vControl.getEngine().isRegisteredForModification(vControl)) { // Modification settings for a registered control are only determined once in the Engine
			throw new Error("DefaultProviderRegistry: You must not change the modificationSettings for an already registered control");
		}
		var oDefaultProvider = this._retrieveDefaultProvider(sPersistenceMode);
		var sControlId = typeof vControl === "string" ? vControl : vControl.getId();
		if (oDefaultProvider.getFor().indexOf(sControlId) === -1) {
			oDefaultProvider.addFor(vControl);
		}

		return oDefaultProvider;
	};

	/**
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * Detaches a control from any existing default persistence provider
	 *
	 * @param {sap.ui.mdc.Control|string} vControl The control instance or a control id.
	 */
	DefaultProviderRegistry.prototype.detach = function (vControl) {
		Object.keys(this._mDefaultProviders).forEach(function (sMode) {
			var oDefaultProvider = this._mDefaultProviders[sMode];
			oDefaultProvider.removeFor(vControl);
		}.bind(this));
	};

	/**
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * Returns a promise resolving a default persistence provider for the given <code>Control</code> and <code>PersistenceMode</code>.
	 *
	 * @param {sap.ui.mdc.enum.PersistenceMode} sPersistenceMode Desired persistence mode for the retrieved persistence provider
	 * @returns {Promise} Returns a <code>Promise</code> returning a persistence provider instance, if possible
	 */
	DefaultProviderRegistry.prototype._retrieveDefaultProvider = function (sPersistenceMode) {
		this._mDefaultProviders[sPersistenceMode] = this._mDefaultProviders[sPersistenceMode] || new PersistenceProvider({mode: sPersistenceMode});
		return this._mDefaultProviders[sPersistenceMode];
	};

	/**
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 *
	 * This method is the central point of access to the DefaultProviderRegistry Singleton.
	 */
	 DefaultProviderRegistry.getInstance = function() {
		if (!oDefaultProviderRegistry) {
			oDefaultProviderRegistry = new DefaultProviderRegistry();
		}
		return oDefaultProviderRegistry;
	};

	return DefaultProviderRegistry;
});
