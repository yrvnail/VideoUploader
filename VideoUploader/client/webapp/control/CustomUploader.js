sap.ui.define([
		"sap/m/upload/Uploader",
		"sap/ui/Device"
	],
	function(Uploader, Device) {

		var CustomUploader = Uploader.extend("FileUploaderService.control.CustomUploader");

		CustomUploader.prototype.uploadItem = function(oItem, aHeaderFields) {
			var oAuthXhr = new XMLHttpRequest();
			var sHttpRequestMethod = "Post";
			var oOuterThis = this;
			oAuthXhr.open(sHttpRequestMethod, "/config", true);
			oAuthXhr.withCredentials = true;
			oAuthXhr.onreadystatechange = function() {
				if (this.readyState === window.XMLHttpRequest.DONE) {
					var oXhr = new window.XMLHttpRequest(),
						oFile = oItem.getFileObject(),
						oRequestHandler = {
							xhr: oXhr,
							item: oItem
						};
					oXhr.open(sHttpRequestMethod, "/upload", true);

					if ((Device.browser.edge || Device.browser.internet_explorer) && oFile.type && oXhr.readyState === 1) {
						oXhr.setRequestHeader("Content-Type", oFile.type);
					}

					if (aHeaderFields) {
						aHeaderFields.forEach(function(oHeader) {
							oXhr.setRequestHeader(oHeader.getKey(), oHeader.getText());
						});
					}

					oXhr.setRequestHeader("slug", encodeURIComponent(oFile.name));
					oXhr.setRequestHeader("user-credentials", encodeURIComponent(this.response));

					oXhr.upload.addEventListener("progress", function(oEvent) {
						oOuterThis.fireUploadProgressed({
							item: oItem,
							loaded: oEvent.loaded,
							total: oEvent.total,
							aborted: false
						});
					});

					oXhr.onreadystatechange = function() {
						var oHandler = oOuterThis._mRequestHandlers[oItem.getId()];
						if (this.readyState === window.XMLHttpRequest.DONE && !oHandler.aborted) {
							oItem.responseRaw = this.response;
							oItem.status = this.status;
							oItem.statusText = this.statusText;
							oOuterThis.fireUploadCompleted({
								item: oItem
							});
						}
					};

					oOuterThis._mRequestHandlers[oItem.getId()] = oRequestHandler;
					oXhr.send(oItem.getFileObject());
					oOuterThis.fireUploadStarted({
						item: oItem
					});
				}
			};
			oAuthXhr.send("");

		};

		return CustomUploader;
	}
);