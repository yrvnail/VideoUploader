/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_omit","sap/base/util/restricted/_pick","sap/base/util/UriParameters","sap/ui/fl/Layer","sap/ui/fl/Change","sap/ui/fl/apply/_internal/flexObjects/UpdatableChange","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/apply/_internal/flexObjects/CompVariant","sap/ui/fl/apply/_internal/flexObjects/RevertData","sap/ui/fl/apply/_internal/flexObjects/CompVariantRevertData","sap/ui/fl/Utils","sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/apply/_internal/flexState/compVariants/CompVariantMerger","sap/ui/fl/registry/Settings","sap/ui/fl/write/_internal/Storage"],function(_,a,U,L,C,b,c,d,R,e,f,F,g,S,h){"use strict";function j(i){var D=i.getDefinition();var E=F.getCompVariantsMap(i.getComponent());var P=i.getSelector().persistencyKey;E[P].changes.push(i);E[P].byId[i.getId()]=i;return D;}function r(i){var P=i.getSelector().persistencyKey;var D=F.getCompVariantsMap(i.getComponent());delete D[P].byId[i.getId()];D[P].changes=D[P].changes.filter(function(E){return E!==i;});}function k(i,D){if(!["defaultVariant","updateVariant"].includes(i.getChangeType())){return false;}var E=i.getLayer()===D;var P=i.getDefinition().packageName;var N=!P||P==="$TMP";return E&&N;}function l(O,D){for(var i=O.length-1;i>=0;i--){if((O[i].fileName||O[i].getFileName())===D.fileName){O.splice(i,1);break;}}}function m(M,i){if(i.isVariant()){return M.variants;}switch(i.getChangeType()){case"defaultVariant":return M.defaultVariants;case"standardVariant":return M.standardVariants;default:return M.changes;}}function w(i,D){return h.write({flexObjects:[i.getDefinition()],layer:i.getLayer(),transport:i.getRequest(),isLegacyVariant:i.isVariant()}).then(function(E){if(E&&E.response&&E.response[0]){i.setResponse(E.response[0]);}else{i.setState(C.states.PERSISTED);}return D;}).then(function(D){m(D.changes.comp,i).push(i.getDefinition());return i.getDefinition();});}function u(O,D){for(var i=0;i<O.length;i++){if(O[i].fileName===D.fileName){O.splice(i,1,D);break;}}}function n(i,D){return h.update({flexObject:i.getDefinition(),layer:i.getLayer(),transport:i.getRequest()}).then(function(E){if(E&&E.response){i.setResponse(E.response);}else{i.setState(C.states.PERSISTED);}return D;}).then(function(D){var O=m(D.changes.comp,i);u(O,i.getDefinition());return i.getDefinition();});}function o(i,D,E){return h.remove({flexObject:i.getDefinition(),layer:i.getLayer(),transport:i.getRequest()}).then(function(){delete D.byId[i.getId()];if(i.getChangeType()==="standardVariant"){D.standardVariantChange=undefined;}else{l(m(D,i),i.getDefinition());}return E;}).then(function(E){l(m(E.changes.comp,i),i.getDefinition());return i.getDefinition();});}function p(i){return i&&[C.states.NEW,C.states.DIRTY,C.states.DELETED].includes(i.getPendingAction());}function q(i){return i.variants.concat(i.changes).concat(i.defaultVariants).concat(i.standardVariantChange);}function s(P){var i={};if(typeof(P.texts)==="object"){Object.keys(P.texts).forEach(function(D){i[D]={value:P.texts[D],type:"XFLD"};});}return i;}function t(P){if(P.layer){return P.layer;}if(P.isUserDependent){return L.USER;}var i=U.fromQuery(window.location.search).get("sap-ui-layer")||"";i=i.toUpperCase();if(i){return i;}if(!P.fileType==="variant"){return L.CUSTOMER;}var D=S.getInstanceOrUndef().isPublicLayerAvailable();return D?L.PUBLIC:L.CUSTOMER;}function v(P){var i=F.getCompVariantsMap(P.reference)._getOrCreate(P.persistencyKey);return i.byId[P.id];}function x(i){if(i instanceof d){i.removeAllRevertInfo();}}function y(V,P){V.storeExecuteOnSelection(P.executeOnSelection);V.storeFavorite(P.favorite);V.storeContexts(P.contexts);if(P.name){V.setText("variantName",P.name);}V.storeContent(P.content||V.getContent());return V;}function z(V,P){V.setExecuteOnSelection(P.executeOnSelection);V.setFavorite(P.favorite);V.setContexts(P.contexts);if(P.name){V.setName(P.name);}V.setContent(P.content||V.getContent());return V;}var A={};A.setDefault=function(P){var i={defaultVariantName:P.defaultVariantId};P.layer=P.layer||U.fromQuery(window.location.search).get("sap-ui-layer")||L.USER;var D=F.getCompVariantsMap(P.reference)._getOrCreate(P.persistencyKey);var E="defaultVariant";var G=D.defaultVariants;var H=G[G.length-1];if(!H||!k(H,P.layer)){var I={fileName:f.createDefaultFileName(E),fileType:"change",changeType:E,layer:P.layer,content:i,namespace:f.createNamespace(P,"changes"),reference:P.reference,selector:{persistencyKey:P.persistencyKey},support:P.support||{}};I.support.generator=I.support.generator||"CompVariantState."+E;I.support.sapui5Version=sap.ui.version;var H=new b(I);D.defaultVariants.push(H);D.byId[H.getId()]=H;H.addRevertInfo(new R({type:A.operationType.NewChange}));}else{H.addRevertInfo(new R({type:A.operationType.ContentUpdate,content:{previousState:H.getState(),previousContent:H.getContent()}}));H.setContent(i);}return H;};A.revertSetDefaultVariantId=function(P){var i=F.getCompVariantsMap(P.reference)._getOrCreate(P.persistencyKey);var D=i.defaultVariants;var E=D[D.length-1];var G=E.popLatestRevertInfo();if(G.getType()===A.operationType.ContentUpdate){E.setContent(G.getContent().previousContent);E.setState(G.getContent().previousState);}else{E.setState(C.states.DELETED);i.defaultVariants.pop();}};A.addVariant=function(P){if(!P){return undefined;}var i=P.changeSpecificData;var I={id:i.id,changeType:i.type,service:i.ODataService,content:i.content||{},reference:P.reference,fileType:"variant",packageName:i.packageName,layer:t(i),selector:{persistencyKey:P.persistencyKey},texts:s(i),command:P.command,generator:P.generator};if(i.favorite!==undefined){I.favorite=i.favorite;}if(i.executeOnSelection!==undefined){I.executeOnSelection=i.executeOnSelection;}if(i.contexts!==undefined){I.contexts=i.contexts;}var D=d.createInitialFileContent(I);var E=new d(D);var G=F.getCompVariantsMap(P.reference);var M=G._getOrCreate(P.persistencyKey);M.variants.push(E);M.byId[E.getId()]=E;return E;};function B(P,V,O,i){var D={type:O,change:i,content:{previousState:V.getState(),previousContent:V.getContent(),previousFavorite:V.getFavorite(),previousExecuteOnSelection:V.getExecuteOnSelection(),previousContexts:V.getContexts()}};if(P.name){D.content.previousName=V.getText("variantName");}V.addRevertInfo(new e(D));}A.updateVariant=function(P){function i(V,I){var K=V.getLayer()===I;var M=V.getDefinition().packageName;var N=!M||M==="$TMP";var O=V.getChanges().some(function(Q){return Q.getLayer()===I;});return V.getPersisted()&&K&&N&&!O;}function D(V){return V.getChanges().reverse().find(function(K){return K.getChangeType()==="updateVariant"&&k(K,I);});}function E(P,V){B(P,V,A.operationType.ContentUpdate);if(P.executeOnSelection!==undefined){V.storeExecuteOnSelection(P.executeOnSelection);}if(P.favorite!==undefined){V.storeFavorite(P.favorite);}if(P.contexts){V.storeContexts(P.contexts);}if(P.name){V.storeName(P.name);}V.storeContent(P.content||V.getContent());}function G(P,V,K){var M=K.getRevertData()||[];var N=K.getContent();var O={previousContent:Object.assign({},N),previousState:K.getState(),change:a(Object.assign({},P),["favorite","executeOnSelection","contexts","content","name"])};M.push(O);K.setRevertData(M);if(P.executeOnSelection!==undefined){V.setExecuteOnSelection(P.executeOnSelection);N.executeOnSelection=P.executeOnSelection;}if(P.favorite!==undefined){V.setFavorite(P.favorite);N.favorite=P.favorite;}if(P.contexts){V.setContexts(P.contexts);N.contexts=P.contexts;}if(P.content){V.setContent(P.content);N.content=P.content;}if(P.name){V.setName(P.name);N.texts={variantName:{value:P.name,type:"XFLD"}};}K.setContent(N);g.applyChangeOnVariant(V,K);B(P,V,A.operationType.UpdateVariantViaChangeUpdate,K);}function H(P,V){var K=C.createInitialFileContent({changeType:"updateVariant",layer:I,fileType:"change",reference:P.reference,content:{},selector:{persistencyKey:P.persistencyKey,variantId:V.getId()}});["favorite","executeOnSelection","contexts"].forEach(function(N){if(P[N]!==undefined){K.content[N]=P[N];}});if(P.content!==undefined){K.content.variantContent=P.content;}if(P.name){K.texts.variantName={value:P.name,type:"XFLD"};}var M=new C(K);j(M);B(P,V,A.operationType.NewChange,M);g.applyChangeOnVariant(V,M);}var V=v(P);var I=t(P);if(i(V,I)){E(P,V);}else{var J=D(V);if(J){G(P,V,J);}else{H(P,V);}}return V;};A.operationType={StateUpdate:"StateUpdate",ContentUpdate:"ContentUpdate",NewChange:"NewChange",UpdateVariantViaChange:"UpdateVariantViaChange",UpdateVariantViaChangeUpdate:"UpdateVariantViaChangeUpdate"};A.removeVariant=function(P){var V=v(P);if(!P.revert){var i=new e({type:A.operationType.StateUpdate,content:{previousState:V.getState()}});V.addRevertInfo(i);}V.markForDeletion();return V;};A.revert=function(P){var V=v(P);var i=V.getRevertInfo().pop();V.removeRevertInfo(i);var D=i.getContent();switch(i.getType()){case A.operationType.ContentUpdate:y(V,Object.assign({name:D.previousName,content:D.previousContent,favorite:D.previousFavorite,executeOnSelection:D.previousExecuteOnSelection,contexts:D.previousContexts},a(P,["reference","persistencyKey","id"])));break;case A.operationType.NewChange:var E=i.getChange();V.removeChange(E);r(E);z(V,Object.assign({name:D.previousName,content:D.previousContent,favorite:D.previousFavorite,executeOnSelection:D.previousExecuteOnSelection,contexts:D.previousContexts},a(P,["reference","persistencyKey","id"])));break;case A.operationType.UpdateVariantViaChangeUpdate:var E=i.getChange();z(V,Object.assign({name:D.previousName,content:D.previousContent,favorite:D.previousFavorite,executeOnSelection:D.previousExecuteOnSelection,contexts:D.previousContexts},a(P,["reference","persistencyKey","id"])));var G=E.getRevertData().pop();E.setContent(G.previousContent);E.setState(G.previousState);break;case A.operationType.StateUpdate:default:break;}V.setState(D.previousState);return V;};A.overrideStandardVariant=function(P){var i=F.getCompVariantsMap(P.reference)[P.persistencyKey];var D=i.byId[i.standardVariant.getId()];D.setExecuteOnSelection(!!P.executeOnSelection);var E=D.getChanges();D.removeAllChanges();E.forEach(function(G){g.applyChangeOnVariant(D,G);});};A.persist=function(P){var i=P.reference;var D=P.persistencyKey;var E=F.getCompVariantsMap(i);var G=E._getOrCreate(D);var H=F.getStorageResponse(i);var I=q(G).filter(p).map(function(J){switch(J.getPendingAction()){case C.states.NEW:x(J);return w(J,H);case C.states.DIRTY:x(J);return n(J,H);case C.states.DELETED:x(J);return o(J,G,H);default:break;}});return Promise.all(I);};A.persistAll=function(i){var D=_(F.getCompVariantsMap(i),"_getOrCreate","_initialize");var P=Object.keys(D).map(function(E){return A.persist({reference:i,persistencyKey:E});});return Promise.all(P);};return A;});