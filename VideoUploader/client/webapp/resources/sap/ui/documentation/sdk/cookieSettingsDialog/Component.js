/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Component","sap/ui/core/mvc/Controller","sap/ui/VersionInfo","sap/base/util/merge"],function(C,a,V,m){"use strict";var C=C.extend("sap.ui.documentation.sdk.cookieSettingsDialog.Component",{"COOKIE_NAMES":{"APPROVAL_REQUESTED":"dk_approval_requested","ALLOW_REQUIRED_COOKIES":"dk_allow_required_cookies","ALLOW_USAGE_TRACKING":"dk_allow_usage_tracking"},SWA_CONFIG:{pubToken:'d5a5359b-0b55-415c-acc8-314511b613ca',baseUrl:'https://webanalytics2.cfapps.eu10.hana.ondemand.com/tracker/',owner:null},SWA_TRACKER_URL:"sap/webanalytics/core/tracker/js/track.js",metadata:{manifest:"json"},enable:function(r){V.load().then(function(v){var s=v.libraries.some(function(l){return l.name==="sap.webanalytics.core";}),A=this.getCookieValue(this.COOKIE_NAMES.APPROVAL_REQUESTED)==="1",h=this.getCookieValue(this.COOKIE_NAMES.ALLOW_USAGE_TRACKING)==="1";if(!A){this.cookieSettingsDialogOpen({showCookieDetails:false,supportsUsageTracking:s},r);}if(s&&h){this.enableUsageTracking();}}.bind(this));},setCookie:function(c,v){var e,d=new Date();d.setTime(d.getTime()+(356*24*60*60*1000));e="expires="+d.toUTCString();document.cookie=c+"="+v+";"+e+";path=/";},getCookieValue:function(c){var b=document.cookie.split(';'),s;c=c+"=";for(var i=0;i<b.length;i++){s=b[i].trim();if(s.indexOf(c)===0){return s.substring(c.length,s.length);}}return"";},enableUsageTracking:function(){this._loadSWA().then(function(s){if(s&&typeof s.enable==="function"){s.enable();}});},disableUsageTracking:function(){var s=window['swa'];if(s&&typeof s.disable==="function"){s.disable();}},_loadSWA:function(){if(!this._oPromiseLoadSWA){this._oPromiseLoadSWA=new Promise(function(r,b){var s=m({},this.SWA_CONFIG),d=document,n=d.createElement('script'),f=d.getElementsByTagName('script')[0];n.type='text/javascript';n.defer=true;n.async=true;n.src=sap.ui.require.toUrl(this.SWA_TRACKER_URL);window.addEventListener("swaLoadSuccess",function(){r(window["swa"]);});f.parentNode.insertBefore(n,f);window["swa"]=s;}.bind(this));}return this._oPromiseLoadSWA;},cookieSettingsDialogOpen:function(o,v){this.getCookieSettingsController().then(function(c){c.openCookieSettingsDialog(o,v,this);}.bind(this));},getCookieSettingsController:function(){if(!this.oCookieSettingsControllerPromise){this.oCookieSettingsControllerPromise=new Promise(function(r,b){a.create({name:"sap.ui.documentation.sdk.cookieSettingsDialog.controller.CookieSettingsDialog"}).then(function(c){r(c);});});}return this.oCookieSettingsControllerPromise;}});return C;});