/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/documentation/sdk/controller/MasterTreeBaseController","sap/ui/model/json/JSONModel","sap/m/library","sap/base/Log","sap/ui/documentation/sdk/controller/util/Highlighter","sap/ui/documentation/sdk/controller/util/DocuInfo"],function(D,M,J,m,L,H,a){"use strict";var S=m.SplitAppMode;return M.extend("sap.ui.documentation.sdk.controller.TopicMaster",{onInit:function(){this._oTree=this.byId("tree");var o=new J();o.setSizeLimit(10000);this.getView().setModel(o);this.getRouter().getRoute("topic").attachPatternMatched(this._onMatched,this);this.getRouter().getRoute("topicId").attachPatternMatched(this._onTopicMatched,this);this.getRouter().getRoute("subTopicId").attachPatternMatched(this._onTopicMatched,this);this._oIndexPromise=this._getDocuIndexPromise().then(function(d){d=this._addSearchMetadata(d,"");o.setData(d);this._initTreeUtil("key","links");}.bind(this)).catch(function(){this.onRouteNotFound();}.bind(this));},_onTopicMatched:function(b){try{this.showMasterSide();}catch(e){L.error(e);}this._topicId=b.getParameter("arguments").id.split("/")[0];this._oIndexPromise.then(function(){this._expandTreeToNode(this._preProcessTopicID(this._topicId),this.getModel());}.bind(this));},onAfterRendering:function(){if(!this.highlighter){this.highlighter=new H(this._oTree.getDomRef(),{shouldBeObserved:true});}},onExit:function(){this.highlighter.destroy();},onTreeFilter:function(){M.prototype.onTreeFilter.apply(this,arguments);if(this.highlighter){this.highlighter.highlight(this._sFilter);}return this;},_onMatched:function(){this.getView().getParent().getParent().setMode(S.ShowHideMode);this._collapseAllNodes();this._clearSelection();if(D.system.desktop){setTimeout(function(){this.getView().byId("searchField").getFocusDomRef().focus();}.bind(this),0);}},_getDocuIndexPromise:function(){return a.getDocuIndexPromise(this.getConfig());},_addSearchMetadata:function(d,p){for(var i=0;i<d.length;i++){d[i].name=p?p+" "+d[i].text:d[i].text;if(d[i].links){d[i].links=this._addSearchMetadata(d[i].links,d[i].name);}}return d;},onNodeSelect:function(e){this.getRouter().navTo("topicId",{id:e.getParameter("listItem").getTarget()},false);},_preProcessTopicID:function(t){if(!t||(typeof t!=="string")){return t;}return t.replace(/\.html[#]?[0-9a-z_]*$/,"");}});});