/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./BaseController','sap/ui/mdc/p13n/P13nBuilder','sap/ui/mdc/p13n/panels/SortPanel','sap/ui/mdc/p13n/panels/SortQueryPanel'],function(B,P,S,a){"use strict";var b=B.extend("sap.ui.mdc.p13n.subcontroller.SortController");b.prototype.getCurrentState=function(){return this.getAdaptationControl().getCurrentState().sorters;};b.prototype.getResetEnabled=function(){return!!this.getAdaptationControl()._bNewP13n;};b.prototype.getContainerSettings=function(){return{title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("sort.PERSONALIZATION_DIALOG_TITLE")};};b.prototype.getDelta=function(p){p.deltaAttributes.push("descending");return B.prototype.getDelta.apply(this,arguments);};b.prototype.getAdaptationUI=function(p){var s=this.getAdaptationControl()._bNewP13n?new a():new S();this._oPanel=s;var A=this._getP13nModel(p);s.setP13nModel(A);return Promise.resolve(s);};b.prototype.update=function(){B.prototype.update.apply(this,arguments);this._oPanel.setP13nModel(this._oAdaptationModel);};b.prototype.model2State=function(){var i=[];this._oAdaptationModel.getProperty("/items").forEach(function(I){if(I.sorted){i.push({name:I.name});}});return i;};b.prototype.getChangeOperations=function(){return{add:"addSort",remove:"removeSort",move:"moveSort"};};b.prototype._getPresenceAttribute=function(c){return"sorted";};b.prototype.mixInfoAndState=function(p){var i=this.getCurrentState();var e=P.arrayToMap(i);var o=P.prepareAdaptationData(p,function(I,c){var E=e[c.name];I.sorted=E?true:false;I.sortPosition=E?E.position:-1;I.descending=E?!!E.descending:false;return!(c.sortable===false);});P.sortP13nData({visible:"sorted",position:"sortPosition"},o.items);o.presenceAttribute=this._getPresenceAttribute();o.items.forEach(function(I){delete I.sortPosition;});return o;};return b;});
