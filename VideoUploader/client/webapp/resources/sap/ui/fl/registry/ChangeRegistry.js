/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/each","sap/ui/fl/initial/_internal/changeHandlers/ChangeHandlerStorage","sap/ui/fl/registry/ChangeRegistryItem","sap/ui/fl/registry/Settings","sap/ui/fl/Utils","sap/ui/fl/requireAsync","sap/base/Log"],function(e,C,a,S,U,r,L){"use strict";var b=function(){};b._instance=undefined;b.prototype._oDefaultChangeHandlers={};b.prototype._mDeveloperModeChangeHandlers={};var R={};b.prototype.registerPredefinedChangeHandlers=function(d,D){this._oDefaultChangeHandlers=d;this._mDeveloperModeChangeHandlers=D;};b.addRegistrationPromise=function(k,p){R[k]=p;p.catch(function(){}).then(function(){delete R[k];});};b.waitForChangeHandlerRegistration=function(k){if(R[k]){return R[k].catch(function(){});}return new U.FakePromise();};b.getInstance=function(){if(!b._instance){b._instance=new b();}return b._instance;};b.prototype.registerControlsForChanges=function(c){var p=[];e(c,function(s,v){var m={};if(Array.isArray(v)){v.forEach(function(o){m[o.changeType]=o.changeHandler;});}else{m=v;}p.push(C.registerChangeHandlersForControl(s,m));});return Promise.all(p);};b.prototype._getInstanceSpecificChangeRegistryItem=function(c,o,m){var s=m&&m.getChangeHandlerModulePath(o);if(typeof s!=="string"){return new U.FakePromise(undefined);}return r(s).then(function(d){var v=d[c];if(!v){return undefined;}var f=this._getChangeHandlerEntry(c,v);var g={changeType:c,changeHandler:f.changeHandler,layers:f.layers};var h=m.getControlType(o);var i=this._createChangeRegistryItemForSimpleChange(h,g);return i;}.bind(this)).catch(function(E){L.error("Flexibility registration for control "+m.getId(o)+" failed to load module "+s+"\n"+E.message);return undefined;});};b.prototype._getChangeHandlerEntry=function(c,v){var o={};var d=Object.keys(this._mDeveloperModeChangeHandlers);if(!v||!v.changeHandler){o.changeHandler=v;}else{o=v;}if(o.changeHandler==="default"){o.changeHandler=this._oDefaultChangeHandlers[c];}else if(d.indexOf(c)>-1){throw Error("You can't use a custom change handler for the following Developer Mode change types: "+d.toString()+". Please use 'default' instead.");}return o;};b.prototype.getChangeHandler=function(c,s,o,m,l){return this._getInstanceSpecificChangeRegistryItem(c,o,m).then(function(d){var f=d||this._getRegistryItem(s,c);if(!f){throw Error("No Change handler registered for the Control and Change type");}if(!this._isRegistryItemValidForLayer(f,l)){throw Error("Change type "+c+" not enabled for layer "+l);}return f.getChangeHandler();}.bind(this));};b.prototype._createChangeRegistryItemForSimpleChange=function(c,s){var l=Object.assign({},S.getDefaultLayerPermissions());var o=s.layers;if(o){Object.keys(o).forEach(function(d){if(l[d]===undefined){throw Error("The Layer '"+d+"' is not supported. Please only use supported layers");}l[d]=o[d];});}return new a({controlType:c,changeHandler:s.changeHandler,layers:l,changeType:s.changeType});};b.prototype._getRegistryItem=function(c,s){var o=C.getRegistryItem(c,s);if(o){return o;}var d=C.getDeveloperModeChangeChangeRegistryItem(s);if(d){return d;}};b.prototype._isRegistryItemValidForLayer=function(o,l){var c=o.getLayers();return!!c[l];};return b;});