/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/library",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/core/Core"
	], function (Controller, mobileLibrary, JSONModel, Fragment, ResourceModel, Core) {
		"use strict";

		return Controller.extend("sap.ui.documentation.sdk.cookieSettingsDialog.controller.CookieSettingsDialog", {

			constructor: function() {
				this._oCookiesUtil = null;
				this._oRootView = null;
				this._oInitOptions = null;
				this._oModel = new JSONModel();
			},

			openCookieSettingsDialog: function(oOptions, oRootView, oCookiesUtil) {
				this._oInitOptions = oOptions;
				this._oModel.setData(oOptions, true /* merge */);

				if (this._oCookieSettingsDialog) {
					this._oCookieSettingsDialog.open();
				} else {
					this._initData(oRootView, oCookiesUtil);
					Fragment.load({
						name: "sap.ui.documentation.sdk.cookieSettingsDialog.view.CookieSettingsDialog",
						controller: this
					}).then(this._initDialog.bind(this))
						.then(function(oDialog) {
							this._oCookieSettingsDialog = oDialog;
							this._oCookieSettingsDialog.open();
						}.bind(this));
				}
			},

			_initDialog: function(oDialog) {
				var oMessageBundle = new ResourceModel({
					bundleName: "sap.ui.documentation.sdk.cookieSettingsDialog.i18n.i18n"
				});
				oDialog.setModel(this._oModel, "cookieData");
				oDialog.setModel(oMessageBundle, "i18n");

				// connect dialog to the root view of this component (models, lifecycle)
				this._oRootView.addDependent(oDialog);


				oDialog.attachBeforeOpen(function() {
					this._oCookieSettingsDialog.toggleStyleClass("cookiesDetailedView",
						this._oModel.getProperty("/showCookieDetails"));
				}, this);


				oDialog.attachAfterOpen(function() {
					Core.byId("btnSetPreferences").$().focus();
				});


				if (!this._bAlreadyRequestedCookiesApproval) {
					oDialog.attachEventOnce("afterClose", function() {
						this._bAlreadyRequestedCookiesApproval = true;
						this._oCookiesUtil.setCookie(this._oCookiesUtil.COOKIE_NAMES.APPROVAL_REQUESTED, "1");
					}, this);
				}

				return oDialog;
			},

			formatCookieValue: function (sValue) {
				return Boolean(Number(sValue));
			},

			onAcceptAllCookies: function () {
				this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES, true);
				this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING, this._oModel.getProperty("/supportsUsageTracking"));

				this._oCookieSettingsDialog.close();
			},

			onRejectAllCookies: function () {
				this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES, false);
				this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING, false);

				this._oCookieSettingsDialog.close();
			},

			onSaveCookies: function() {
				var bHasConsentRequiredCookies = Core.byId("requiredCookiesSwitch").getState(),
					bHasConsentFunctionalCookies = Core.byId("functionalCookiesSwitch").getState();

				this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES, bHasConsentRequiredCookies);
				this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING, bHasConsentFunctionalCookies);

				this._oCookieSettingsDialog.close();
			},

			showCookieDetails: function() {
				this._oModel.setProperty("/showCookieDetails", true);
				this._oCookieSettingsDialog.addStyleClass("cookiesDetailedView");

				this._focusButton(Core.byId("btnSavePreferences"));
			},

			onCancelPress: function() {
				if (this._oInitOptions.showCookieDetails === true) {
					// full details were shown upon opening the dialog
					// => the cancel action should ignore all changes and close the dialog
					this.onCancelEditCookies();
				} else {
					// *no details* were shown upon opening the dialog
					// => the cancel action should navigate back to the preview
					this.hideCookieDetails();
				}
			},

			hideCookieDetails: function() {
				this._oModel.setProperty("/showCookieDetails", false);
				this._oCookieSettingsDialog.removeStyleClass("cookiesDetailedView");

				this._focusButton(Core.byId("btnSetPreferences"));
			},

			onCancelEditCookies: function() {
				this._oCookieSettingsDialog.close();
				Core.byId("requiredCookiesSwitch").setState(this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_REQUIRED_COOKIES) === "1");
				Core.byId("functionalCookiesSwitch").setState(this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_USAGE_TRACKING) === "1");
			},

			_saveCookiePreference: function(sCookieName, bEnable) {
				var sValue = bEnable ? "1" : "0",
					sOldValue;

				if (sCookieName === this._oCookieNames.ALLOW_USAGE_TRACKING) {
					sOldValue = this._oCookiesUtil.getCookieValue(sCookieName);

					if (sOldValue !== sValue) {
						bEnable && this._oCookiesUtil.enableUsageTracking();
						!bEnable && this._oCookiesUtil.disableUsageTracking();
					}
				}

				this._oCookiesUtil.setCookie(sCookieName, sValue);
				this._oModel.setProperty("/" + sCookieName, sValue);
			},

			_initData: function (oRootView, oCookiesUtil) {

				this._oCookiesUtil = oCookiesUtil;
				this._oRootView = oRootView;
				this._oCookieNames = this._oCookiesUtil.COOKIE_NAMES;
				this._bAlreadyRequestedCookiesApproval = this._oCookiesUtil.getCookieValue(this._oCookieNames.APPROVAL_REQUESTED) === "1";

				this._setInitialCookieValues();
			},

			_setInitialCookieValues: function() {
				var oData = {};
				if (!this._bAlreadyRequestedCookiesApproval) {
					// when the user opens the edit dialog for a first time, show the cookies enabled
					// the user will then edit and save his choice
					oData[this._oCookieNames.ALLOW_REQUIRED_COOKIES] = "1";
					oData[this._oCookieNames.ALLOW_USAGE_TRACKING] = "1";
				} else {
					oData[this._oCookieNames.ALLOW_REQUIRED_COOKIES] = this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_REQUIRED_COOKIES);
					oData[this._oCookieNames.ALLOW_USAGE_TRACKING] = this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_USAGE_TRACKING);
				}

				this._oModel.setData(oData, true /* merge */);
			},

			_focusButton: function(oButton) {
				if (oButton.$().length) {
					oButton.$().focus();
					return;
				}

				oButton.addEventDelegate({
					"onAfterRendering": function() {
						oButton.$().focus();
						oButton.removeEventDelegate(this);
					}
				});
			}

		});
	}
);