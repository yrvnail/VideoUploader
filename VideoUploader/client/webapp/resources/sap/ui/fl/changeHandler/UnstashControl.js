/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var U={};U.applyChange=function(c,C,p){var m=c.getContent();var M=p.modifier;var s=false;c.setRevertData({originalValue:p.modifier.getStashed(C)});var u=M.setStashed(C,s,p.appComponent)||C;if(m.parentAggregationName){var t=m.parentAggregationName;var T=M.getParent(u);M.removeAggregation(T,t,u);M.insertAggregation(T,t,u,m.index,p.view);}return u;};U.revertChange=function(c,C,p){var r=c.getRevertData();p.modifier.setStashed(C,r.originalValue);c.resetRevertData();};U.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.content){C.content=s.content;}};U.getCondenserInfo=function(c){return{affectedControl:c.getSelector(),classification:sap.ui.fl.condenser.Classification.Reverse,uniqueKey:"stashed"};};return U;});
