/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/AggregationBaseDelegate"],function(A){"use strict";var T=Object.assign({},A);T.addItem=function(p,t,P){return Promise.resolve(null);};T.removeItem=function(p,t,P){return Promise.resolve(true);};T.updateBindingInfo=function(m,d,b){b.parameters={};b.filters=[];b.sorter=m._getSorters();};T.updateBinding=function(m,b,B){this.rebindTable(m,b);};T.rebindTable=function(m,b){if(m._oTable){m._oTable.bindRows(b);}};T.getFilterDelegate=function(){return{addItem:function(p,t){return Promise.resolve(null);}};};return T;});
