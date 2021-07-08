/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/documentation/sdk/controller/BaseController","sap/ui/model/resource/ResourceModel","sap/ui/Device","sap/ui/model/json/JSONModel","sap/ui/documentation/sdk/controller/util/ResourceDownloadUtil","sap/ui/documentation/sdk/model/formatter","sap/m/MessageBox","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator",'sap/ui/documentation/sdk/model/libraryData',"sap/base/Log"],function(q,B,R,D,J,a,f,M,b,F,c,l,L){"use strict";return B.extend("sap.ui.documentation.sdk.controller.DemoApps",{formatter:f,onInit:function(){var m=new J(),o=new R({bundleName:"sap.ui.documentation.messagebundle"});l.fillJSONModel(m);this.setModel(m);this.getView().setModel(o,"i18n");this.setModel(new J({demoAppsHomeLink:"topic/a3ab54ecf7ac493b91904beb2095d208"}),"newWindowLinks");this.getRouter().getRoute("demoapps").attachPatternMatched(this._onMatched,this);sap.ui.getVersionInfo({async:true}).then(function(v){var V=new J({isOpenUI5:v&&v.gav&&/openui5/i.test(v.gav)});this.getView().setModel(V,"appView");}.bind(this));this._onOrientationChange({landscape:D.orientation.landscape});this._onResize({name:(D.resize.width<=600?"Phone":"NoPhone")});},onBeforeRendering:function(){this._deregisterOrientationChange();},onAfterRendering:function(){this._registerOrientationChange();this._registerResize();},onExit:function(){this._deregisterOrientationChange();this._deregisterResize();},_registerOrientationChange:function(){D.orientation.attachHandler(this._onOrientationChange,this);},_deregisterOrientationChange:function(){D.orientation.detachHandler(this._onOrientationChange,this);},_registerResize:function(){D.media.attachHandler(this._onResize,this);},_deregisterResize:function(){D.media.detachHandler(this._onResize,this);},_onOrientationChange:function(e){this.byId("phoneImage").toggleStyleClass("phoneHeaderImageLandscape",e.landscape);},_onResize:function(e){this.byId("phoneImage").setVisible(e.name==="Phone");this.byId("desktopImage").setVisible(e.name!=="Phone");this.byId("phoneImage").toggleStyleClass("phoneHeaderImageDesktop",e.name==="Phone");},_onMatched:function(){try{this.hideMasterSide();}catch(e){L.error(e);}},onDownloadButtonPress:function(e){var d=this.byId("downloadDialog"),o=this.byId("downloadDialogList");this._oDownloadButton=e.getSource();o.getBinding("items").filter([]);d.open();},onReadMoreButtonPress:function(){var s=f.formatHttpHrefForNewWindow(this.getModel("newWindowLinks").getProperty("/demoAppsHomeLink"));window.open(s,"_blank");},onSearch:function(e){var d=this.byId("downloadDialogList"),Q=e.getParameter("newValue");d.getBinding("items").filter([new F("name",c.Contains,Q)]);},onCloseDialog:function(){var d=this.byId("downloadDialog"),o=this.byId("downloadDialogSearch");d.close();o.setValue("");},onDownloadPress:function(e){var s=e.getParameters().selectedItem,o=s?s:e.getSource().getParent();this._oDownloadButton.setBusy(true);sap.ui.require(["sap/ui/core/util/File","sap/ui/thirdparty/jszip"],function(d,g){var z=new g();q.getJSON(o.data("config"),function(C){var h=C.files,p=[],i=[];h.forEach(function(m){var P=a.fetch(C.cwd+m);P.then(function(n){if(n.errorMessage){i.push(n.errorMessage);}else{if(!m.startsWith("../")){z.file(m,n,{base64:false,binary:true});}}});p.push(P);});
// add generic license file
var u=sap.ui.require.toUrl("LICENSE.txt").replace("resources/","");var j=a.fetch(u);var k=new Promise(function(r,m){j.then(function(n){z.file("LICENSE.txt",n);r();}).catch(function(){
// LICENSE.txt not available in SAPUI5, continue without it
r();});});p.push(k);Promise.all(p).then(function(){if(i.length){var m=i.reduce(function(E,r){return E+r+"\n";},"Could not locate the following download files:\n");this._handleError(m);}this._oDownloadButton.setBusy(false);b.show("Downloading for app \""+o.getLabel()+"\" has been started");var n=z.generate({type:"blob"});this._createArchive(d,n,o.getLabel());}.bind(this));}.bind(this));}.bind(this));},createDemoAppCell:function(i,o){var d;if(o.getObject().teaser){try{sap.ui.loader.config({paths:{"test-resources":"test-resources"}});var r=sap.ui.require.toUrl(o.getObject().teaser);var t=sap.ui.xmlfragment(i,r);d=sap.ui.xmlfragment(i,"sap.ui.documentation.sdk.view.BlockLayoutTeaserCell",this);d.getContent()[0].addContent(t);sap.ui.loader.config({paths:{"test-resources":null}});t.addEventDelegate({"onAfterRendering":function(){this.getParent().getDomRef().childNodes[1].setAttribute("aria-hidden","true");}.bind(t)});}catch(e){L.warning("Teaser for demo app \""+o.getObject().name+"\" could not be loaded: "+e);d=sap.ui.xmlfragment(i,"sap.ui.documentation.sdk.view.BlockLayoutCell",this);}}else{d=sap.ui.xmlfragment(i,"sap.ui.documentation.sdk.view.BlockLayoutCell",this);}d.setBindingContext(o);return d;},_createArchive:function(d,C,s){d.save(C,s,"zip","application/zip");},_handleError:function(e){M.error(e);},handleLandingImageLoad:function(){this.byId("landingImageHeadline").setVisible(true);}});});