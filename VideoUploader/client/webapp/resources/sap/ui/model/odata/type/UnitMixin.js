/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/ParseException","sap/ui/model/ValidateException"],function(P,V){"use strict";var c=new Map(),r=/\.(\d+)$/,a=/\.$/,b=/0+$/;function g(k,p){return sap.ui.getCore().getLibraryResourceBundle().getText(k,p);}function v(d){var D,f,m,n=d[0],u=d[1];if(this.mCustomUnits===undefined){throw new V("Cannot validate value without customizing");}if(!n||!u||!this.mCustomUnits){return;}m=r.exec(n);f=m?m[1].length:0;D=this.mCustomUnits[u].decimals;if(f>D){throw new V(D?g("EnterNumberFraction",[D]):g("EnterInt"));}}return function(p,B,f){function d(j,t){var F,k=this;if(this.mCustomUnits===undefined&&j&&j[2]!==undefined){if(j[2]===null){this.mCustomUnits=null;}else{this.mCustomUnits=c.get(j[2]);if(!this.mCustomUnits){this.mCustomUnits={};Object.keys(j[2]).forEach(function(K){k.mCustomUnits[K]=k.getCustomUnitForKey(j[2],K);});c.set(j[2],this.mCustomUnits);}F={};F[f]=this.mCustomUnits;B.prototype.setFormatOptions.call(this,Object.assign(F,this.oFormatOptions));}}if(!j||j[0]===undefined||j[1]===undefined||this.mCustomUnits===undefined&&j[2]===undefined){return null;}return B.prototype.formatValue.call(this,j.slice(0,2),t);}function e(){var o=B.prototype.getFormatOptions.call(this);delete o[f];return o;}function h(){if(!this.bShowMeasure){return[1,2];}else if(!this.bShowNumber){return[0,2];}return[2];}function i(j,s){var k;if(this.mCustomUnits===undefined){throw new P("Cannot parse value without customizing");}k=B.prototype.parseValue.apply(this,arguments);if(k[0]&&typeof k[0]==="string"&&k[0].includes(".")){k[0]=k[0].replace(b,"").replace(a,"");}return k;}function U(F,C){if(F&&F[f]){throw new Error("Format option "+f+" is not supported");}if(C){throw new Error("Constraints not supported");}if(arguments.length>2){throw new Error("Only the parameter oFormatOptions is supported");}F=Object.assign({emptyString:0,parseAsString:true,unitOptional:!F||["showMeasure","showNumber"].every(function(o){return!(o in F)||F[o];})},F);B.call(this,F,C);this.mCustomUnits=undefined;this.setConstraints=function(){throw new Error("Constraints not supported");};this.setFormatOptions=function(){throw new Error("Format options are immutable");};}p._applyUnitMixin=U;p.formatValue=d;p.getFormatOptions=e;p.getPartsIgnoringMessages=h;p.parseValue=i;p.validateValue=v;};},false);