/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/Context','sap/ui/model/ContextBinding','sap/ui/model/ChangeReason',"sap/ui/thirdparty/jquery"],function(C,a,b,q){"use strict";var O=a.extend("sap.ui.model.odata.v2.ODataContextBinding",{constructor:function(m,p,c,P,e){a.call(this,m,p,c,P,e);this.sRefreshGroupId=undefined;this.bPendingRequest=false;this.mParameters=q.extend(true,{},this.mParameters);this.bCreatePreliminaryContext=this.mParameters.createPreliminaryContext||m.bPreliminaryContext;this.bUsePreliminaryContext=this.mParameters.usePreliminaryContext||m.bPreliminaryContext;this.mParameters.createPreliminaryContext=this.bCreatePreliminaryContext;this.mParameters.usePreliminaryContext=this.bUsePreliminaryContext;this.bPendingRequest=false;}});O.prototype.initialize=function(){var t=this,r,c=this.isRelative()&&this.oContext&&this.oContext.bCreated,p=this.oContext&&this.oContext.isPreliminary(),R;if(!this.oModel.oMetadata.isLoaded()||!this.bInitial){return;}this.bInitial=false;if(p&&!this.bUsePreliminaryContext){return;}r=this.getResolvedPath();if(!r||c){this.oElementContext=null;this._fireChange({reason:b.Context});return;}R=this.oModel._isReloadNeeded(r,this.mParameters);if(R){this.fireDataRequested();this.bPendingRequest=true;}var o=this.oModel.createBindingContext(this.sPath,this.oContext,this.mParameters,function(o){var d,u=o&&o.isUpdated(),f=o&&o.isRefreshForced();if(t.bCreatePreliminaryContext&&o&&t.oElementContext){t.oElementContext.setPreliminary(false);t.oModel._updateContext(t.oElementContext,o.getPath());t._fireChange({reason:b.Context},false,true);}else if(!o||C.hasChanged(o,t.oElementContext)){t.oElementContext=o;t._fireChange({reason:b.Context},f,u);}if(R){if(t.oElementContext){d=t.oElementContext.getObject(t.mParameters);}t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:d});});t.bPendingRequest=false;}},R);if(o){if(this.bCreatePreliminaryContext&&this.oElementContext!==o){o.setPreliminary(true);this.oElementContext=o;this.oModel.oMetadata.loaded().then(function(){this._fireChange({reason:b.Context});}.bind(this));}}else if(this.oContext){this.oElementContext=null;this._fireChange({reason:b.Context});}};O.prototype.checkUpdate=function(){var c,p=this.mParameters,P=this.oContext&&this.oContext.isPreliminary();if(this.bInitial||this.bPendingRequest){return;}if(this.oContext&&this.oContext.isUpdated()){this.setContext(this.oContext);return;}if(P&&!this.bUsePreliminaryContext){return;}if(p.createPreliminaryContext){p=Object.assign({},p);delete p.createPreliminaryContext;}c=this.oModel.createBindingContext(this.sPath,this.oContext,p);if(c!==undefined&&c!==this.oElementContext){this.oElementContext=c;this._fireChange({reason:b.Context});}};O.prototype.refresh=function(f,g){if(typeof f==="string"){g=f;f=false;}this.sRefreshGroupId=g;this._refresh(f);this.sRefreshGroupId=undefined;};O.prototype._refresh=function(f,c){var t=this,d,k,s,e=false,p=this.mParameters,g=this.isRelative()&&this.oContext&&this.oContext.bCreated,r=this.getResolvedPath(),h;if(this.bInitial||g){return;}if(c){s=this.oModel._getObject(this.sPath,this.oContext);if(s){k=this.oModel._getKey(s);if(k in c){e=true;}}}else{e=true;}if(f||e){if(r){this.fireDataRequested();this.bPendingRequest=true;}if(this.sRefreshGroupId){p=q.extend({},this.mParameters);p.groupId=this.sRefreshGroupId;}var o=this.oModel.createBindingContext(this.sPath,this.oContext,p,function(o){if(t.bCreatePreliminaryContext&&o&&t.oElementContext){t.oElementContext.setPreliminary(false);t.oModel._updateContext(t.oElementContext,o.getPath());t._fireChange({reason:b.Context},false,true);}else if(C.hasChanged(o,t.oElementContext)||f){t.oElementContext=o;t._fireChange({reason:b.Context},f);}if(t.oElementContext){d=t.oElementContext.getObject(t.mParameters);}if(r){t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:d});});t.bPendingRequest=false;}},true);if(o&&this.bCreatePreliminaryContext){if(this.oElementContext!==o||f){o.setPreliminary(true);this.oElementContext=o;h=this.oElementContext.sPath;this.oModel._updateContext(this.oElementContext,r);this._fireChange({reason:b.Context},f);this.oModel._updateContext(this.oElementContext,h);}}}};O.prototype.setContext=function(c){var t=this,d,r,e=c&&c.bCreated,p=c&&c.isPreliminary(),f=c&&c.isRefreshForced(),u=c&&c.isUpdated(),s,R;if(this.bInitial||!this.isRelative()){return;}if(p&&!this.bUsePreliminaryContext){return;}if(u&&this.bUsePreliminaryContext){this._fireChange({reason:b.Context});return;}if(C.hasChanged(this.oContext,c)){this.oContext=c;r=this.getResolvedPath();if(!r||e){if(this.oElementContext!==null){this.oElementContext=null;this._fireChange({reason:b.Context});}return;}d=this.oModel._getObject(this.sPath,this.oContext);R=f||this.oModel._isReloadNeeded(r,this.mParameters);if(r&&R){this.fireDataRequested();this.bPendingRequest=true;}var c=this.oModel.createBindingContext(this.sPath,this.oContext,this.mParameters,function(c){if(t.bCreatePreliminaryContext&&c&&t.oElementContext){t.oElementContext.setPreliminary(false);t.oModel._updateContext(t.oElementContext,c.getPath());t._fireChange({reason:b.Context},false,true);}else if(C.hasChanged(c,t.oElementContext)){t.oElementContext=c;t._fireChange({reason:b.Context},f,u);}if(r&&R){if(t.oElementContext){d=t.oElementContext.getObject(t.mParameters);}t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:d});});t.bPendingRequest=false;}},R);if(c){if(this.bCreatePreliminaryContext){c.setPreliminary(true);this.oElementContext=c;s=this.oElementContext.sPath;this.oModel._updateContext(this.oElementContext,r);this._fireChange({reason:b.Context},f);this.oModel._updateContext(this.oElementContext,s);}}else if(this.oContext&&this.oElementContext!==null){this.oElementContext=null;this._fireChange({reason:b.Context});}}};O.prototype._fireChange=function(p,f,u){if(this.oElementContext){this.oElementContext.setForceRefresh(f);this.oElementContext.setUpdated(u);}a.prototype._fireChange.call(this,p);if(this.oElementContext){this.oElementContext.setForceRefresh(false);this.oElementContext.setUpdated(false);}};return O;});
