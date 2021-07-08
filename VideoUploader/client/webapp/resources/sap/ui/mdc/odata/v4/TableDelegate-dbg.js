/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"../../TableDelegate",
	"../../util/loadModules",
	"../../library",
	"sap/m/ColumnPopoverSelectListItem",
	"sap/ui/core/Item",
	"sap/ui/core/Core",
	"sap/ui/core/library",
	"sap/m/MessageBox"
], function(
	TableDelegate,
	loadModules,
	library,
	ColumnPopoverSelectListItem,
	Item,
	Core,
	coreLibrary,
	MessageBox
) {
	"use strict";

	var TableType = library.TableType;
	var TableMap = new window.WeakMap(); // To store table-related information for easy access in the delegate.

	/**
	 * Delegate class for sap.ui.mdc.Table and ODataV4.
	 * Enables additional analytical capabilities.
	 * <b>Note:</b> The class is experimental and the API/behavior is not finalized.
	 *
	 * @author SAP SE
	 * @private
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 * @since 1.85
	 * @alias sap.ui.mdc.odata.v4.TableDelegate
	 */
	var Delegate = Object.assign({}, TableDelegate);

	/**
	 * Fetches the model-specific property helper class or instance.
	 *
	 * @param {sap.ui.mdc.Table} oTable Instance of the MDC table
	 * @param {object[]} aProperties The property infos
	 * @param {Promise<object<string, object>|null>} mExtensions The property extensions
	 * @returns {Promise<sap.ui.mdc.table.V4AnalyticsPropertyHelper>} A promise that resolves with the property helper class or instance
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 */
	Delegate.fetchPropertyHelper = function(oTable, aProperties, mExtensions) {
		return loadModules("sap/ui/mdc/table/V4AnalyticsPropertyHelper").then(function(aResult) {
			return aResult[0];
		});
	};

	/**
	 * Fetches the property extensions.
	 * TODO: document structure of the extension
	 *
	 * @param {sap.ui.mdc.Table} oTable Instance of the MDC table
	 * @param {object[]} aProperties The property infos
	 * @returns {Promise<object<string, object>|null>} Key-value map, where the key is the name of the property, and the value is the extension
	 * @protected
	 */
	Delegate.fetchPropertyExtensions = function(oTable, aProperties) {
		return Promise.resolve(null);
	};

	/**
	 * Retrieves the relevant metadata that will be used for the table binding, and returns the property info array.
	 * If not overriden, this method return the same as <code>fetchProperties</code>.
	 * When overridding, make sure the returned result is consistent with what is returned by <code>fetchProperties</code>.
	 *
	 * @param {Object} oControl MDC Control instance
	 * @returns {Promise} Once resolved, an array of property info objects is returned
	 * @protected
	*/
	Delegate.fetchPropertiesForBinding = function(oTable) {
		return this.fetchProperties(oTable);
	};

	/**
	 * Fetches the property extensions that will be used for the table binding.
	 * If not overriden, this method eturn the same as <code>fetchPropertyExtensions</code>.
	 * When overridding, make sure the returned result is consistent with what is returned by <code>fetchPropertyExtensions</code>.
	 *
	 * @param {sap.ui.mdc.Table} oTable Instance of the MDC table
	 * @param {object[]} aProperties The property infos
	 * @returns {Promise<object<string, object>|null>} Key-value map, where the key is the name of the property, and the value is the extension
	 * @protected
	 */
	Delegate.fetchPropertyExtensionsForBinding = function(oTable, aProperties) {
		return this.fetchPropertyExtensions(oTable, aProperties);
	};

	/**
	 * Formats the title text of a group header row of the table.
	 *
	 * @param {sap.ui.mdc.Table} oTable Instance of the MDC table
	 * @param {sap.ui.model.Context} oContext Binding context
	 * @param {string} sProperty The name of the grouped property
	 * @returns {string | undefined} The group header title. If <code>undefined</code> is returned, the default group header title is set.
	 */
	Delegate.formatGroupHeader = function(oTable, oContext, sProperty) {};

	Delegate.preInit = function(oTable) {
		if (oTable._getStringType() === TableType.ResponsiveTable) {
			return;
		}

		// disable temporary count in toolbar -> CPOUIFTEAMB-1769
		// TODO: remove this once a solution has been found
		oTable.setShowRowCount(false);
		oTable.setShowRowCount = function() {
			return this;
		};
		/************************************/

		return enrichGridTable(oTable);
	};

	Delegate.addColumnMenuItems = function(oTable, oMDCColumn) {
		var oPropertyHelper = oTable.getPropertyHelper();
		var aGroupProperties = oPropertyHelper.getGroupableProperties(oMDCColumn.getDataProperty());
		var aAggregateProperties = oPropertyHelper.getAggregatableProperties(oMDCColumn.getDataProperty());
		var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc");
		var oPopover = oTable._oPopover;
		oPopover && oPopover.getItems().forEach(function(item, index, aItems) {
			if (item.getLabel() === oResourceBundle.getText("table.SETTINGS_GROUP") || item.getLabel() === oResourceBundle.getText("table.SETTINGS_TOTALS")) {
				aItems[index].destroy();
			}
			if (aItems.length == 0 ) {
				oPopover.destroy();
			}
		});

		var oAggregatePopover, oGroupPopover;
		if (oTable.isGroupingEnabled() && aGroupProperties && aGroupProperties.length > 0) {
			oGroupPopover = this._onGroup(aGroupProperties, oMDCColumn);
		}

		if (oTable.isAggregationEnabled() && aAggregateProperties && aAggregateProperties.length > 0) {
			oAggregatePopover = this._onAggregate(aAggregateProperties, oMDCColumn);
		}
		return [oGroupPopover, oAggregatePopover];
	};

	Delegate._onGroup = function(aGroupProperties, oMDCColumn) {
		var oGroupChild, aGroupChildren = [];
		var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc");
		aGroupProperties.forEach(function(oGroupProperty) {
			oGroupChild = new Item({
				text: oGroupProperty.getLabel(),
				key: oGroupProperty.getName()
			});
			aGroupChildren.push(oGroupChild);
		});
		if (aGroupChildren.length > 0) {
			var oGroupPopover = new ColumnPopoverSelectListItem({
				items: aGroupChildren,
				label: oResourceBundle.getText("table.SETTINGS_GROUP"),
				icon: "sap-icon://group-2",
				action: [{
					sName: "Group",
					oMDCColumn: oMDCColumn
				}, this._checkForPreviousAnalytics, this]
			});
			return oGroupPopover;
		}
	};

	Delegate._onAggregate = function(aAggregateProperties, oMDCColumn) {
		var oAggregateChild, aAggregateChildren = [];
		var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc");
		aAggregateProperties.forEach(function(oAggregateProperty) {
			oAggregateChild = new Item({
				text: oAggregateProperty.getLabel(),
				key: oAggregateProperty.getName()
			});
			aAggregateChildren.push(oAggregateChild);
		});

		if (aAggregateChildren.length > 0) {
			var oAggregatePopover = new ColumnPopoverSelectListItem({
				items: aAggregateChildren,
				label: oResourceBundle.getText("table.SETTINGS_TOTALS"),
				icon: "sap-icon://sum",
				action: [{
					sName: "Aggregate",
					oMDCColumn: oMDCColumn
				}, this._checkForPreviousAnalytics, this]
			});
			return oAggregatePopover;
		}
	};

	Delegate._checkForPreviousAnalytics = function(oEvent, oData) {
		var sName = oData.sName,
			sTitle,
			sMessage,
			sActionText,
			oMDCColumn = oData.oMDCColumn,
			oTable = oMDCColumn.getParent(),
			aGroupLevels = oTable.getCurrentState().groupLevels || [],
			oAggregate = oTable.getCurrentState().aggregations || {},
			aAggregate = Object.keys(oAggregate),
			bForcedAnalytics = false,
			sPath = oEvent.getParameter("property");

		var aAnalytics = sName == "Aggregate" ? aGroupLevels : aAggregate;
		var bForce = aAnalytics.filter(function(item) {
			return sName == "Aggregate" ? item.name === sPath : item === sPath;
		}).length > 0;

		if (bForce) {
			var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc");
			if (sName === "Aggregate") {
				sTitle = oResourceBundle.getText("table.SETTINGS_WARNING_TITLE_TOTALS");
				sMessage = oResourceBundle.getText("table.SETTINGS_MESSAGE2");
				sActionText = oResourceBundle.getText("table.SETTINGS_WARNING_BUTTON_TOTALS");
			} else {
				sTitle = oResourceBundle.getText("table.SETTINGS_WARNING_TITLE_GROUPS");
				sMessage = oResourceBundle.getText("table.SETTINGS_MESSAGE1");
				sActionText = oResourceBundle.getText("table.SETTINGS_WARNING_BUTTON_GROUP");
			}
			bForcedAnalytics = true;
			MessageBox.warning(sMessage, {
				id: oTable.getId() + "-messageBox",
				title: sTitle,
				actions: [sActionText, oResourceBundle.getText("table.SETTINGS_WARNING_BUTTON_CANCEL")],
				onClose: function (oAction) {
					if (oAction === sActionText) {
						this._forceAnalytics(sName, oTable, sPath);
					}
					Core.byId(oTable.getId() + "-messageBox").destroy();
				}.bind(this)
			});
		}
		if (sName === "Aggregate" && !bForcedAnalytics) {
			this._onAction(sName, oTable, sPath);
		} else if (sName === "Group" && !bForcedAnalytics) {
			this._onAction(sName, oTable, sPath);
		}
	};

	Delegate._onAction = function(sAction, oTable, sPath) {
		if (sAction === "Group") {
			oTable._onCustomGroup(sPath);
		} else {
			oTable._onCustomAggregate(sPath);
		}
	};

	Delegate._forceAnalytics = function(sName, oTable, sPath) {
		if (sName === "Aggregate") {
			oTable._onCustomGroup(sPath);
			oTable._onCustomAggregate(sPath);
		} else if (sName === "Group") {
			oTable._onCustomAggregate(sPath);
			oTable._onCustomGroup(sPath);
		}
	};

	/**
	 * Provides hook to update the binding info object that is used to bind the table to the model.
	 *
	 * Delegate objects that implement this method must ensure that at least the <code>path</code> key of the binding info is provided.
	 * While defining binding info parameters to remove a parameter <code>undefined</code> must be set.
	 * For more information, see {@link sap.ui.model.odata.v4.ODataListBinding#changeParameters}.
	 *
	 * @param {sap.ui.mdc.Table} oMDCTable The MDC table instance
	 * @param {object} oDelegatePayload The delegate payload
	 * @param {sap.ui.base.ManagedObject.AggregationBindingInfo} oBindingInfo The binding info object to be used to bind the table to the model.
	 * @function
	 * @name sap.ui.mdc.odata.v4.TableDelegate.updateBindingInfo
	 * @abstract
	 */
	//Delegate.updateBindingInfo = function(oTable, oDelegatePayload, oBindingInfo) { };


	/**
	 * Updates the rows binding of the table if possible, rebinds otherwise.
	 *
	 * Compares the current and previous state of the table to detect whether rebinding is necessary or not.
	 * The diffing happens for the sorters, filters, aggregation, parameters, and the path of the binding.
	 * Other {@link sap.ui.base.ManagedObject.AggregationBindingInfo binding info} keys like <code>events</code>,
	 * <code>model</code>... must be provided in the {@link #updateBindingInfo updateBindingInfo} method always
	 * and those keys must not be changed conditionally.
	 *
	 * @param {sap.ui.mdc.Table} oMDCTable The MDC table instance
	 * @param {sap.ui.base.ManagedObject.AggregationBindingInfo} oBindingInfo The binding info object to be used to bind the table to the model.
	 * @param {sap.ui.model.ListBinding} [oBinding] The binding instace of the table
	 * @protected
	 * @override
	 */
	Delegate.updateBinding = function(oTable, oBindingInfo, oBinding) {
		var bForceRebind = false;
		if (!oBinding || oBinding.hasPendingChanges() || oBinding.getPath() != oBindingInfo.path) {
			bForceRebind = true;
		} else {
			try { oBinding.suspend(); } catch (e) { /* empty */ }
			try {
				oBinding.changeParameters(oBindingInfo.parameters);
				oBinding.filter(oBindingInfo.filters, "Application");
				oBinding.sort(oBindingInfo.sorter);
				this._setAggregation(oTable);
			} catch (e) {
				bForceRebind = true;
			}
			try { !bForceRebind && oBinding.resume(); } catch (e) { /* empty */ }
		}

		if (bForceRebind) {
			this._setAggregation(oTable);
			this.rebindTable(oTable, oBindingInfo);
		}
	};

	Delegate._setAggregation = function(oTable, aGroupedProperties, mAggregatedProperties) {
		var mTableMap = TableMap.get(oTable) || {};
		var oPlugin = mTableMap.plugin;

		if (oPlugin) {
			aGroupedProperties = aGroupedProperties || oTable._getGroupedProperties();
			mAggregatedProperties = mAggregatedProperties || oTable._getAggregatedProperties();

			var aAggregates = Object.keys(mAggregatedProperties);
			var aGroupLevels = aGroupedProperties.map(function (mGroupLevel) {
				return mGroupLevel.name;
			});

			var oAggregationInfo = {
				visible: this._getVisibleProperties(oTable, oPlugin),
				groupLevels: aGroupLevels,
				grandTotal: aAggregates,
				subtotals: aAggregates,
				columnState: getColumnState(oTable, aAggregates)
			};

			oPlugin.setAggregationInfo(oAggregationInfo);
		}
	};

	function getColumnState(oTable, aAggregatedPropertyNames) {
		var mColumnState = {};

		oTable.getColumns().forEach(function(oColumn) {
			var sInnerColumnId = oColumn.getId() + "-innerColumn";
			var aAggregatedProperties = getAggregatedColumnProperties(oTable, oColumn, aAggregatedPropertyNames);
			var bColumnIsAggregated = aAggregatedProperties.length > 0;

			if (sInnerColumnId in mColumnState) {
				// If there already is a state for this column, it is a unit column that inherited the state from the amount column.
				// The values in the state may be overridden from false to true, but not the other way around.
				mColumnState[sInnerColumnId].subtotals = bColumnIsAggregated || mColumnState[sInnerColumnId].subtotals;
				mColumnState[sInnerColumnId].grandTotal = bColumnIsAggregated || mColumnState[sInnerColumnId].grandTotal;
				return;
			}

			mColumnState[sInnerColumnId] = {
				subtotals: bColumnIsAggregated,
				grandTotal: bColumnIsAggregated
			};

			findUnitColumns(oTable, aAggregatedProperties).forEach(function(oUnitColumn) {
				sInnerColumnId = oUnitColumn.getId() + "-innerColumn";

				if (sInnerColumnId in mColumnState) {
					// If there already is a state for this column, it is a unit column that inherited the state from the amount column.
					// The values in the state may be overridden from false to true, but not the other way around.
					mColumnState[sInnerColumnId].subtotals = bColumnIsAggregated || mColumnState[sInnerColumnId].subtotals;
					mColumnState[sInnerColumnId].grandTotal = bColumnIsAggregated || mColumnState[sInnerColumnId].grandTotal;
				} else {
					mColumnState[sInnerColumnId] = {
						subtotals: bColumnIsAggregated,
						grandTotal: bColumnIsAggregated
					};
				}
			});
		});

		return mColumnState;
	}

	function getColumnProperties(oTable, oColumn) {
		var oProperty = oTable.getPropertyHelper().getProperty(oColumn.getDataProperty());

		if (!oProperty) {
			return [];
		} else if (oProperty.isComplex()) {
			return oProperty.getReferencedProperties();
		} else {
			return [oProperty];
		}
	}

	function getAggregatedColumnProperties(oTable, oColumn, aAggregatedProperties) {
		return getColumnProperties(oTable, oColumn).filter(function(oProperty) {
			return aAggregatedProperties.includes(oProperty.name);
		});
	}

	function findUnitColumns(oTable, aProperties) {
		var aUnitProperties = [];

		aProperties.forEach(function(oProperty) {
			var oUnitProperty = oProperty ? oProperty.getUnitProperty() : null;

			if (oUnitProperty) {
				aUnitProperties.push(oUnitProperty);
			}
		});

		return oTable.getColumns().filter(function(oColumn) {
			return getColumnProperties(oTable, oColumn).some(function(oProperty) {
				return aUnitProperties.includes(oProperty);
			});
		});
	}

	Delegate._getVisibleProperties = function(oTable, oPlugin) {
		var aVisibleProperties = [];
		var aProperties = oPlugin.getPropertyInfos();
		oTable.getColumns().forEach(function(item) {
			var sPropertyName = item.getDataProperty(),
				oPropertyInfo = aProperties.find(function(oProp) {
				return oProp.name === sPropertyName;
			});
			if (oPropertyInfo) {
				if (oPropertyInfo.propertyInfos) {
					// Complex propertyInfo --> add the names of all related (simple) propertyInfos in the list
					oPropertyInfo.propertyInfos.forEach(function(sRelatedInfoName) {
						if (aVisibleProperties.indexOf(sRelatedInfoName) < 0) {
							aVisibleProperties.push(sRelatedInfoName);
						}
					});
				} else if (aVisibleProperties.indexOf(sPropertyName) < 0) {
					// Simple propertyInfo --> add its name in the list
					aVisibleProperties.push(sPropertyName);
				}
			}
		});
		return aVisibleProperties;
	};

	Delegate.validateState = function(oControl, oState) {
		var bIsValidState;

		if (!oState.sorters) {
			bIsValidState = true;

		} else if (!oState.items) {
			bIsValidState = false;

		} else {
			var oProperty, aProperties = [];
			oState.items.forEach(function(oItem) {
				oProperty = oControl.getPropertyHelper().getProperty(oItem.name);
				if (!oProperty.isComplex()) {
					aProperties.push(oProperty.name);
				} else {
					oProperty.getReferencedProperties().forEach(function(oReferencedProperty) {
						if (aProperties.indexOf(oReferencedProperty.name) === -1) {
							aProperties.push(oReferencedProperty.name);
						}
					});
				}
			});

			bIsValidState = oState.sorters.every(function(oSort) {
				return aProperties.find(function(sPropertyName) {
					return oSort.name === sPropertyName;
				});
			});
		}

		if (!bIsValidState) {
			var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			return {
				validation: coreLibrary.MessageType.Warning,
				message: oResourceBundle.getText("table.PERSONALIZATION_DIALOG_SORT_RESTRICTION")
			};
		}

		return {
			validation: coreLibrary.MessageType.None
		};
	};


	function enrichGridTable(oTable) {
		// The property helper is initialized after the table "initialized" promise resolves. So we can only wait for the property helper.
		var aPropertiesForBinding;
		var mExtensionsForBinding;
		var oPlugin;
		var oDelegate = oTable.getControlDelegate();

		return Promise.all([
			oTable.awaitPropertyHelper(),
			loadModules("sap/ui/table/plugins/V4Aggregation")
		]).then(function(aResult) {
			var V4AggregationPlugin = aResult[1][0],
				oInnerTable = oTable._oTable;

			oPlugin = new V4AggregationPlugin({
				groupHeaderFormatter: function(oContext, sProperty) {
					return oDelegate.formatGroupHeader(oTable, oContext, sProperty);
				}
			});

			oInnerTable.addDependent(oPlugin);

			TableMap.set(oTable, {
				plugin: oPlugin
			});

			// Configure the plugin with the propertyInfos
			return oDelegate.fetchPropertiesForBinding(oTable);
		}).then(function(aProperties) {
			aPropertiesForBinding = aProperties;
			return oDelegate.fetchPropertyExtensionsForBinding(oTable, aPropertiesForBinding);
		}).then(function(mExtensions) {
			mExtensionsForBinding = mExtensions;
			return oDelegate.fetchPropertyHelper(oTable, aPropertiesForBinding, mExtensionsForBinding);
		}).then(function(HelperClass) {
			var oHelper = new HelperClass(aPropertiesForBinding, mExtensionsForBinding, oTable);
			oPlugin.setPropertyInfos(oHelper.getProperties());
			oDelegate._setAggregation(oTable, [], {});
			oHelper.destroy();
		});
	}

	return Delegate;
});
