/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/model/json/JSONModel","sap/ui/core/Core","sap/base/util/deepClone"],function(m,J,C,d){"use strict";var a={layers:{"admin":0,"content":5,"translation":10,"all":20},mergeManifestPathChanges:function(M,c){Object.keys(c).forEach(function(s){if(s.charAt(0)==="/"){var v=c[s];M.setProperty(s,v);}});},mergeCardDelta:function(M,c){var i=m({},M),s="sap.card";if(Array.isArray(c)&&c.length>0){var o;c.forEach(function(b){if(b.content){m(i[s],b.content);}else{o=o||new J(i);a.mergeManifestPathChanges(o,b);}});}return i;},mergeCardDesigntimeMetadata:function(D,c){var i=m({},D);c.forEach(function(o){var I=o.content.entityPropertyChange||[];I.forEach(function(b){var p=b.propertyPath;switch(b.operation){case"UPDATE":if(i.hasOwnProperty(p)){i[p]=b.propertyValue;}break;case"DELETE":delete i[p];break;case"INSERT":if(!i.hasOwnProperty(p)){i[p]=b.propertyValue;}break;default:break;}});});return i;}};return a;});
