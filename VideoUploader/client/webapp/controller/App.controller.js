sap.ui.define([
	"FileUploaderService/controller/BaseController",
	"sap/ui/core/Item",
	"sap/m/ObjectAttribute",
	"FileUploaderService/model/formatter"
], function (BaseController, Item, ObjectAttribute, formatter) {
	"use strict";

	return BaseController.extend("FileUploaderService.controller.App", {

		formatter: formatter,

		onInit: function () {
			var oViewModel = this.getOwnerComponent().getModel("appView");
			this.setModel(oViewModel, "appView");
			this.oUploadSet = this.byId("uploadSet");
			this.oUploadSet.registerUploaderEvents(this.byId("CustomUploader"));
		},

		onAfterRendering: function () {
			var aEvents = ["afterItemRemoved", "afterItemEdited", "beforeItemAdded"];
			aEvents.forEach(function (sEvent) {
				this.oUploadSet.attachEvent(sEvent, this[sEvent].bind(this));
			}, this);
			this.onConfigAuth();
		},

		onConfigAuth: function () {
			var oViewModel = this.getModel("appView");
			var oAuthXhr = new XMLHttpRequest();
			var sHttpRequestMethod = "POST";
			oAuthXhr.open(sHttpRequestMethod, "/config", true);
			oAuthXhr.withCredentials = true;
			oAuthXhr.onreadystatechange = function () {
				if (this.readyState === window.XMLHttpRequest.DONE) {
					var oXhr = new window.XMLHttpRequest();
					sHttpRequestMethod = "GET";
					oXhr.open(sHttpRequestMethod, "/upload", true);
					oXhr.setRequestHeader("user-credentials", encodeURIComponent(this.response));
					oXhr.onreadystatechange = function () {
						if (this.readyState === window.XMLHttpRequest.DONE) {
							oViewModel.setProperty("/items", JSON.parse(this.response));
							oViewModel.refresh(true);
						}
					};
					oXhr.send();
				}
			};
			oAuthXhr.send("");

		},

		beforeItemAdded: function (oEvent) {
			var aFileTypes = oEvent.getSource().getFileTypes();
			var sSupportedFileTypes;
			var oItem = oEvent.getParameter("item");
			var sFileExtension = oItem.getFileName().split(".").pop();
			if (!aFileTypes.includes(sFileExtension)) {
				aFileTypes.forEach(function (oFileItem) {
					oFileItem = "*." + oFileItem;
				});
				sSupportedFileTypes = aFileTypes.join(", ");
				this.showMessageToast("fu.fragment.uploadSet.typeMissmatch", [sFileExtension, sSupportedFileTypes]);
				oEvent.preventDefault();
			}

		},

		onUploadTerminated: function (oEvent) {
			var oItem = oEvent.getParameter("item");

			this.showMessageToast("fu.fragment.uploadSet.item.uploadTerminated");

			this.oUploadSet.removeIncompleteItem(oItem);
		},

		onBeforeUploadStarts: function (oEvent) {

		},

		onUploadComplete: function (oEvent) {
			this.handleStatus(oEvent);
		},

		handleStatus: function (oEvent) {
			var oResponseItem = oEvent.mParameters.item;
			var iResponseStatus = oResponseItem.status;
			switch (iResponseStatus) {
				case 200:
					this._addResponseTextToItem(oResponseItem, "fu.fragment.uploadSet.item.success");
					break;
				default:
					oResponseItem.setEnabledEdit(false);
					oResponseItem.setEnabledRemove(false);
					this._addResponseTextToItem(oResponseItem, "fu.fragment.uploadSet.item.error");
					this.showMessageBox(oResponseItem.responseRaw, "fu.fragment.uploadSet.item.error");
					break;
			}
		},

		_addResponseTextToItem: function (oResponseItem, sAttrTitle) {
			var oI18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			oResponseItem.addAggregation("attributes", new ObjectAttribute({
				title: oI18n.getText(sAttrTitle),
				text: "\u000a" + oResponseItem.responseRaw
			}));
		},

		afterItemRemoved: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var that = this;
			var oItemAttribute = oItem.getAggregation("attributes")[0];
			var sPath = oItemAttribute.getText().substring(1);
			var oXhr = new XMLHttpRequest();
			var sHttpRequestMethod = "DELETE";
			oXhr.open(sHttpRequestMethod, "/upload", true);
			oXhr.setRequestHeader("filepath", encodeURIComponent(sPath));
			oXhr.onreadystatechange = function () {
				if (this.readyState === window.XMLHttpRequest.DONE) {
					if (this.status === 200) {
						that.showMessageToast("fu.fragment.uploadSet.item.deleteSuccess");
					} else {
						that.showMessageBox(this.response, "fu.fragment.uploadSet.item.error");
					}
				}
			};
			oXhr.send("");
		},

		afterItemEdited: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var that = this;
			var oItemAttribute = oItem.getAggregation("attributes")[0];
			var sPath = oItemAttribute.getText().substring(1);
			var oXhr = new XMLHttpRequest();
			var sHttpRequestMethod = "PUT";
			var sNewFileName = oItem.getProperty("fileName");
			if (this._checkSymbolsAcceptance(oEvent, sNewFileName)) {
				oXhr.open(sHttpRequestMethod, "/upload", true);
				oXhr.setRequestHeader("filepath", encodeURIComponent(sPath));
				oXhr.setRequestHeader("newfilename", encodeURIComponent(sNewFileName));
				oXhr.onreadystatechange = function () {
					if (this.readyState === window.XMLHttpRequest.DONE) {
						if (this.status === 200) {
							that.showMessageToast("fu.fragment.uploadSet.item.editSuccess");
						} else {
							that.showMessageBox(this.response, "fu.fragment.uploadSet.item.error");
						}
					}
				};
				oXhr.send("");
			}
		},

		_checkSymbolsAcceptance: function (oEvent, sNewFileName) {
			if (/[/\\?%*:|"<>]/g.test(sNewFileName)) {
				oEvent.preventDefault();
				this.showMessageToast("fu.fragment.uploadSet.item.uncorrectFileName");
				return false;
			}
			return true;
		}
	});
});