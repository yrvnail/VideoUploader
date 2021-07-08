/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/format/NumberFormat","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/model/odata/ODataUtils","sap/ui/model/odata/type/ODataType"],function(L,N,F,P,V,B,O){"use strict";var r=/^[-+]?(\d+)(?:\.(\d+))?$/,a=/(?:(\.[0-9]*[1-9]+)0+|\.0*)$/;function g(t){var f,S,T;if(!t.oFormat){f={groupingEnabled:true,maxIntegerDigits:Infinity};S=b(t);if(S!==Infinity){f.minFractionDigits=f.maxFractionDigits=S;}T=t.oFormatOptions||{};if(T.style!=="short"&&T.style!=="long"){f.preserveDecimals=true;}Object.assign(f,t.oFormatOptions);f.parseAsString=true;t.oFormat=N.getFloatInstance(f);}return t.oFormat;}function b(t){return(t.oConstraints&&t.oConstraints.scale)||0;}function c(k,p){return sap.ui.getCore().getLibraryResourceBundle().getText(k,p);}function d(v){if(v.indexOf(".")>=0){v=v.replace(a,"$1");}return v;}function s(t,C){var n,p,v,S,e;function l(k,m){L.warning("Illegal "+m+": "+k,null,t.getName());}function f(k,m,M,o){var q=typeof k==="string"?parseInt(k):k;if(q===undefined){return m;}if(typeof q!=="number"||isNaN(q)||q<M){l(k,o);return m;}return q;}function h(k,m){if(k){if(k.match(r)){return k;}l(k,m);}}function i(k,m){if(k===true||k==="true"){return true;}if(k!==undefined&&k!==false&&k!=="false"){l(k,m);}}function j(k,m,o){if(m!==o){t.oConstraints=t.oConstraints||{};t.oConstraints[k]=m;}}t.oConstraints=undefined;if(C){n=C.nullable;v=C.precision;e=C.scale;S=e==="variable"?Infinity:f(e,0,0,"scale");p=f(v,Infinity,1,"precision");if(S!==Infinity&&p<=S){L.warning("Illegal scale: must be less than precision (precision="+v+", scale="+e+")",null,t.getName());S=Infinity;}j("precision",p,Infinity);j("scale",S,0);if(n===false||n==="false"){j("nullable",false,true);}else if(n!==undefined&&n!==true&&n!=="true"){l(n,"nullable");}j("minimum",h(C.minimum,"minimum"));j("minimumExclusive",i(C.minimumExclusive,"minimumExclusive"));j("maximum",h(C.maximum,"maximum"));j("maximumExclusive",i(C.maximumExclusive,"maximumExclusive"));}t._handleLocalizationChange();}var D=O.extend("sap.ui.model.odata.type.Decimal",{constructor:function(f,C){O.apply(this,arguments);this.oFormatOptions=f;s(this,C);}});D.prototype.formatValue=function(v,t){if(v===null||v===undefined){return null;}switch(this.getPrimitiveType(t)){case"any":return v;case"float":return parseFloat(v);case"int":return Math.floor(parseFloat(v));case"string":return g(this).format(d(String(v)));default:throw new F("Don't know how to format "+this.getName()+" to "+t);}};D.prototype.parseValue=function(v,S){var R;if(v===null||v===""){return null;}switch(this.getPrimitiveType(S)){case"string":R=g(this).parse(v);if(!R){throw new P(sap.ui.getCore().getLibraryResourceBundle().getText("EnterNumber"));}R=d(R);break;case"int":case"float":R=N.getFloatInstance({maxIntegerDigits:Infinity,decimalSeparator:".",groupingEnabled:false}).format(v);break;default:throw new P("Don't know how to parse "+this.getName()+" from "+S);}return R;};D.prototype._handleLocalizationChange=function(){this.oFormat=null;};D.prototype.validateValue=function(v){var f,i,m,M,e,h,j,p,S;if(v===null&&(!this.oConstraints||this.oConstraints.nullable!==false)){return;}if(typeof v!=="string"){throw new V(c("EnterNumber"));}m=r.exec(v);if(!m){throw new V(c("EnterNumber"));}i=m[1].length;f=(m[2]||"").length;S=b(this);p=(this.oConstraints&&this.oConstraints.precision)||Infinity;h=this.oConstraints&&this.oConstraints.minimum;M=this.oConstraints&&this.oConstraints.maximum;if(f>S){if(S===0){throw new V(c("EnterInt"));}else if(i+S>p){throw new V(c("EnterNumberIntegerFraction",[p-S,S]));}throw new V(c("EnterNumberFraction",[S]));}if(S===Infinity){if(i+f>p){throw new V(c("EnterNumberPrecision",[p]));}}else if(i>p-S){if(S){throw new V(c("EnterNumberInteger",[p-S]));}else{throw new V(c("EnterMaximumOfDigits",[p]));}}if(h){j=this.oConstraints.minimumExclusive;if(B.compare(h,v,true)>=(j?0:1)){throw new V(c(j?"EnterNumberMinExclusive":"EnterNumberMin",[this.formatValue(h,"string")]));}}if(M){e=this.oConstraints.maximumExclusive;if(B.compare(M,v,true)<=(e?0:-1)){throw new V(c(e?"EnterNumberMaxExclusive":"EnterNumberMax",[this.formatValue(M,"string")]));}}};D.prototype.getName=function(){return"sap.ui.model.odata.type.Decimal";};return D;});
