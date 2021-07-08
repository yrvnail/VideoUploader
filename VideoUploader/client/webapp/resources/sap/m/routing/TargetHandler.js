/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/InstanceManager','sap/m/NavContainer','sap/m/SplitContainer','sap/ui/base/Object','sap/ui/core/routing/History','sap/ui/Device',"sap/base/Log"],function(I,N,S,B,H,D,L){"use strict";var T=B.extend("sap.m.routing.TargetHandler",{constructor:function(c){this._aQueue=[];this._oNavigationOrderPromise=Promise.resolve();if(c===undefined){this._bCloseDialogs=true;}else{this._bCloseDialogs=!!c;}}});T.prototype.setCloseDialogs=function(c){this._bCloseDialogs=!!c;return this;};T.prototype.getCloseDialogs=function(){return this._bCloseDialogs;};T.prototype.addNavigation=function(p){this._aQueue.push(p);};T.prototype.navigate=function(d){var r=this._createResultingNavigations(d.navigationIdentifier),c=false,b=this._getDirection(d),n;while(r.length){n=this._applyNavigationResult(r.shift().oParams,b);c=c||n;}if(c){this._closeDialogs();}};T.prototype._chainNavigation=function(n,s){var p=this._oNavigationOrderPromise.then(n);this._oNavigationOrderPromise=p.catch(function(e){L.error("The following error occurred while displaying routing target with name '"+s+"': "+e);});return p;};T.prototype._getDirection=function(d){var t=d.viewLevel,h=H.getInstance(),b=false;if(d.direction==="Backwards"){b=true;}else if(isNaN(t)||isNaN(this._iCurrentViewLevel)||t===this._iCurrentViewLevel){if(d.askHistory){b=h.getDirection()==="Backwards";}}else{b=t<this._iCurrentViewLevel;}this._iCurrentViewLevel=t;return b;};T.prototype._createResultingNavigations=function(n){var i,f,c,C,o,r=[],v,b,a,p,R;while(this._aQueue.length){f=false;c=this._aQueue.shift();C=c.targetControl;b=C instanceof S;a=C instanceof N;v=c.view;o={oContainer:C,oParams:c,bIsMasterPage:(b&&!!C.getMasterPage(v.getId()))};p=b&&c.preservePageInSplitContainer&&C.getCurrentPage(o.bIsMasterPage)&&n!==c.navigationIdentifier;if(!(a||b)||!v){continue;}for(i=0;i<r.length;i++){R=r[i];if(R.oContainer!==C){continue;}if(a||D.system.phone){r.splice(i,1);r.push(o);f=true;break;}if(R.bIsMasterPage===o.bIsMasterPage){if(p){break;}r.splice(i,1);r.push(o);f=true;break;}}if(C instanceof S&&!D.system.phone){o.bIsMasterPage=!!C.getMasterPage(v.getId());}if(!f){if(!!C.getCurrentPage(o.bIsMasterPage)&&p){continue;}r.push(o);}}return r;};T.prototype._applyNavigationResult=function(p,b){var t=p.targetControl,P,a=p.eventData,s=p.transition||"",o=p.transitionParameters,v=p.view.getId(),n=t instanceof S&&!!t.getMasterPage(v);if(t.getDomRef()&&t.getCurrentPage(n).getId()===v){L.info("navigation to view with id: "+v+" is skipped since it already is displayed by its targetControl","sap.m.routing.TargetHandler");return false;}L.info("navigation to view with id: "+v+" the targetControl is "+t.getId()+" backwards is "+b);if(b){P=t.getPreviousPage(n);if(!P||P.getId()!==v){t.insertPreviousPage(v,s,a);}t.backToPage(v,a,o);}else{t.to(v,s,a,o);}return true;};T.prototype._closeDialogs=function(){if(!this._bCloseDialogs){return;}if(I.hasOpenPopover()){I.closeAllPopovers();}if(I.hasOpenDialog()){I.closeAllDialogs();}if(I.hasOpenLightBox()){I.closeAllLightBoxes();}};return T;});
