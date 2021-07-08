/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/library","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ui/model/resource/ResourceModel","sap/ui/core/Core"],function(C,m,J,F,R,a){"use strict";return C.extend("sap.ui.documentation.sdk.cookieSettingsDialog.controller.CookieSettingsDialog",{constructor:function(){this._oCookiesUtil=null;this._oRootView=null;this._oInitOptions=null;this._oModel=new J();},openCookieSettingsDialog:function(o,r,c){this._oInitOptions=o;this._oModel.setData(o,true);if(this._oCookieSettingsDialog){this._oCookieSettingsDialog.open();}else{this._initData(r,c);F.load({name:"sap.ui.documentation.sdk.cookieSettingsDialog.view.CookieSettingsDialog",controller:this}).then(this._initDialog.bind(this)).then(function(d){this._oCookieSettingsDialog=d;this._oCookieSettingsDialog.open();}.bind(this));}},_initDialog:function(d){var M=new R({bundleName:"sap.ui.documentation.sdk.cookieSettingsDialog.i18n.i18n"});d.setModel(this._oModel,"cookieData");d.setModel(M,"i18n");this._oRootView.addDependent(d);d.attachBeforeOpen(function(){this._oCookieSettingsDialog.toggleStyleClass("cookiesDetailedView",this._oModel.getProperty("/showCookieDetails"));},this);d.attachAfterOpen(function(){a.byId("btnSetPreferences").$().focus();});if(!this._bAlreadyRequestedCookiesApproval){d.attachEventOnce("afterClose",function(){this._bAlreadyRequestedCookiesApproval=true;this._oCookiesUtil.setCookie(this._oCookiesUtil.COOKIE_NAMES.APPROVAL_REQUESTED,"1");},this);}return d;},formatCookieValue:function(v){return Boolean(Number(v));},onAcceptAllCookies:function(){this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES,true);this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING,this._oModel.getProperty("/supportsUsageTracking"));this._oCookieSettingsDialog.close();},onRejectAllCookies:function(){this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES,false);this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING,false);this._oCookieSettingsDialog.close();},onSaveCookies:function(){var h=a.byId("requiredCookiesSwitch").getState(),H=a.byId("functionalCookiesSwitch").getState();this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES,h);this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING,H);this._oCookieSettingsDialog.close();},showCookieDetails:function(){this._oModel.setProperty("/showCookieDetails",true);this._oCookieSettingsDialog.addStyleClass("cookiesDetailedView");this._focusButton(a.byId("btnSavePreferences"));},onCancelPress:function(){if(this._oInitOptions.showCookieDetails===true){this.onCancelEditCookies();}else{this.hideCookieDetails();}},hideCookieDetails:function(){this._oModel.setProperty("/showCookieDetails",false);this._oCookieSettingsDialog.removeStyleClass("cookiesDetailedView");this._focusButton(a.byId("btnSetPreferences"));},onCancelEditCookies:function(){this._oCookieSettingsDialog.close();a.byId("requiredCookiesSwitch").setState(this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_REQUIRED_COOKIES)==="1");a.byId("functionalCookiesSwitch").setState(this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_USAGE_TRACKING)==="1");},_saveCookiePreference:function(c,e){var v=e?"1":"0",o;if(c===this._oCookieNames.ALLOW_USAGE_TRACKING){o=this._oCookiesUtil.getCookieValue(c);if(o!==v){e&&this._oCookiesUtil.enableUsageTracking();!e&&this._oCookiesUtil.disableUsageTracking();}}this._oCookiesUtil.setCookie(c,v);this._oModel.setProperty("/"+c,v);},_initData:function(r,c){this._oCookiesUtil=c;this._oRootView=r;this._oCookieNames=this._oCookiesUtil.COOKIE_NAMES;this._bAlreadyRequestedCookiesApproval=this._oCookiesUtil.getCookieValue(this._oCookieNames.APPROVAL_REQUESTED)==="1";this._setInitialCookieValues();},_setInitialCookieValues:function(){var d={};if(!this._bAlreadyRequestedCookiesApproval){d[this._oCookieNames.ALLOW_REQUIRED_COOKIES]="1";d[this._oCookieNames.ALLOW_USAGE_TRACKING]="1";}else{d[this._oCookieNames.ALLOW_REQUIRED_COOKIES]=this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_REQUIRED_COOKIES);d[this._oCookieNames.ALLOW_USAGE_TRACKING]=this._oCookiesUtil.getCookieValue(this._oCookieNames.ALLOW_USAGE_TRACKING);}this._oModel.setData(d,true);},_focusButton:function(b){if(b.$().length){b.$().focus();return;}b.addEventDelegate({"onAfterRendering":function(){b.$().focus();b.removeEventDelegate(this);}});}});});
