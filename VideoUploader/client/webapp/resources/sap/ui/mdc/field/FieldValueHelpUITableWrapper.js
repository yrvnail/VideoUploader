/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/field/FieldValueHelpTableWrapperBase','sap/ui/model/ChangeReason','sap/base/strings/capitalize',"sap/ui/table/library"],function(F,C,c,l){"use strict";var V=l.VisibleRowCountMode;var S=l.SelectionMode;var a=l.SelectionBehavior;var b=F.extend("sap.ui.mdc.field.FieldValueHelpUITableWrapper",{metadata:{library:"sap.ui.mdc",aggregations:{table:{type:"sap.ui.table.Table",multiple:false}},defaultAggregation:"table"}});b.prototype.fieldHelpOpen=function(s){F.prototype.fieldHelpOpen.apply(this,arguments);var t=this._getWrappedTable();if(t&&s){var e=this._getTableItems(true);var o=e&&e[0];this._handleScrolling(o);}return this;};b.prototype.getListBinding=function(){var t=this._getWrappedTable();return t&&t.getBinding("rows");};b.prototype.isSuspended=function(){var L=this.getListBinding();if(!L){return true;}return L.isSuspended();};var _=function(t){t=t||this._getWrappedTable();var s=t.getPlugins().find(function(p){return p.isA("sap.ui.table.plugins.SelectionPlugin");});return s||t;};var d=function(B){if(B){this._handleModelContextChange();return true;}};b.prototype._handleTableChanged=function(m,t){if(m==="insert"){this._adjustTable(true);var h=d.call(this,this.getListBinding());this._oObserver.observe(t,{aggregations:["plugins"],bindings:[!h&&"rows"]});var s=_.call(this,t);if(s&&s!==t){s.attachEvent("selectionChange",this._handleSelectionChange,this);}}else{this._oObserver.unobserve(t);}F.prototype._handleTableChanged.call(this,m,t);};b.prototype._observeChanges=function(o,n){if(o.name==="rows"&&o.mutation==="ready"){d.call(this,o.bindingInfo.binding);}if(!n&&o.name==="plugins"&&o.child.isA("sap.ui.table.plugins.SelectionPlugin")){var p=(o.mutation==="insert"?o.child.attachEvent:o.child.detachEvent).bind(o.child);p("selectionChange",this._handleSelectionChange,this);}F.prototype._observeChanges.apply(this,arguments);};b.prototype._handleEvents=function(A){var t=this._getWrappedTable();if(t){var e=(A?t.attachEvent:t.detachEvent).bind(t);e("cellClick",this._handleItemPress,this);e("rowSelectionChange",this._handleSelectionChange,this);e("rowsUpdated",this._handleUpdateFinished,this);var r=this.getListBinding();if(r){var E=(A?r.attachEvent:r.detachEvent).bind(r);E("change",this._handleUpdateFinished,this);}}};b.prototype._adjustTable=function(s){F.prototype._adjustTable.apply(this,arguments);var t=this._getWrappedTable();var p=this.getParent();if(t){var r=t.getRowMode();if(!r){t.setVisibleRowCountMode(s?V.Fixed:V.Auto);t.setMinAutoRowCount(3);}else if(r.isA("sap.ui.table.rowmodes.AutoRowMode")){r.setMinRowCount(3);}if(p){var o=_.call(this);var e=function(m,B){t.setSelectionBehavior(B);o.setSelectionMode(m);};var f=this._getMaxConditions()===1;var g=f?S.Single:S.MultiToggle;var h=f?a.RowOnly:a.Row;e(g,h);}}};b.prototype._handleSelectionChange=function(e){var u=e.getParameter("userInteraction");if(u||(this._bSuggestion&&this._getMaxConditions()!==1)){this._fireSelectionChange.call(this,false);}};b.prototype._handleUpdateFinished=function(e){if(!this.getParent()){return;}this._updateSelectedItems();if(this._bNavigate){this._bNavigate=false;this.navigate(this._iStep);}if(!e||e.getParameter("reason")!==c(C.Filter)){this.fireDataUpdate({contentChange:false});}};b.prototype._getTableItems=function(s,n){var t=this._getWrappedTable();if(!t){return[];}var r;var o,e,f;if(s){o=_.call(this,t);e=o.getSelectedIndices();f=e.reduce(function(r,i){var g=t.getContextByIndex(i);return g?r.concat(g):r;},[]);}if(!n){var B=t.getBinding();r=s?f:B&&(B.aContexts||(B.aIndices&&B.aIndices.map(function(i){return t.getContextByIndex(i);}))||B.getContexts());}else{r=t.getRows().filter(function(R){var g=R.getBindingContext();return g&&g.getObject();});if(s){r=r.filter(function(R){return f.indexOf(R.getBindingContext())>=0;});}}return r;};b.prototype._modifyTableSelection=function(i,I,s,e,f){e=typeof e!=='undefined'?e:i.indexOf(I);if(e>=0){var o=_.call(this);var g=o.getSelectedIndices().indexOf(e)>=0;if(s&&!g){return this._getMaxConditions()===1?o.setSelectedIndex(e):o.addSelectionInterval(e,e);}else if(!s&&g){return o.removeSelectionInterval(e,e);}}};b.prototype._handleTableEvent=function(e){if(!this._bSuggestion){return;}var i=jQuery(e.target).control(0);switch(e.type){case"sapprevious":if(i.isA("sap.ui.table.Row")){if(this._getTableItems(false,true).indexOf(i)===0){this.fireNavigate({key:undefined,description:undefined,leave:true});e.preventDefault();e.stopPropagation();e.stopImmediatePropagation(true);}}break;case"sapnext":if(i.isA("sap.ui.table.Column")&&this._getMaxConditions()===1){i=this._getTableItems(false,true)[0];if(i){var v=this._getDataFromItem(i);if(v){this.fireNavigate({key:v.key,description:v.description,inParameters:v.inParameters,outParameters:v.outParameters,itemId:i.getId()});e.preventDefault();e.stopPropagation();e.stopImmediatePropagation(true);}}}break;default:break;}};b.prototype._handleScrolling=function(i){var t=this._getWrappedTable();var I=!isNaN(i)&&i;var f=t.getFirstVisibleRow();if(!I&&i){var o=i.isA("sap.ui.table.Row")&&i.getBindingContext();if(!o&&i.isA("sap.ui.model.Context")){o=i;}I=this._getTableItems().indexOf(o);}if(typeof I==="undefined"||I<0){I=f-1;}if(I>=0&&I!=f){t.setFirstVisibleRow(I);return Promise.resolve();}};b.prototype._handleItemPress=function(e){};return b;});