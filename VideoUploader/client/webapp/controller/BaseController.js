sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(Controller, History, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("FileUploaderService.controller.BaseController", {

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("Default", {}, true);
			}
		},

		setBusy: function(state) {
			this.getModel("appView").setProperty("/busy", state);
		},

		setJsonModel: function(sModelName) {
			var oJsonModel = new JSONModel();
			this.setModel(oJsonModel, sModelName);
		},

		showMessageToast: function(sText, aParams) {
			var oI18n = this.getResourceBundle();
			// var sResult
			MessageToast.show(oI18n.getText(sText, aParams), {
				duration: 3000,
				autoClose: true,
				animationTimingFunction: "ease",
				animationDuration: 1000,
				closeOnBrowserNavigation: false
			});
		},

		showMessageBox: function(sError, sText) {
			var oI18n = this.getResourceBundle();
			MessageBox.error(sError, {
					title: oI18n.getText(sText),
					actions: [MessageBox.Action.CLOSE]
				}
			);
		}

	});
});