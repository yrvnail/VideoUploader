/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/LoaderExtensions",
	"sap/base/i18n/ResourceBundle",
	"sap/base/util/includes"
], function (LoaderExtensions, ResourceBundle, includes) {
	"use strict";

	/**
	 * @class
	 * @alias sap.ui.integration.designtime.editor.CardResourceBundles
	 * @author SAP SE
	 * @since 1.88.0
	 * @version 1.90.1
	 * @private
	 * @experimental since 1.88.0
	 * @ui5-restricted
	 */
	var CardResourceBundles = (function () {

		var aCardResourceBundles;

		function init(sResourceBundleURL) {
			aCardResourceBundles = [];
			//load the language list from languages.json file
			var aLanguageList = LoaderExtensions.loadResource("sap/ui/integration/designtime/editor/languages.json", {
				dataType: "json",
				failOnError: false,
				async: false
			});
			//according to the language list, load each resource bundle
			for (var p in aLanguageList) {
				var aFallbacks = [p];
				if (p.indexOf("_") > -1) {
					aFallbacks.push(p.substring(0, p.indexOf("_")));
				}
				//add en into fallbacks
				if (!includes(aFallbacks, "en")) {
					aFallbacks.push("en");
				}
				var oResourceBundleTemp = ResourceBundle.create({
					url: sResourceBundleURL,
					async: false,
					locale: p,
					supportedLocales: aFallbacks,
					fallbackLocale: "en"
				});
				aCardResourceBundles[p] = {"language": aLanguageList[p], "resourceBundle": oResourceBundleTemp};
			}
			return aCardResourceBundles;
		}

		return {
			getInstance: function (sResourceBundleURL) {
				if (!aCardResourceBundles) {
					aCardResourceBundles = init(sResourceBundleURL);
				}
				return aCardResourceBundles;
			}
		};

	})();

	return CardResourceBundles;
});