/*
 * !OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(E){"use strict";var I=E.extend("sap.ui.mdc.chart.Item",{metadata:{"abstract":true,library:"sap.ui.mdc",properties:{key:{type:"string"},label:{type:"string"},visible:{type:"boolean",defaultValue:true},type:{type:"string",defaultValue:"string"}}}});I.prototype.getSettings=function(m){throw new Error("sap.ui.mdc.chart.Item - getSettings not implemented see sap.ui.mdc.chart.DimensionItem or sap.ui.mdc.chart.MeasureItem");};I.prototype.toVizChartItem=function(m){throw new Error("sap.ui.mdc.chart.Item - getChartVizItem not implemented see sap.ui.mdc.chart.DimensionItem or sap.ui.mdc.chart.MeasureItem");};I.prototype.setRole=function(r){throw new Error("sap.ui.mdc.chart.Item - setRole not implemented see sap.ui.mdc.chart.DimensionItem or sap.ui.mdc.chart.MeasureItem");};I.prototype.getVizItemType=function(){throw new Error("sap.ui.mdc.chart.Item - getVizItemType not implemented see sap.ui.mdc.chart.DimensionItem or sap.ui.mdc.chart.MeasureItem");};return I;},true);
