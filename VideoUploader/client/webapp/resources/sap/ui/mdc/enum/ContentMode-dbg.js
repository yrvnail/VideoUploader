/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(function() {
	"use strict";

	/**
	 * Defines in which mode the content of a <code>Field</code> or <code>FilterField</code> is rendered.
	 *
	 * @enum {string}
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 * @since 1.87
	 * @alias sap.ui.mdc.enum.ContentMode
	 */
	var ContentMode = {
		/**
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		Display: "Display",
		/**
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		Edit: "Edit",
		/**
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		EditMulti: "EditMulti",
		/**
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		EditMultiLine: "EditMultiLine",
		/**
		 * @private
		 * @ui5-restricted sap.ui.mdc
		 */
		EditOperator: "EditOperator"
	};

	return ContentMode;

}, /* bExport= */ true);
