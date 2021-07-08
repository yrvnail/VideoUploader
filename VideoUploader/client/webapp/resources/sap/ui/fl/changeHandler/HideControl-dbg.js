/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/Log",
	'sap/ui/fl/changeHandler/JsControlTreeModifier'
], function(
	Log,
	JsControlTreeModifier
) {
	"use strict";

	var PROPERTY_NAME = "visible";

	/**
	 * Change handler for hiding of a control.
	 * @alias sap.ui.fl.changeHandler.HideControl
	 * @author SAP SE
	 * @version 1.90.1
	 * @experimental Since 1.27.0
	 */
	var HideControl = {};

	/**
	 * Hides a control.
	 *
	 * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
	 * @param {object} mPropertyBag - map of properties
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @return {boolean} true - if change could be applied
	 * @public
	 */
	HideControl.applyChange = function(oChange, oControl, mPropertyBag) {
		oChange.setRevertData({
			originalValue: mPropertyBag.modifier.getVisible(oControl)
		});

		mPropertyBag.modifier.setVisible(oControl, false);
		return true;
	};


	/**
	 * Reverts previously applied change
	 *
	 * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
	 * @param {object} mPropertyBag	- map of properties
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @return {boolean} true - if change has been reverted
	 * @public
	 */
	HideControl.revertChange = function(oChange, oControl, mPropertyBag) {
		var mRevertData = oChange.getRevertData();

		if (mRevertData) {
			mPropertyBag.modifier.setVisible(oControl, mRevertData.originalValue);
			oChange.resetRevertData();
		} else {
			Log.error("Attempt to revert an unapplied change.");
			return false;
		}

		return true;
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change object to be completed
	 * @param {object} oSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	HideControl.completeChangeContent = function() {
	};

	/**
	 * Retrieves the condenser-specific information.
	 *
	 * @param {sap.ui.fl.Change} oChange - Change object with instructions to be applied on the control map
	 * @returns {object} - Condenser-specific information
	 * @public
	 */
	HideControl.getCondenserInfo = function(oChange) {
		return {
			affectedControl: oChange.getSelector(),
			classification: sap.ui.fl.condenser.Classification.Reverse,
			uniqueKey: PROPERTY_NAME
		};
	};

	HideControl.getChangeVisualizationInfo = function(oChange, oAppComponent) {
		var oSelector = oChange.getSelector();
		var oElement = JsControlTreeModifier.bySelector(oSelector, oAppComponent);
		return {
			affectedControls: [oSelector],
			displayControls: [oElement.getParent().getId()]
		};
	};

	return HideControl;
},
/* bExport= */true);
