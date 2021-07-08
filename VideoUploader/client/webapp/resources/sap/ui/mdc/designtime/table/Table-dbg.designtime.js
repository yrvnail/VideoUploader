/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/mdc/p13n/Engine"
], function (Engine) {
	"use strict";

	return {
		name: "{name}",
		description: "{description}",
		actions: {
			settings: function () {
				//RTA expects the settings to be returned as function
				return {
					handler: function (oControl, mPropertyBag) {
						return Engine.getInstance().getRTASettingsActionHandler(oControl, mPropertyBag, oControl.getP13nMode());
					}
				};
			}
		}
	};

});
