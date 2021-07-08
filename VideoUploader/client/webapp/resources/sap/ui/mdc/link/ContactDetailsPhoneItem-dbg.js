/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/ui/core/Element'
], function(Element) {
	"use strict";

	/**
	 * Constructor for a new ContactDetailsPhoneItem.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class Type for...
	 * @extends sap.ui.core.Element
	 * @version 1.90.1
	 * @constructor
	 * @private
	 * @since 1.56.0
	 * @alias sap.ui.mdc.link.ContactDetailsPhoneItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ContactDetailsPhoneItem = Element.extend("sap.ui.mdc.link.ContactDetailsPhoneItem", /** @lends sap.ui.mdc.link.ContactDetailsPhoneItem.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * Phone number
				 */
				uri: {
					type: "string"
				},
				types: {
					type: "sap.ui.mdc.ContactDetailsPhoneType[]",
					defaultValue: []
				}
			}
		}
	});

	return ContactDetailsPhoneItem;

});
