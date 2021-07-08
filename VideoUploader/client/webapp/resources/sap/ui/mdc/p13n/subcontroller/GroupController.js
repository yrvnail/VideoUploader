/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./BaseController','sap/ui/mdc/p13n/P13nBuilder','sap/base/util/merge','sap/ui/mdc/p13n/panels/QueryPanel','sap/ui/mdc/p13n/panels/SelectionPanel'],function(B,P,m,Q,S){"use strict";var G=B.extend("sap.ui.mdc.p13n.subcontroller.GroupController");G.prototype.getCurrentState=function(){return this.getAdaptationControl().getCurrentState().groupLevels;};G.prototype.getContainerSettings=function(){return{title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("group.PERSONALIZATION_DIALOG_TITLE")};};G.prototype.getDelta=function(p){return B.prototype.getDelta.apply(this,arguments);};G.prototype.getAdaptationUI=function(p){var g=this.getAdaptationControl()._bNewP13n?new Q():new S();this._oPanel=g;var a=this._getP13nModel(p);g.setP13nModel(a);return Promise.resolve(g);};G.prototype.getChangeOperations=function(){return{add:"addGroup",remove:"removeGroup",move:"moveGroup"};};G.prototype._getPresenceAttribute=function(){return"grouped";};G.prototype.update=function(){B.prototype.update.apply(this,arguments);this._oPanel.setP13nModel(this._oAdaptationModel);};G.prototype.mixInfoAndState=function(p){var i=this.getCurrentState();var I=P.arrayToMap(i);var o=P.prepareAdaptationData(p,function(a,b){var e=I[b.name];a.grouped=!!e;a.position=e?e.position:-1;return!(b.groupable===false);});P.sortP13nData({visible:"grouped",position:"position"},o.items);o.presenceAttribute=this._getPresenceAttribute();o.items.forEach(function(a){delete a.position;});return o;};return G;});