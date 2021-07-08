/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/core/ComponentContainer","sap/ui/core/mvc/XMLView","sap/ui/rta/command/CommandFactory","sap/ui/dt/DesignTime","sap/ui/dt/DesignTimeStatus","sap/ui/dt/OverlayRegistry","sap/ui/fl/ChangePersistence","sap/ui/model/Model","sap/ui/fl/registry/Settings","sap/ui/fl/write/api/PersistenceWriteAPI","sap/ui/fl/Cache","sap/ui/fl/Layer","sap/ui/thirdparty/sinon-4","sap/ui/fl/library"],function(U,C,X,a,D,b,O,c,M,S,P,d,L,s){"use strict";var e=function(m,o){if(e._only&&(m.indexOf(e._only)<0)){return;}if(typeof o.xmlView==="string"){o.xmlView={viewContent:o.xmlView};}var f=s.sandbox.create();o.before=o.before||function(){};o.after=o.after||function(){};QUnit.module(m,function(){QUnit.test("When using the 'controlEnablingCheck' function to test if your control is ready for UI adaptation at runtime",function(x){x.ok(o.afterAction,"then you implement a function to check if your action has been successful: See the afterAction parameter.");x.ok(o.afterUndo,"then you implement a function to check if the undo has been successful: See the afterUndo parameter.");x.ok(o.afterRedo,"then you implement a function to check if the redo has been successful: See the afterRedo parameter.");x.ok(o.xmlView,"then you provide an XML view to test on: See the.xmlView parameter.");var y=new DOMParser().parseFromString(o.xmlView.viewContent,"application/xml").documentElement;x.ok(y.tagName.match("View$"),"then you use the sap.ui.core.mvc View tag as the first tag in your view");x.ok(o.action,"then you provide an action: See the action parameter.");x.ok(o.action.name,"then you provide an action name: See the action.name parameter.");x.ok(o.action.controlId||o.action.control,"then you provide the control or control's id to operate the action on: See the action.controlId.");});});var g="sap.ui.rta.control.enabling.comp";var h=false;var A=true;var i=U.extend(g,{metadata:{manifest:{"sap.app":{id:g,type:"application"},getEntry:function(){return{type:"application"};}}},createContent:function(){var V=Object.assign({},o.xmlView);V.id=this.createId("view");if(V.async===undefined){V.async=this.getComponentData().async;}var x=new X(V);return x;}});function j(x){this.oUiComponent=new i({id:"comp",componentData:{async:x}});this.oUiComponentContainer=new C({component:this.oUiComponent,height:'100%'});this.oUiComponentContainer.placeAt(o.placeAt||"qunit-fixture");this.oView=this.oUiComponent.getRootControl();if(o.model instanceof M){this.oView.setModel(o.model);}sap.ui.getCore().applyChanges();return Promise.all([this.oView.loaded(),o.model&&o.model.getMetaModel()&&o.model.getMetaModel().loaded()]);}function k(x){var y=[].concat(o.previousActions||[],o.action);var z=[];return y.reduce(function(B,E){return B.then(l.bind(this,x,E)).then(function(F){z.push(F);return F.execute();});}.bind(this),Promise.resolve()).then(function(){return z;});}function l(x,y){return Promise.resolve().then(function(){var z;var B;var E;if(typeof y.control==="function"){z=y.control(this.oView);}else{z=this.oView.byId(y.controlId);}var F=y.name;return z.getMetadata().loadDesignTime(z).then(function(){if(y.parameter){if(typeof y.parameter==="function"){B=y.parameter(this.oView);}else{B=y.parameter;}}else{B={};}sap.ui.getCore().applyChanges();this.oDesignTime=new D({rootElements:[this.oView]});return new Promise(function(G){this.oDesignTime.attachEventOnce("synced",function(){var H=O.getOverlay(z);E=H.getDesignTimeMetadata();var R=E.getAction("getResponsibleElement",z);var I;if(y.name==="move"){var J=O.getOverlay(B.movedElements[0].element||B.movedElements[0].id);var K=J.getRelevantContainer();z=K;E=J.getParentAggregationOverlay().getDesignTimeMetadata();}else if(y.name==="addODataProperty"){x.ok(false,"addODataProperty action is deprecated. Use addViaDelegate action instead.");}else if(Array.isArray(y.name)){var N=E.getActionDataFromAggregations(y.name[0],z,undefined,y.name[1]);x.equal(N.length,1,"there should be only one aggregation with the possibility to do an add "+y.name[1]+" action");I=H.getAggregationOverlay(N[0].aggregation);E=I.getDesignTimeMetadata();F="addDelegateProperty";}else if(R){if(y.name==="reveal"){z=y.revealedElement(this.oView);H=O.getOverlay(y.revealedElement(this.oView));E=H.getDesignTimeMetadata();}else{z=R;H=O.getOverlay(z);E=H.getDesignTimeMetadata();G(z.getMetadata().loadDesignTime(z));}}G();}.bind(this));}.bind(this));}.bind(this)).then(function(){var G=new a({flexSettings:{layer:o.layer||L.CUSTOMER}});return G.getCommandFor(z,F,B,E);}).then(function(G){x.ok(G,"then the registration for action to change type, the registration for change and control type to change handler is available and "+o.action.name+" is a valid action");return G;});}.bind(this)).catch(function(z){throw new Error(z);});}function n(x){return x.reduce(function(y,z){return y.then(z.execute.bind(z));},Promise.resolve());}function u(x){var y=x.slice().reverse();return y.reduce(function(z,B){return z.then(B.undo.bind(B));},Promise.resolve());}function p(x){x.forEach(function(y){y.destroy();});}function q(V,x,y){var R={remainingCommands:[],deletedCommands:[]};if(x.length===1){R.remainingCommands.push(x[0]);return Promise.resolve(R);}var z=x.map(function(B){return B.getPreparedChange();});return P._condense({selector:V,changes:z}).then(function(B){if(o.changesAfterCondensing!==undefined){y.equal(B.length,o.changesAfterCondensing,"after condensing the amount of changes is correct");}var E=B.map(function(F){return F.getId();});x.forEach(function(F){if(E.indexOf(F.getPreparedChange().getId())>-1){R.remainingCommands.push(F);}else{R.deletedCommands.push(F);}});return R;});}function r(x){x.forEach(function(y){var z=y.getPreparedChange();if(y.getAppComponent){P.remove({change:z,selector:y.getAppComponent()});}});}function t(x){var y=[];f.stub(c.prototype,"getChangesForComponent").resolves(y);f.stub(c.prototype,"getCacheKey").resolves("etag-123");return j.call(this,h).then(v.bind(this,x,y));}function v(x,y){var z=[].concat(o.previousActions||[],o.action);var B=[];return z.reduce(function(E,F){return E.then(l.bind(this,x,F)).then(function(G){B.push(G);y.push(G.getPreparedChange());this.oUiComponentContainer.destroy();return j.call(this,A);}.bind(this));}.bind(this),Promise.resolve()).then(function(V){this.aCommands=B;return V;}.bind(this));}if(!o.jsOnly){QUnit.module(m+" on async views",{before:function(x){this.hookContext={};return o.before.call(this.hookContext,x);},after:function(x){return o.after.call(this.hookContext,x);},beforeEach:function(){f.stub(S,"getInstance").resolves({_oSettings:{}});},afterEach:function(){this.oUiComponentContainer.destroy();this.oDesignTime.destroy();p(this.aCommands);f.restore();}},function(){QUnit.test("When applying the change directly on the XMLView",function(x){return t.call(this,x).then(function(y){var V=y[0];return o.afterAction(this.oUiComponent,V,x);}.bind(this));});QUnit.test("When executing on XML and reverting the change in JS (e.g. variant switch)",function(x){return t.call(this,x).then(function(){return u(this.aCommands);}.bind(this)).then(function(){r(this.aCommands);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();o.afterUndo(this.oUiComponent,this.oView,x);}.bind(this));});QUnit.test("When executing on XML, reverting the change in JS (e.g. variant switch) and applying again",function(x){return t.call(this,x).then(function(){return q(this.oView,this.aCommands,x);}.bind(this)).then(function(y){this.aRemainingCommands=y.remainingCommands;return u(this.aCommands);}.bind(this)).then(function(){r(this.aCommands);}.bind(this)).then(function(){return n(this.aRemainingCommands);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();o.afterRedo(this.oUiComponent,this.oView,x);}.bind(this));});});}function w(x){if(x.getStatus()!==b.SYNCED){return new Promise(function(R){x.attachEventOnce("synced",R);});}return Promise.resolve();}QUnit.module(m,{before:function(x){this.hookContext={};return o.before.call(this.hookContext,x);},after:function(x){return o.after.call(this.hookContext,x);},beforeEach:function(x){f.stub(c.prototype,"getChangesForComponent").returns(Promise.resolve([]));f.stub(c.prototype,"getCacheKey").returns(d.NOTAG);f.stub(S,"getInstance").returns(Promise.resolve({_oSettings:{}}));return j.call(this,h).then(k.bind(this,x)).then(function(y){this.aCommands=y;}.bind(this));},afterEach:function(){this.oDesignTime.destroy();this.oUiComponentContainer.destroy();p(this.aCommands);f.restore();}},function(){QUnit.test("When executing the underlying command on the control at runtime",function(x){return w(this.oDesignTime).then(function(){sap.ui.getCore().applyChanges();return o.afterAction(this.oUiComponent,this.oView,x);}.bind(this));});QUnit.test("When executing and undoing the command",function(x){return w(this.oDesignTime).then(u.bind(null,this.aCommands)).then(r.bind(null,this.aCommands)).then(function(){sap.ui.getCore().applyChanges();return o.afterUndo(this.oUiComponent,this.oView,x);}.bind(this));});QUnit.test("When executing, undoing and redoing the command",function(x){return w(this.oDesignTime).then(q.bind(this,this.oView,this.aCommands,x)).then(function(y){this.aRemainingCommands=y.remainingCommands;return u(this.aCommands);}.bind(this)).then(r.bind(null,this.aCommands)).then(function(){return n(this.aRemainingCommands);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();return o.afterRedo(this.oUiComponent,this.oView,x);}.bind(this));});});};e.skip=function(){};e.only=function(m){e._only=m;};return e;});
