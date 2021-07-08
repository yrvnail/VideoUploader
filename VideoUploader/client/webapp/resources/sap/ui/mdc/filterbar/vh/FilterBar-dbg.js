/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(
	[
		"sap/m/library",
		"sap/ui/mdc/filterbar/FilterBarBase",
		"sap/ui/mdc/filterbar/FilterBarBaseRenderer",
		"sap/ui/mdc/filterbar/aligned/FilterItemLayout",
		"sap/ui/mdc/filterbar/vh/FilterContainer",
		"sap/m/Button"
	],
	function (
		mLibrary,
		FilterBarBase,
		FilterBarBaseRenderer,
		FilterItemLayout,
		FilterContainer,
		Button
	) {
		"use strict";

		/**
		 * Constructor for a new FilterBar.
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] initial settings for the new control
		 * @class The <code>FilterBar</code> control is used to display filter properties in a user-friendly manner to populate values for a query.
		 * The filters are arranged in a logical row that is divided depending on the space available and the width of the filters.
		 * The Go button triggers the search event, and the Show Filters button shows the additional filter field.<br>
		 * The <code>FilterBar</code> control creates and handles the filters based on the provided metadata information.
		 * The metadata information is provided via the {@link sap.ui.mdc.FilterBarDelegate FilterBarDelegate} implementation. This implementation has to be provided by the application.
		 * @extends sap.ui.mdc.filterbar.FilterBarBase
		 * @author SAP SE
		 * @version 1.90.1
		 * @constructor
		 * @private
		 * @since 1.84.0
		 * @alias sap.ui.mdc.filterbar.vh.FilterBar
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var FilterBar = FilterBarBase.extend(
			"sap.ui.mdc.filterbar.vh.FilterBar",
			{
				metadata: {
					properties: {
						/**
						 * Determines whether the Show/Hide Filters button is in the state show or hide.<br>
						 */
						expandFilterFields: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Number of FilterItems which will be shown via Show Filters.<br>
						 */
						filterFieldThreshold: {
							type: "int",
							defaultValue: 8
						}

						// delegate: {
						// 	type: "object",
						// 	group: "Data",
						// 	defaultValue: {name: 'sap/ui/mdc/filterbar/vh/GenericFilterBarDelegate'}
						// }
					},
					aggregations : {
						/**
						 * <code>collectiveSearch</code> control of the filterbar.
						 *
						 * @since 1.87.0
						 */
						collectiveSearch: {
							type: "sap.ui.mdc.filterbar.vh.CollectiveSearchSelect",
							multiple: false
						}
					}
				},

				renderer: FilterBarBaseRenderer
			}
		);

		var ButtonType = mLibrary.ButtonType;

		FilterBar.prototype._createInnerLayout = function () {
			this._cLayoutItem = FilterItemLayout;

			this._oFilterBarLayout = new FilterContainer(this.getId() + "-innerLayout", {});
			this.setAggregation("layout", this._oFilterBarLayout, true);


			this._oBtnFilters = new Button(this.getId() + "-btnShowFilters", {
				type: ButtonType.Transparent,
				press: this._onToggleFilters.bind(this)
			});
			this._oBtnFilters.bindProperty("text", {
				model : FilterBarBase.INNER_MODEL_NAME,
				path: "/expandFilterFields",
				formatter: function(bExpandFilterFields) {
					return this._oRb.getText("valuehelp." + (bExpandFilterFields ? "HIDE" : "SHOW") + "ADVSEARCH");
				}.bind(this)
			});
			this._oBtnFilters.bindProperty("visible", {
				model : FilterBarBase.INNER_MODEL_NAME,
				path: "/filterItems",
				formatter: function(aItems) {
					return aItems.length > 0;
				}
			});

			this._oFilterBarLayout.addControl(
				this._getSearchButton().bindProperty("visible", {
					parts: [
						{
							path: '/showGoButton',
							model: FilterBarBase.INNER_MODEL_NAME
						}, {
							path: "/liveMode",
							model: FilterBarBase.INNER_MODEL_NAME
						}
					],
					formatter: function(bShowGoButton, bLiveMode) {
						return bShowGoButton && ((this._isPhone()) ? true : !bLiveMode);
					}.bind(this)
				})
			);

			this._oFilterBarLayout.addControl(this._oBtnFilters);


			this._oShowAllFiltersBtn = new Button(this.getId() + "-btnShowAllFilters", {
				type: ButtonType.Transparent,
				press: this._onShowAllFilters.bind(this),
				text: this._oRb.getText("valuehelp.SHOWALLFILTERS")
			});

			this._oFilterBarLayout.addEndContent(this._oShowAllFiltersBtn);
		};

		FilterBar.prototype.exit = function() {
			FilterBarBase.prototype.exit.apply(this, arguments);
			this._oBasicSearchField = null;
			this._oCollectiveSearch = null;
			this._oBtnFilters = null;
			this._oShowAllFiltersBtn = null;
		};

		FilterBar.prototype._onToggleFilters = function (oEvent) {
			this.setExpandFilterFields(!this.getExpandFilterFields());
		};

		FilterBar.prototype._onShowAllFilters = function (oEvent) {
			this._oFilterBarLayout._updateFilterBarLayout(true);
		};

		FilterBar.prototype.setCollectiveSearch = function (oCollectiveSearch) {
			if (this._oCollectiveSearch) {
				if (this._oFilterBarLayout) {
					this._oFilterBarLayout.removeControl(this._oCollectiveSearch);
				}
			}
			this._oCollectiveSearch = oCollectiveSearch;
			if (this._oFilterBarLayout && this._oCollectiveSearch) {
				this._oFilterBarLayout.insertControl(this._oCollectiveSearch, 0);
			}

			return this;
		};

		FilterBar.prototype.getCollectiveSearch = function () {
			return this._oCollectiveSearch;
		};

		FilterBar.prototype.destroyCollectiveSearch = function () {
			if (this._oCollectiveSearch && this._oFilterBarLayout) {
				this._oFilterBarLayout.removeControl(this._oCollectiveSearch);
				this._oCollectiveSearch.destroy();
				this._oCollectiveSearch = undefined;
			}

			return this;
		};


		FilterBar.prototype.setBasicSearchField = function (oBasicSearchField) {
			if (this._oBasicSearchField) {
				if (this._oFilterBarLayout) {
					this._oFilterBarLayout.removeControl(this._oBasicSearchField);
				}
				this._oBasicSearchField.detachSubmit(this._handleFilterItemSubmit, this);
			}
			this._oBasicSearchField = oBasicSearchField;

			if (oBasicSearchField) {
				this.setExpandFilterFields(false);

				if (this._oFilterBarLayout) {
					this._oFilterBarLayout.insertControl(oBasicSearchField, this._oCollectiveSearch ? 1 : 0);
				}

				oBasicSearchField.attachSubmit(this._handleFilterItemSubmit, this);
				if (!this._oObserver.isObserved(oBasicSearchField, {properties: ["visible"]})) {
					this._oObserver.observe(oBasicSearchField, {properties: ["visible"]});
				}
			}

			return this;
		};

		FilterBar.prototype.getBasicSearchField = function () {
			return this._oBasicSearchField;
		};

		FilterBar.prototype.destroyBasicSearchField = function () {
			if (this._oBasicSearchField && this._oFilterBarLayout) {
				this._oFilterBarLayout.removeControl(this._oBasicSearchField);
				this._oBasicSearchField.detachSubmit(this._handleFilterItemSubmit, this);
				if (this._oObserver.isObserved(this._oBasicSearchField, {properties: ["visible"]})) {
					this._oObserver.unobserve(this._oBasicSearchField);
				}
				this._oBasicSearchField.destroy();
				this._oBasicSearchField = undefined;
			}

			return this;
		};

		return FilterBar;
	}
);
