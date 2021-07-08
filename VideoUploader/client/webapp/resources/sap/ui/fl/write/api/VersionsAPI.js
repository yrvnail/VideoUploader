/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/write/_internal/Versions","sap/ui/fl/Utils","sap/ui/fl/apply/_internal/flexState/ManifestUtils"],function(F,V,U,M){"use strict";function g(A){var r;if(A){var m=A.getManifest();r=M.getFlexReference({manifest:m,componentData:A.getComponentData()});}if(!r){throw Error("The application ID could not be determined");}return r;}function a(p){if(!p.selector){throw Error("No selector was provided");}if(!p.layer){throw Error("No layer was provided");}var A=U.getAppComponentForControl(p.selector);return V.getVersionsModel({reference:U.normalizeReference(g(A)),layer:p.layer});}var b={};b.initialize=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}var A=U.getAppComponentForControl(p.selector);return V.initialize({reference:U.normalizeReference(g(A)),layer:p.layer});};b.isDraftAvailable=function(p){var m=a(p);var v=m.getProperty("/versions");var d=v.find(function(o){return o.version===sap.ui.fl.Versions.Draft;});return!!d;};b.isOldVersionDisplayed=function(p){var m=a(p);var d=m.getProperty("/displayedVersion");var c=m.getProperty("/activeVersion");return d!==sap.ui.fl.Versions.Draft&&d!==c;};b.loadDraftForApplication=function(p){p.version=sap.ui.fl.Versions.Draft;return b.loadVersionForApplication(p);};b.loadVersionForApplication=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}if(p.version===undefined){var m=a(p);if(m){p.version=m.getProperty("/activeVersion");}}var A=U.getAppComponentForControl(p.selector);return Promise.resolve().then(g.bind(undefined,A)).then(function(r){return F.clearAndInitialize({componentId:A.getId(),reference:r,version:p.version,allContexts:p.allContexts});});};b.activate=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}if(!p.title){return Promise.reject("No version title was provided");}var A=U.getAppComponentForControl(p.selector);return Promise.resolve().then(g.bind(undefined,A)).then(function(r){return V.activate({nonNormalizedReference:r,reference:U.normalizeReference(r),layer:p.layer,title:p.title,appComponent:A});});};b.discardDraft=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}var A=U.getAppComponentForControl(p.selector);return Promise.resolve().then(g.bind(undefined,A)).then(function(r){return V.discardDraft({nonNormalizedReference:r,reference:U.normalizeReference(r),layer:p.layer}).then(function(d){if(d.backendChangesDiscarded){F.clearAndInitialize({componentId:A.getId(),reference:r});}return d;});});};return b;});
