/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/assert"],function(a){"use strict";var S={},s={};S.mixInto=function(c){a(!c.prototype.unstash,"StashedControlSupport: fnClass already has method 'unstash', sideeffects possible",c.getMetadata().getName());if(c.getMetadata().isA("sap.ui.core.Fragment")||c.getMetadata().isA("sap.ui.core.mvc.View")){throw new Error("Stashing is not supported for sap.ui.coreFragment or sap.ui.core.mvc.View");}m(c);};function m(c){c.prototype.unstash=function(){if(this.isStashed()){var o=u(this);o.stashed=false;return o;}return this;};c.prototype.isStashed=function(){return!!s[this.getId()];};var C=c.prototype.clone;c.prototype.clone=function(){if(this.isStashed()){throw new Error("A stashed control cannot be cloned, id: '"+this.getId()+"'.");}return C.apply(this,arguments);};var d=c.prototype.destroy;c.prototype.destroy=function(){delete s[this.getId()];d.apply(this,arguments);};}function u(w){var W;var i;var t;var o=s[w.getId()];W=w.getParent();if(W){t=W.getMetadata().getAggregation(w.sParentAggregationName);i=t.indexOf(W,w);t.remove(W,w);}w.destroy();var C=sap.ui.require("sap/ui/core/Component");var O=C&&W&&C.getOwnerComponentFor(W);var b;var f=o.fnCreate;if(O){b=O.runAsOwner(f);}else{b=f();}if(i>=0){b.forEach(function(c){t.insert(W,c,i);});}delete s[w.getId()];return b[0];}function g(A,p){var b=[];for(var i in s){var P=sap.ui.getCore().byId(s[i].wrapperId);var I=A?P:i;var o=P&&P.getParent();if(!p||(o&&o.getId()===p)){b.push(I);}}return b;}S.getStashedControlIds=function(p){return g(false,p);};S.getStashedControls=function(p){return g(true,p);};S.createStashedControl=function(b){var o={wrapperId:b.wrapperId,fnCreate:b.fnCreate};s[b.wrapperId]=o;return o;};return S;});