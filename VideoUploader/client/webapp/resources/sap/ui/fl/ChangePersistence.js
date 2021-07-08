/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/changes/DependencyHandler","sap/ui/fl/initial/_internal/StorageUtils","sap/ui/fl/Change","sap/ui/fl/Layer","sap/ui/fl/Variant","sap/ui/fl/Utils","sap/ui/fl/LayerUtils","sap/ui/fl/Cache","sap/ui/fl/registry/Settings","sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/write/_internal/Storage","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/Component","sap/ui/model/json/JSONModel","sap/ui/performance/Measurement","sap/base/util/includes","sap/base/util/merge","sap/base/util/restricted/_union","sap/base/util/UriParameters","sap/base/Log","sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState","sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/write/_internal/condenser/Condenser"],function(D,S,C,L,V,U,a,b,c,A,d,J,e,f,M,i,m,u,g,h,j,F,k){"use strict";var l=function(v){this._mComponent=v;this._mChanges=D.createEmptyDependencyMap();this._bChangesMapCreated=false;this._mChangesInitial=m({},this._mChanges);if(!this._mComponent||!this._mComponent.name){h.error("The Control does not belong to an SAPUI5 component. Personalization and changes for this control might not work as expected.");throw new Error("Missing component name.");}this._aDirtyChanges=[];this._oMessagebundle=undefined;this._mChangesEntries={};this._bHasChangesOverMaxLayer=false;this.HIGHER_LAYER_CHANGES_EXIST="higher_layer_changes_exist";};function n(v,w){var x;if(w instanceof C){x=w;this._mChangesEntries[x.getFileName()]=x;}else{if(!this._mChangesEntries[w.fileName]){this._mChangesEntries[w.fileName]=new C(w);}x=this._mChangesEntries[w.fileName];x.setState(C.states.PERSISTED);}return x;}l.prototype.getComponentName=function(){return this._mComponent.name;};l.prototype.getCacheKey=function(v){return b.getCacheKey(this._mComponent,v);};l.prototype._preconditionsFulfilled=function(v){var w=v instanceof C?v.getDefinition():v;function _(){if((w.fileType==="ctrl_variant")||(w.fileType==="ctrl_variant_change")||(w.fileType==="ctrl_variant_management_change")){return w.variantManagementReference||w.variantReference||(w.selector&&w.selector.id);}}return w.fileType==="change"||_();};l.prototype.getChangesForComponent=function(P,I){return b.getChangesFillingCache(this._mComponent,P,I).then(function(P,w){var v=m({},w);var x=P&&P.component&&U.getAppComponentForControl(P.component);var H=S.isStorageResponseFilled(v.changes);if(!H){return[];}var y=v.changes.changes;if(!this._oMessagebundle&&v.messagebundle&&x){if(!x.getModel("i18nFlexVendor")){if(y.some(function(O){return O.layer===L.VENDOR;})){this._oMessagebundle=v.messagebundle;var z=new f(this._oMessagebundle);x.setModel(z,"i18nFlexVendor");}}}var B=P&&P.currentLayer;var E=!(P&&P.ignoreMaxLayerParameter);var G=function(){return true;};if(B){y=a.filterChangeOrChangeDefinitionsByCurrentLayer(y,B);}else if(a.isLayerFilteringRequired()&&E){G=this._filterChangeForMaxLayer.bind(this);y=y.filter(G);}else if(this._bHasChangesOverMaxLayer&&!E){this._bHasChangesOverMaxLayer=false;return this.HIGHER_LAYER_CHANGES_EXIST;}var K=v.changes&&P&&P.includeCtrlVariants;var N=this._getAllCtrlVariantChanges(v,K,G);y=y.concat(N);return this._checkAndGetChangeInstances(y,v);}.bind(this,P));};l.prototype._checkAndGetChangeInstances=function(v,w){return v.filter(this._preconditionsFulfilled).map(n.bind(this,w));};l.prototype._filterChangeForMaxLayer=function(v){if(a.isOverMaxLayer(this._getLayerFromChangeOrChangeContent(v))){if(!this._bHasChangesOverMaxLayer){this._bHasChangesOverMaxLayer=true;}return false;}return true;};l.prototype._getLayerFromChangeOrChangeContent=function(v){var w;if(v instanceof V||v instanceof C){w=v.getLayer();}else{w=v.layer;}return w;};l.prototype._getAllCtrlVariantChanges=function(v,I,w){if(!I){return j.getInitialChanges({reference:this._mComponent.name});}return["variants","variantChanges","variantDependentControlChanges","variantManagementChanges"].reduce(function(R,x){if(v.changes[x]){return R.concat(v.changes[x]);}return R;},[]).filter(w);};l.prototype.loadChangesMapForComponent=function(v){return this.getChangesForComponent({component:v}).then(w.bind(this));function w(x){M.start("fl.createDependencyMap","Measurement of creating initial dependency map");this._mChanges=D.createEmptyDependencyMap();x.forEach(this.addChangeAndUpdateDependencies.bind(this,v));this._mChangesInitial=m({},this._mChanges);M.end("fl.createDependencyMap","Measurement of creating initial dependency map");this._bChangesMapCreated=true;return this.getChangesMapForComponent.bind(this);}};l.prototype.checkForOpenDependenciesForControl=function(v,w){return D.checkForOpenDependenciesForControl(this._mChanges,J.getControlIdBySelector(v,w),w);};l.prototype.copyDependenciesFromInitialChangesMap=function(v,w,x){var I=m({},this._mChangesInitial.mDependencies);var y=I[v.getId()];if(y){var N=[];y.dependencies.forEach(function(E){if(w(E)){this._mChanges.mDependentChangesOnMe[E]=this._mChanges.mDependentChangesOnMe[E]||[];this._mChanges.mDependentChangesOnMe[E].push(v.getId());N.push(E);}}.bind(this));var z;var B=[];y.controlsDependencies.forEach(function(E){if(!J.bySelector(E,x)){z=J.getControlIdBySelector(E,x);B.push(E);this._mChanges.mControlsWithDependencies[z]=this._mChanges.mControlsWithDependencies[z]||[];if(!i(this._mChanges.mControlsWithDependencies[z],v.getId())){this._mChanges.mControlsWithDependencies[z].push(v.getId());}}}.bind(this));y.dependencies=N;y.controlsDependencies=B;if(N.length||B.length){this._mChanges.mDependencies[v.getId()]=y;}}return this._mChanges;};l.prototype.addChangeAndUpdateDependencies=function(v,w,R){w.setInitialApplyState();if(R){D.insertChange(w,this._mChanges,R);}D.addChangeAndUpdateDependencies(w,v,this._mChanges);};l.prototype._addRunTimeCreatedChangeAndUpdateDependencies=function(v,w){D.addRuntimeChangeAndUpdateDependencies(w,v,this._mChanges,this._mChangesInitial);};l.prototype.getChangesMapForComponent=function(){return this._mChanges;};l.prototype.getAllUIChanges=function(P){var v=u(this.getChangesMapForComponent().aChanges,P.includeDirtyChanges&&this.getDirtyChanges()).filter(function(w){return(Boolean(w)&&w.getFileType()==="change"&&a.compareAgainstCurrentLayer(w.getLayer(),P.layer)===0);});return v;};l.prototype.isChangeMapCreated=function(){return this._bChangesMapCreated;};l.prototype.changesHavingCorrectViewPrefix=function(P,v){var w=P.modifier;var x=P.appComponent;var y=v.getSelector();if(!y||!P){return false;}if(y.viewSelector){var z=w.getControlIdBySelector(y.viewSelector,x);return z===P.viewId;}var B=y.id;if(B){var E;if(v.getSelector().idIsLocal){if(x){E=x.getLocalId(P.viewId);}}else{E=P.viewId;}var I=0;var G;do{I=B.indexOf("--",I);G=B.slice(0,I);I++;}while(G!==E&&I>0);return G===E;}return false;};l.prototype.getChangesForView=function(P){return this.getChangesForComponent(P).then(function(v){return v.filter(this.changesHavingCorrectViewPrefix.bind(this,P));}.bind(this));};l.prototype.addChange=function(v,w){var x=this.addDirtyChange(v);this._addRunTimeCreatedChangeAndUpdateDependencies(w,x);this._mChangesEntries[x.getFileName()]=x;this._addPropagationListener(w);return x;};l.prototype.addDirtyChange=function(v){var N;if(v instanceof C||v instanceof V){N=v;}else{N=new C(v);}if(this._aDirtyChanges.indexOf(N)===-1){this._aDirtyChanges.push(N);}return N;};l.prototype._addPropagationListener=function(v){var w=U.getAppComponentForControl(v);if(w instanceof e){var x=function(P){return!P._bIsSapUiFlFlexControllerApplyChangesOnControl;};var N=w.getPropagationListeners().every(x);if(N){var y=sap.ui.require("sap/ui/fl/FlexControllerFactory");var z=y.create(this.getComponentName());var P=A.applyAllChangesForControl.bind(A,this.getChangesMapForComponent.bind(this),w,z);P._bIsSapUiFlFlexControllerApplyChangesOnControl=true;w.addPropagationListener(P);}}};l.prototype._deleteNotSavedChanges=function(v,w,x){v.filter(function(y){return!w.some(function(z){return y.getId()===z.getId();});}).forEach(function(y){if(x){this.removeChange(y);}else{this.deleteChange(y);}}.bind(this));};function o(v,w){var P=v.map(function(y){return y[w]();});var x=P.filter(function(y,I,P){return P.indexOf(y)===I;});return x.length===1;}function s(v,w){var x=false;if(!v||w.length<2){return false;}if(!o(w,"getLayer")){return false;}var y=w[0].getLayer();if(y==="CUSTOMER"||y==="USER"){x=true;}var z=g.fromURL(window.location.href);if(z.has("sap-ui-xx-condense-changes")){x=z.get("sap-ui-xx-condense-changes")==="true";}return x;}function p(v){var E=c.getInstanceOrUndef()&&c.getInstanceOrUndef().isCondensingEnabled();if(E&&!o(v,"getNamespace")){E=false;}return E;}function q(v,w,x,y){this._massUpdateCacheAndDirtyState(w,x);this._deleteNotSavedChanges(v,w,y);}function r(v){if(!v.length){return[];}var w=v[0].getLayer();var P=this._mChanges.aChanges.filter(function(x){return x.getState()===C.states.PERSISTED&&a.compareAgainstCurrentLayer(x.getLayer(),w)===0;});return P.concat(v);}l.prototype.saveDirtyChanges=function(v,w,x,y){var z=x||this._aDirtyChanges;var R=r.call(this,z);var I=(p(R)&&s(v,R));var B=I?R:z;var E=B.slice(0);var G=z.slice(0);var H=this._getRequests(z);var P=this._getPendingActions(z);if(P.length===1&&H.length===1&&P[0]===C.states.NEW){var K=Promise.resolve(E);if(s(v,E)){K=k.condense(v,E);}return K.then(function(N){var O=H[0];var Q=z[0].getDefinition().layer;if(I){return d.condense({allChanges:B,condensedChanges:N,layer:Q,transport:O,isLegacyVariant:false,parentVersion:y}).then(function(T){q.call(this,B,N,w,true);return T;}.bind(this));}if(N.length){return d.write({layer:Q,flexObjects:this._prepareDirtyChanges(N),transport:O,isLegacyVariant:false,parentVersion:y}).then(function(T){q.call(this,B,N,w);return T;}.bind(this));}this._deleteNotSavedChanges(B,N);}.bind(this));}return this.saveSequenceOfDirtyChanges(G,w,y);};l.prototype.saveSequenceOfDirtyChanges=function(v,w,x){var y;if(x){var N=v.filter(function(z){return z.getPendingAction()==="NEW";});y=[].concat(N).shift();}return v.reduce(function(P,z){return P.then(this._performSingleSaveAction(z,y,x)).then(this._updateCacheAndDirtyState.bind(this,z,w));}.bind(this),Promise.resolve());};l.prototype._performSingleSaveAction=function(v,w,x){return function(){if(v.getPendingAction()==="NEW"){if(x!==undefined){x=v===w?x:sap.ui.fl.Versions.Draft;}return d.write({layer:v.getLayer(),flexObjects:[v.getDefinition()],transport:v.getRequest(),parentVersion:x});}if(v.getPendingAction()==="DELETE"){return d.remove({flexObject:v.getDefinition(),layer:v.getLayer(),transport:v.getRequest()});}};};l.prototype._updateCacheAndDirtyState=function(v,w){if(!w){if(U.isChangeRelatedToVariants(v)){j.updateVariantsState({reference:this._mComponent.name,changeToBeAddedOrDeleted:v});}else if(v.getPendingAction()===C.states.NEW){v.setState(C.states.PERSISTED);b.addChange(this._mComponent,v.getDefinition());}else if(v.getPendingAction()===C.states.DELETED){b.deleteChange(this._mComponent,v.getDefinition());}else if(v.getPendingAction()===C.states.DIRTY){v.setState(C.states.PERSISTED);b.updateChange(this._mComponent,v.getDefinition());}}this._aDirtyChanges=this._aDirtyChanges.filter(function(E){return v.getId()!==E.getId();});};l.prototype._massUpdateCacheAndDirtyState=function(v,w){v.forEach(function(x){this._updateCacheAndDirtyState(x,w);},this);};l.prototype._getRequests=function(v){var R=[];v.forEach(function(w){var x=w.getRequest();if(R.indexOf(x)===-1){R.push(x);}});return R;};l.prototype._getPendingActions=function(v){var P=[];v.forEach(function(w){var x=w.getPendingAction();if(P.indexOf(x)===-1){P.push(x);}});return P;};l.prototype._prepareDirtyChanges=function(v){var w=[];v.forEach(function(x){w.push(x.getDefinition());});return w;};l.prototype.getDirtyChanges=function(){return this._aDirtyChanges;};l.prototype.deleteChange=function(v,R){var w=this._aDirtyChanges.indexOf(v);if(w>-1){if(v.getPendingAction()==="DELETE"){return;}this._aDirtyChanges.splice(w,1);this._deleteChangeInMap(v,R);return;}v.markForDeletion();this.addDirtyChange(v);this._deleteChangeInMap(v,R);};l.prototype.removeChange=function(v){var w=this._aDirtyChanges.indexOf(v);if(w>-1){this._aDirtyChanges.splice(w,1);}this._deleteChangeInMap(v);};l.prototype._deleteChangeInMap=function(v,R){var w=v.getId();D.removeChangeFromMap(this._mChanges,w);D.removeChangeFromDependencies(R?this._mChangesInitial:this._mChanges,w);};function t(v,O){return(O.getRequest()==="$TMP"||O.getRequest()==="")&&O.getLayer()===v;}l.prototype.transportAllUIChanges=function(R,v,w,x){return Promise.all([this.getChangesForComponent({currentLayer:w,includeCtrlVariants:true}),F.getCompVariantsMap(this.getComponentName())]).then(function(y){var z=y[0];var B=y[1];var E=[];for(var P in B){for(var I in B[P].byId){E.push(B[P].byId[I]);}}z=z.concat(E.filter(t.bind(this,w)));return d.publish({transportDialogSettings:{rootControl:R,styleClass:v},layer:w,reference:this.getComponentName(),localChanges:z,appVariantDescriptors:x});}.bind(this));};l.prototype._getChangesFromMapByNames=function(N){return this._mChanges.aChanges.filter(function(v){return N.indexOf(v.getFileName())!==-1;});};l.prototype.removeDirtyChanges=function(v,w,x,G,y){if(!x){h.error("The selectorId must be provided");return Promise.reject("The selectorId must be provided");}var z=this._aDirtyChanges;var B=z.filter(function(E){var H=true;if(E.getLayer()!==v){return false;}if(G&&E.getDefinition().support.generator!==G){return false;}var I=E.getSelector();H=x.getId()===J.getControlIdBySelector(I,w);if(y){H=H&&y.indexOf(E.getChangeType())!==-1;}return H;});B.forEach(function(E){var H=z.indexOf(E);z.splice(H,1);});return Promise.resolve(B);};l.prototype.resetChanges=function(v,G,w,x){var y=w&&w.length>0;var z=x&&x.length>0;return this.getChangesForComponent({currentLayer:v,includeCtrlVariants:true}).then(function(B){var P={reference:this.getComponentName(),layer:v,changes:B};if(G){P.generator=G;}if(y){P.selectorIds=w;}if(z){P.changeTypes=x;}return d.reset(P);}.bind(this)).then(function(R){var B=[];if(w||x){var N=[];if(R&&R.response&&R.response.length>0){R.response.forEach(function(E){N.push(E.fileName);});}b.removeChanges(this._mComponent,N);B=this._getChangesFromMapByNames(N);}return B;}.bind(this));};l.prototype.getResetAndPublishInfo=function(P){return d.getFlexInfo(P);};return l;},true);