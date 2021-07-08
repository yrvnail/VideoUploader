/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/odata/v4/FilterBarDelegate",'sap/ui/base/ManagedObjectObserver'],function(F,M){"use strict";var G=Object.assign({},F);var _;var a=[];G.fetchProperties=function(f){if(!_){_=new M(e);_.observe(f,{aggregations:["filterItems"]});}return new Promise(function(R){var g=f.getFilterItems();a=[];g.forEach(function(o){b(o);});R(a);});};function b(f){var p=f.getBindingPath("conditions");if(!p){return;}var P=p.split("/");var s=P[P.length-1];a.push({name:s,label:f.getLabel()||s,type:f.getDataType(),formatOptions:f.getDataTypeFormatOptions(),constraints:f.getDataTypeConstraints(),typeConfig:f._getFormatOptions().delegate.getTypeUtil().getTypeConfig(f.getDataType(),f.getDataTypeFormatOptions(),f.getDataTypeConstraints()),required:f.getRequired(),hiddenFilter:false,visible:f.getVisible(),maxConditions:f.getMaxConditions(),fieldHelp:f.getFieldHelp()});}function r(f){var p=f.getBindingPath("conditions");if(!p){return;}var P=p.split("/");var s=P[P.length-1];if(c(s)){d(s);}}function c(n){var N=null;a.some(function(p){if(p.name===n){N=p;}return N!==null;});return N;}function d(n){var f=-1;a.some(function(p,i){if(p.name===n){f=i;}return f!==-1;});if(f>=0){a.splice(f,1);}return f;}function e(C){if(C.name==="filterItems"){if(C.mutation==="insert"){var n=C.child;b(n);return;}if(C.mutation==="remove"){var R=C.child;r(R);return;}}}return G;});
