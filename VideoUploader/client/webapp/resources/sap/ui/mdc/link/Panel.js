/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/XMLComposite','sap/ui/mdc/library','sap/m/HBox','sap/m/VBox','sap/m/Text','sap/m/Image','sap/m/Link','sap/ui/core/CustomData','sap/base/Log','sap/m/SelectDialog','sap/m/StandardListItem','sap/ui/mdc/link/SelectionDialog','sap/ui/mdc/link/SelectionDialogItem','sap/ui/model/json/JSONModel','sap/ui/model/BindingMode','sap/ui/base/ManagedObjectObserver','sap/ui/mdc/flexibility/PanelItem.flexibility','sap/ui/mdc/flexibility/Panel.flexibility',"sap/ui/core/syncStyleClass"],function(X,m,H,V,T,I,L,C,a,S,b,c,d,J,B,M,P,e,s){"use strict";var f=X.extend("sap.ui.mdc.link.Panel",{metadata:{library:"sap.ui.mdc",designtime:"sap/ui/mdc/designtime/link/Panel.designtime",defaultAggregation:"items",properties:{enablePersonalization:{type:"boolean",defaultValue:true,invalidate:true},metadataHelperPath:{type:"string"},beforeNavigationCallback:{type:"function"}},aggregations:{items:{type:"sap.ui.mdc.link.PanelItem",multiple:true,singularName:"item"},additionalContent:{type:"sap.ui.core.Control",multiple:true,forwarding:{idSuffix:"--idSectionAdditionalContent",aggregation:"items"}}},events:{beforeSelectionDialogOpen:{},afterSelectionDialogClose:{}}}});f.prototype.init=function(){X.prototype.init.call(this);var o=new J({countAdditionalContent:0,countItemsWithIcon:0,countItemsWithoutIcon:0,showResetEnabled:false,runtimeItems:[],contentTitle:""});o.setDefaultBindingMode(B.TwoWay);o.setSizeLimit(1000);this.setModel(o,"$sapuimdclinkPanel");this._oObserver=new M(_.bind(this));this._oObserver.observe(this,{properties:["enablePersonalization"],aggregations:["items","additionalContent"]});};f.prototype.applySettings=function(){X.prototype.applySettings.apply(this,arguments);var o=this._getInternalModel();o.setProperty("/countAdditionalContent",this.getAdditionalContent().length);};f.prototype.exit=function(o){if(this._oObserver){this._oObserver.disconnect();this._oObserver=null;}};f.prototype.onPressLink=function(E){if(this.getBeforeNavigationCallback()&&E.getParameter("target")!=="_blank"){var h=E.getParameter("href");E.preventDefault();this.getBeforeNavigationCallback()(E).then(function(n){if(n){window.location.href=h;}});}};f.prototype.onPressLinkPersonalization=function(){this.openSelectionDialog(false,true,undefined);};f.prototype.openSelectionDialog=function(F,g,h){return sap.ui.getCore().loadLibrary('sap.ui.fl',{async:true}).then(function(){sap.ui.require(['sap/ui/fl/write/api/ControlPersonalizationWriteAPI','sap/ui/fl/apply/api/FlexRuntimeInfoAPI',this.getMetadataHelperPath()||"sap/ui/mdc/Link"],function(i,j,k){if(!j.isFlexSupported({element:this})){a.error("No AppComponent fount for control "+this+". Without AppComponent the personalization is not available.");return Promise.resolve();}return j.waitForChanges({element:this}).then(function(){return new Promise(function(r){var A=k.retrieveAllMetadata(this);var l=A.some(function(w){return!!w.icon;});var n=jQuery.extend(true,[],this._getInternalModel().getProperty("/runtimeItems"));var o=k.retrieveBaseline(this);var p=o;this._getInternalModel().setProperty("/baselineItems",p);var q=function(v){v.close();v.destroy();this.fireAfterSelectionDialogClose();}.bind(this);var R=[];var t=function(w,x){R.push({id:w,visible:x});};var u=function(v){var w=f._showResetButtonEnabled(p,v.getItems());this._getInternalModel().setProperty("/showResetEnabled",w);};this.fireBeforeSelectionDialogOpen();var U=false;var v=new c({showItemAsLink:!F,showReset:g,showResetEnabled:{path:'$selectionDialog>/showResetEnabled'},items:A.map(function(w){var x=f._getItemById(w.id,n);var y=this._isItemBaseline(w);var z=w.icon;if(l&&!z){z="sap-icon://chain-link";}return new d({key:w.id,text:w.text,description:w.description,href:w.href,target:w.target,icon:z,visible:x?x.visible:false,isBaseline:y});}.bind(this)),visibilityChanged:function(E){var w=E.getParameter("key");t(w,E.getParameter("visible"));u.call(this,E.getSource());}.bind(this),ok:function(){var w=this;var x=function(){var y=e.createChanges(w,R);var z=[];i.add({changes:y,ignoreVariantManagement:true}).then(function(D){z=z.concat(D);var E=P.createChanges(R);return i.add({changes:E,ignoreVariantManagement:true});}).then(function(D){z=z.concat(D);return i.save({selector:w,changes:z});}).then(function(){q(v);return r(true);});};if(U){i.reset({selectors:this.getItems()}).then(function(){x();});}else{x();}}.bind(this),cancel:function(){q(v);return r(true);},reset:function(){R=[];U=true;}});if(h){v.addStyleClass(h);}u.call(this,v);s("sapUiSizeCompact",this,v);v.setModel(this._getInternalModel(),"$selectionDialog");this.addDependent(v);v.open();}.bind(this));}.bind(this));}.bind(this));}.bind(this));};f._showResetButtonEnabled=function(g,h){var i=false;var j=f._mapSelectionDialogItems(h);var k=f._getVisibleItems(j);var l=f._getVisibleItems(g);if(k.length!==g.length){i=true;}else if(l.length&&k.length){var A=f._allItemsIncludedInArray(l,k);var n=f._allItemsIncludedInArray(k,l);i=!A||!n;}return i;};f._allItemsIncludedInArray=function(g,h){var A=true;g.forEach(function(i){var j=f._getItemsById(i.id,h);if(j.length===0){A=false;}});return A;};f._getItemsById=function(i,g){return g.filter(function(o){return o.id===i;});};f._getItemById=function(i,A){return f._getItemsById(i,A)[0];};f._getVisibleItems=function(g){return g.filter(function(i){return i.id!==undefined&&i.visible;});};f._mapSelectionDialogItems=function(g){return g.map(function(o){return{id:o.getKey(),visible:o.getVisible()};});};f.prototype._isItemBaseline=function(i){var g=this._getInternalModel().getProperty("/baselineItems");return!!f._getItemsById(i.id,g).length;};f.prototype._getInternalModel=function(){return this.getModel("$sapuimdclinkPanel");};f.prototype._propagateDefaultIcon=function(g){if(!g){return;}var o=this._getInternalModel();o.getProperty("/runtimeItems").forEach(function(h,i){if(!!h.icon){return;}o.setProperty("/runtimeItems/"+i+"/icon","sap-icon://chain-link");});};function _(o){var g=this._getInternalModel();if(o.object.isA("sap.ui.mdc.link.Panel")){switch(o.name){case"additionalContent":var A=o.child?[o.child]:o.children;g.setProperty("/countAdditionalContent",A.length);break;case"items":var i=o.child?[o.child]:o.children;i.forEach(function(p){var r=g.getProperty("/runtimeItems/");switch(o.mutation){case"insert":g.setProperty("/countItemsWithIcon",p.getIcon()?g.getProperty("/countItemsWithIcon")+1:g.getProperty("/countItemsWithIcon"));g.setProperty("/countItemsWithoutIcon",p.getIcon()?g.getProperty("/countItemsWithoutIcon"):g.getProperty("/countItemsWithoutIcon")+1);r.splice(this.indexOfItem(p),0,p.getJson());g.setProperty("/runtimeItems",r);this._propagateDefaultIcon(g.getProperty("/countItemsWithIcon")>0&&g.getProperty("/countItemsWithoutIcon")>0);this._oObserver.observe(p,{properties:["visible"]});break;case"remove":g.setProperty("/countItemsWithIcon",p.getIcon()?g.getProperty("/countItemsWithIcon")-1:g.getProperty("/countItemsWithIcon"));g.setProperty("/countItemsWithoutIcon",p.getIcon()?g.getProperty("/countItemsWithoutIcon"):g.getProperty("/countItemsWithoutIcon")-1);r.splice(this.indexOfItem(p),1);g.setProperty("/runtimeItems",r);this._propagateDefaultIcon(g.getProperty("/countItemsWithIcon")>0&&g.getProperty("/countItemsWithoutIcon")>0);this._oObserver.unobserve(p);p.destroy();break;default:a.error("Mutation '"+o.mutation+"' is not supported yet.");}},this);break;case"enablePersonalization":this.byId("idSectionPersonalizationButton").setVisible(o.current);break;default:a.error("The property or aggregation '"+o.name+"' has not been registered.");}}else if(o.object.isA("sap.ui.mdc.link.PanelItem")){switch(o.name){case"visible":var p=o.object;var h=this.indexOfItem(p);if(p.getVisibleChangedByUser()){g.setProperty("/runtimeItems/"+h+"/visible",p.getVisible());}else{g.setProperty("/baselineItems/"+h+"/visible",p.getVisible());g.setProperty("/runtimeItems/"+h+"/visible",p.getVisible());}break;default:a.error("The '"+o.name+"' of PanelItem is not supported yet.");}}this._updateContentTitle();}f.prototype.getContentTitle=function(){var o=this._getInternalModel();return o.getProperty("/contentTitle");};f.prototype._updateContentTitle=function(){var o=this._getInternalModel();var A=this.getAdditionalContent();var g="idSectionPersonalizationButton";if(A.length>0){g=A[0];}else{var i=this.getItems();if(i.length>0){g=i[0];}}o.setProperty("/contentTitle",g);};return f;});