/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./PluginBase","sap/ui/core/Core","sap/ui/base/ManagedObjectObserver"],function(P,C,M){"use strict";var D=P.extend("sap.m.plugins.DataStateIndicator",{metadata:{library:"sap.m",properties:{filter:{type:"function",invalidate:false},enableFiltering:{type:"boolean",defaultValue:false,invalidate:false}},events:{dataStateChange:{allowPreventDefault:true,parameters:{dataState:{type:"sap.ui.model.DataState"},filteredMessages:{type:"object[]"}}},applyFilter:{allowPreventDefault:true,parameters:{filter:{type:"sap.ui.model.Filter"}}},clearFilter:{allowPreventDefault:true}}}});D.prototype.onActivate=function(c){this._bFiltering=false;var b=this._getBindingName();var B=c.getBinding(b);if(B){B.attachAggregatedDataStateChange(this._onAggregatedDataStateChange,this);this._processDataState(B.getDataState());}this._oObserver=new M(this._observeChanges.bind(this));this._oObserver.observe(c,{bindings:[b]});};D.prototype.onDeactivate=function(c){var b=this._getBindingName();var B=c.getBinding(b);if(B){B.detachAggregatedDataStateChange(this._onAggregatedDataStateChange,this);B.getDataState().getMessages().forEach(function(m){m.removeControlId(c.getId());});}if(this._bFiltering){this._clearFilter();}if(this._oMessageStrip){this._oMessageStrip.destroy();this._oMessageStrip=null;}if(this._oLink){this._oLink.destroy();this._oLink=null;}if(this._oInfoToolbar){this._oInfoToolbar.destroy();this._oInfoToolbar=this._oInfoText=null;}this._oObserver.unobserve(c,{bindings:[b]});this._oObserver.destroy();this._oObserver=null;};D.prototype._setLinkText=function(l){this._sLinkText=l;this._updateLinkControl();};D.prototype.setEnableFiltering=function(e){if((e=!!e)==this.getEnableFiltering()){return this;}this.setProperty("enableFiltering",e,true);if(this.isActive()){if(e){this.refresh();}else{this._clearFilter(true);}}};D.prototype.showMessage=function(t,T){if(!this.getEnabled()||!this.getControl()||(!t&&!this._oMessageStrip)){return;}if(this._oMessageStrip){this._oMessageStrip.setText(t).setType(T).setVisible(!!t);}else{sap.ui.require(["sap/m/MessageStrip"],function(a){var c=this.getControl();this._oMessageStrip=new a({showCloseButton:true,showIcon:true,close:function(){c.focus();}}).addStyleClass("sapUiTinyMargin");c.setAggregation("_messageStrip",this._oMessageStrip);c.addAriaLabelledBy(this._oMessageStrip);this._updateLinkControl();this.showMessage(t,T);}.bind(this));}};D.prototype.isFiltering=function(){return!!this._bFiltering;};D.prototype.refresh=function(){if(this.isActive()){var b=this.getControl().getBinding(this._getBindingName());if(b){this._processDataState(b.getDataState(),true);if(b.requestFilterForMessages&&this._bFiltering){this._applyFilter();}}}};D.prototype._updateLinkControl=function(){if(!this._oMessageStrip){return;}if(!this._sLinkText){this._oMessageStrip.setLink(null);}else if(this._oLink){this._oLink.setText(this._sLinkText);this._oMessageStrip.setLink(this._oLink);}else{sap.ui.require(["sap/m/Link"],function(L){this._oLink=new L({press:[this._onLinkPress,this]});this._updateLinkControl();}.bind(this));}};D.prototype._getBindingName=function(){return this.getConfig("defaultBindingName");};D.prototype._processDataState=function(d,i){if(!d){return;}if(!i&&!d.getChanges().messages){return;}var c=this.getControl();var b=c&&c.getBinding(this._getBindingName());if(b&&b.bIsBeingDestroyed){return;}var m=d.getMessages();var f=this.getFilter();if(f){m=m.filter(function(o){return f(o,c);});}if(!this.fireDataStateChange({dataState:d,filteredMessages:m})){return;}if(m.length){var s="";var u=false;var F=m[0];m.forEach(function(o){if(o.getControlIds().indexOf(c.getId())==-1){o.addControlId(c.getId());u=true;}});this._sCombinedType=this._getCombinedType(m);if(m.length==1&&F.getTarget()&&F.getTarget().endsWith(b.getPath())){s=F.getMessage();}else{s=this._translate(this._sCombinedType.toUpperCase());}this.showMessage(s,F.getType());if(!this._bFiltering&&b.requestFilterForMessages&&this.getEnableFiltering()){var f=this.getFilter();var a=f&&function(o){return f(o,c);};b.requestFilterForMessages(a).then(function(o){o&&this._setLinkText(this._translate("FILTER_ITEMS"));}.bind(this));}if(u){C.getMessageManager().getMessageModel().checkUpdate(false,true);}}else{this.showMessage("");if(this._bFiltering){this._clearFilter(true);}}};D.prototype._onLinkPress=function(){if(this._bFiltering){this._clearFilter();}else{this._applyFilter();}};D.prototype._clearFilter=function(c){if(this._bFiltering){this._bFiltering=false;this._hideFilterInfo(c);if(this.fireClearFilter()&&this._fnLastFilter){this._fnLastFilter("Application");delete this.getControl().getBinding(this._getBindingName()).filter;}}};D.prototype._applyFilter=function(){var f=this.getFilter();var c=this.getControl();var b=c.getBinding(this._getBindingName());var m=f&&function(o){return f(o,c);};b.requestFilterForMessages(m).then(function(F){if(!F){return this._setLinkText("");}var r=this._bFiltering;if(!r){this._bFiltering=true;this._showFilterInfo();}if(!this.fireApplyFilter({filter:F,revert:this._clearFilter.bind(this)})){return;}if(!r){this._fnLastFilter=b.filter.bind(b,b.aApplicationFilters);this._fnBindingFilter=b.filter;}else{delete b.filter;}b.filter(F,"Application");b.filter=function(a,s){if(s=="Application"){this._fnLastFilter=this._fnBindingFilter.bind(b,a);return b;}return this._fnBindingFilter.apply(b,arguments);}.bind(this);}.bind(this));};D.prototype._hideFilterInfo=function(c){this._oMessageStrip.setShowCloseButton(true);this._setLinkText(c?"":this._translate("FILTER_ITEMS"));this.getConfig("hideInfoToolbar",this.getControl());};D.prototype._showFilterInfo=function(){if(this._oInfoText){this._oMessageStrip.setShowCloseButton(false);this._setLinkText(this._translate("CLEAR_FILTER"));this._oInfoText.setText(this._translate("FILTERED_BY_"+this._sCombinedType.toUpperCase()));if(!this._oInfoToolbar.getParent()){this.getConfig("showInfoToolbar",this.getControl(),this._oInfoToolbar);}}else{sap.ui.require(["sap/m/Text","sap/m/Toolbar"],function(T,a){this._oInfoText=new T();this._oInfoToolbar=new a({design:"Info",content:this._oInfoText,active:this.hasListeners("filterInfoPress"),press:this.fireEvent.bind(this,"filterInfoPress")});this._showFilterInfo();}.bind(this));}};D.prototype._getCombinedType=function(m){if(m&&m.length){var t={None:0,Information:1,Success:2,Warning:4,Error:8};var s=0;m.forEach(function(o){s|=t[o.getType()];});if(s&t.Error&&s&t.Warning){return"Issue";}if(s&t.Error){return"Error";}if(s&t.Warning){return"Warning";}if(s&t.Success||s&t.Information){return"Notification";}}return"";};D.prototype._onAggregatedDataStateChange=function(e){this._processDataState(e.getParameter("dataState"));};D.prototype._observeChanges=function(c){var b=c.bindingInfo.binding;if(b){var o=(c.mutation=="ready")?"attach":"detach";b[o+"AggregatedDataStateChange"](this._onAggregatedDataStateChange,this);}};D.prototype._translate=function(b){var B="DATASTATE_"+b;var m=this.getControl().getMetadata();var l=m.getLibraryName();var c=m.getName().split(".").pop().toUpperCase();var r=C.getLibraryResourceBundle(l);var s=c+"_"+B;if(r.hasText(s)){return r.getText(s);}if(l=="sap.m"){return r.getText(B);}return C.getLibraryResourceBundle("sap.m").getText(B);};P.setConfigs({"sap.m.ListBase":{defaultBindingName:"items",useInfoToolbar:function(p){return p&&p.getUseInfoToolbar&&p.getUseInfoToolbar()=="Off"?false:true;},showInfoToolbar:function(c,i){if(this.useInfoToolbar(c.getParent())){this._oOldInfoToolbar=c.getInfoToolbar();this._oNewInfoToolbar=i;c.setInfoToolbar(i);}},hideInfoToolbar:function(c){if(this._oNewInfoToolbar){c.setInfoToolbar(this._oOldInfoToolbar);this._oNewInfoToolbar=this._oOldInfoToolbar=null;}},onDeactivate:function(c){this.hideInfoToolbar(c);}},"sap.ui.table.Table":{defaultBindingName:"rows",useInfoToolbar:function(p){return p&&p.getUseInfoToolbar&&p.getUseInfoToolbar()=="Off"?false:true;},showInfoToolbar:function(c,i){if(this.useInfoToolbar(c.getParent())){this._oInfoToolbar=i;c.addExtension(i);}},hideInfoToolbar:function(c){if(this._oInfoToolbar){c.removeExtension(this._oInfoToolbar);this._oInfoToolbar=null;}},onDeactivate:function(c){this.hideInfoToolbar(c);}}},D);return D;});
