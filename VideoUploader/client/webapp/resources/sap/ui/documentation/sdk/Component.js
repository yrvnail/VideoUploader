/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/UIComponent","sap/ui/VersionInfo","sap/ui/Device","sap/ui/documentation/sdk/model/models","sap/ui/documentation/sdk/controller/ErrorHandler","sap/ui/model/json/JSONModel","sap/ui/documentation/sdk/controller/util/ConfigUtil","sap/base/util/Version","sap/ui/documentation/sdk/util/Resources","sap/base/Log","sap/ui/documentation/sdk/util/DocumentationRouter","sap/m/ColumnListItem"],function(q,U,V,D,m,E,J,C,a,R,L){"use strict";return U.extend("sap.ui.documentation.sdk.Component",{metadata:{manifest:"json",includes:["css/style.css"]},init:function(){this._oErrorHandler=new E(this);this.setModel(m.createDeviceModel(),"device");this.setModel(new J(),"libsData");this.setModel(new J(),"versionData");this.setModel(new J({includeDeprecated:false}),"searchData");U.prototype.init.apply(this,arguments);this.loadVersionInfo().then(this._bindVersionModel.bind(this));this.getRouter().initialize();},getCookiesManagement:function(){var i="sap.ui.documentation.sdk.cookieSettingsDialog";if(!this._oCookiesComponent){this._oCookiesComponent=this.runAsOwner(function(){this._oCookiesComponent=sap.ui.getCore().createComponent({id:'cookiesComp-'+i,name:i});return this._oCookiesComponent;}.bind(this));}return this._oCookiesComponent;},destroy:function(){this._oErrorHandler.destroy();this._oConfigUtil.destroy();this._oConfigUtil=null;this._oCookiesComponent&&this._oCookiesComponent.destroy();U.prototype.destroy.apply(this,arguments);},getContentDensityClass:function(){if(!this._sContentDensityClass){if(!D.support.touch){this._sContentDensityClass="sapUiSizeCompact";}else{this._sContentDensityClass="sapUiSizeCozy";}}return this._sContentDensityClass;},getConfigUtil:function(){if(!this._oConfigUtil){this._oConfigUtil=new C(this);}return this._oConfigUtil;},loadVersionInfo:function(){return V.load();},loadMessagesInfo:function(){var c=this;if(this.oMessagesInfo){return this.oMessagesInfo;}return new Promise(function(r,b){q.ajax({async:true,url:sap.ui.require.toUrl('sap/ui/documentation/sdk/model/messagesData.json'),dataType:'json',success:function(o){r(o);c.oMessagesInfo=o;},error:function(e){L(e);}});});},_bindVersionModel:function(v){var o,s,O,b,i,S;this.aAllowedMembers=["public","protected"];if(!v){return;}o=a(v.version);b=o.getSuffix();s=/-SNAPSHOT$/i.test(b);O=v.gav&&/openui5/i.test(v.gav);S=v.libraries.some(function(l){return l.name==="sap.webanalytics.core";});if(/internal/i.test(v.name)){i=true;this.aAllowedMembers.push("restricted");}this.getModel("versionData").setData({versionGav:v.gav,versionName:v.name,version:[o.getMajor(),o.getMinor(),o.getPatch()].join("."),fullVersion:v.version,openUi5Version:sap.ui.version,isOpenUI5:O,isSnapshotVersion:s,isDevVersion:s,isBetaVersion:!O&&!s&&/-beta$/i.test(b),isInternal:!!i,supportsSWA:S,libraries:v.libraries,allowedMembers:this.aAllowedMembers});}});});
