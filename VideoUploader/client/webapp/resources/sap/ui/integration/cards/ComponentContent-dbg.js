/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/integration/cards/BaseContent",
	"./ComponentContentRenderer",
	"sap/ui/core/ComponentContainer"
], function (
	BaseContent,
	ComponentContentRenderer,
	ComponentContainer
) {
	"use strict";

	/**
	 * Constructor for a new <code>Component</code> Card Content.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A control that allows a Component to be put inside a card content
	 *
	 * @extends sap.ui.integration.cards.BaseContent
	 *
	 * @author SAP SE
	 * @version 1.90.1
	 *
	 * @experimental
	 * @constructor
	 * @private
	 * @alias sap.ui.integration.cards.ComponentContent
	 */
	var ComponentContent = BaseContent.extend("sap.ui.integration.cards.ComponentContent", {
		metadata: {
			library: "sap.ui.integration"
		},
		renderer: ComponentContentRenderer
	});

	ComponentContent.prototype.setConfiguration = function (oConfiguration) {
		BaseContent.prototype.setConfiguration.apply(this, arguments);

		if (!oConfiguration) {
			return;
		}

		var oContainer = new ComponentContainer({
			manifest: oConfiguration.componentManifest,
			async: true,
			componentCreated: function (oEvent) {
				var oComponent = oEvent.getParameter("component"),
					oCard = this.getParent();

				if (oComponent.onCardReady) {
					oComponent.onCardReady(oCard);
				}

				// TODO _updated event is always needed, so that the busy indicator knows when to stop. We should review this for contents which do not have data.
				this.fireEvent("_actionContentReady");
				this.fireEvent("_updated");
			}.bind(this),
			componentFailed: function () {
				this.fireEvent("_actionContentReady");
				this.handleError("Card content failed to create component");
			}.bind(this)
		});

		this.setAggregation("_content", oContainer);
	};

	return ComponentContent;
});
