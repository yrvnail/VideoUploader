/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ViewSettingsItem','./library'],function(V,l){"use strict";var a=V.extend("sap.m.ViewSettingsFilterItem",{metadata:{library:"sap.m",properties:{multiSelect:{type:"boolean",group:"Behavior",defaultValue:true}},aggregations:{items:{type:"sap.m.ViewSettingsItem",multiple:true,singularName:"item",bindable:"bindable"}},events:{filterDetailItemsAggregationChange:{}}}});a.prototype._handleNewAggregationEvents=function(o){o.attachEvent('itemPropertyChanged',function(e){this.fireItemPropertyChanged({changedItem:e.getParameter('changedItem'),propertyKey:e.getParameter('propertyKey'),propertyValue:e.getParameter('propertyValue')});}.bind(this));this.fireFilterDetailItemsAggregationChange({item:o});};a.prototype.addAggregation=function(A,o,s){V.prototype.addAggregation.apply(this,arguments);this._handleNewAggregationEvents(o);return this;};a.prototype.insertAggregation=function(A,o,i,s){V.prototype.insertAggregation.apply(this,arguments);this._handleNewAggregationEvents(o);return this;};a.prototype.removeAggregation=function(A,o,s){V.prototype.removeAggregation.apply(this,arguments);this.fireFilterDetailItemsAggregationChange();return this;};a.prototype.removeAllAggregation=function(A,s){V.prototype.removeAllAggregation.apply(this,arguments);this.fireFilterDetailItemsAggregationChange();return this;};a.prototype.destroyAggregation=function(A,s){V.prototype.destroyAggregation.apply(this,arguments);this.fireFilterDetailItemsAggregationChange();return this;};return a;});