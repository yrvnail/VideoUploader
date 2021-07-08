/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseController","sap/ui/mdc/p13n/panels/ListView","sap/ui/mdc/p13n/panels/SelectionPanel","sap/m/Column"],function(B,L,S,C){"use strict";var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");var a=B.extend("sap.ui.mdc.p13n.subcontroller.ColumnController");a.prototype.getContainerSettings=function(){return{title:r.getText("table.SETTINGS_COLUMN")};};a.prototype.getResetEnabled=function(){return!!this.getAdaptationControl()._bNewP13n;};a.prototype.getAdaptationUI=function(p){var s=this.getAdaptationControl()._bNewP13n?new L({enableReorder:true,showHeader:true}):new S();if(this.getAdaptationControl()._bNewP13n){s.setPanelColumns([r.getText("fieldsui.COLUMNS"),new C({width:"25%",hAlign:"Center",vAlign:"Middle"})]);}var A=this._getP13nModel(p);s.setP13nModel(A);return Promise.resolve(s);};a.prototype.getChangeOperations=function(){return{add:"addColumn",remove:"removeColumn",move:"moveColumn"};};return a;});
