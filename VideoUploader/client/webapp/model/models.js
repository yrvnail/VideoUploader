sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createAppViewModel: function() {
			var sTaskViewModelPath = jQuery.sap.getModulePath("FileUploaderService.model.AppViewModel", ".json");
			var oTaskViewModel = new JSONModel(sTaskViewModelPath);
			return oTaskViewModel;
		}

	};
});