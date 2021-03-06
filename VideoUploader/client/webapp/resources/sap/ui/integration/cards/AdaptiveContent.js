/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/library","sap/ui/core/library","sap/ui/dom/includeScript","sap/ui/integration/cards/BaseContent","sap/ui/integration/cards/adaptivecards/elements/hostConfig","sap/m/VBox","sap/m/MessageStrip","sap/ui/core/HTML","sap/ui/core/Core","sap/ui/model/json/JSONModel","sap/base/Log","sap/ui/Device"],function(l,c,i,B,H,V,M,a,C,J,L,D){"use strict";var A,b,d,U,e,f,g,h,j,k;var m=c.MessageType;var n=B.extend("sap.ui.integration.cards.AdaptiveContent",{metadata:{library:"sap.ui.integration"},renderer:{apiVersion:2,render:function(r,o){var p=B.getMetadata().getRenderer();return p.render.apply(this,arguments);}}});n.prototype.init=function(){B.prototype.init.apply(this,arguments);this.setComponentsReady(false);this._bAdaptiveCardElementsReady=false;this._setupCardContent();};n.prototype.onAfterRendering=function(){this._renderMSCardContent(this._oCardTemplate||this._oCardConfig);};n.prototype.loadDependencies=function(o){this._loadWebcomponents();var p=[];p.push(new Promise(function(r,q){sap.ui.require(["sap/ui/integration/thirdparty/adaptivecards","sap/ui/integration/thirdparty/adaptivecards-templating","sap/ui/integration/cards/adaptivecards/elements/UI5InputText","sap/ui/integration/cards/adaptivecards/elements/UI5InputNumber","sap/ui/integration/cards/adaptivecards/elements/UI5InputChoiceSet","sap/ui/integration/cards/adaptivecards/elements/UI5InputTime","sap/ui/integration/cards/adaptivecards/elements/UI5InputDate","sap/ui/integration/cards/adaptivecards/elements/UI5InputToggle","sap/ui/integration/cards/adaptivecards/overwrites/ActionRender"],function(_,s,t,u,v,w,x,y,z){A=_;b=s;U=t;e=u;f=v;g=w;h=x;j=y;k=z;this._setupAdaptiveCardDependency();r();}.bind(this),q);}.bind(this)));if(o.get("/sap.card/configuration/enableMarkdown")){p.push(new Promise(function(r,q){sap.ui.require(["sap/ui/integration/thirdparty/markdown-it"],function(_){d=_;r();},q);}));}return Promise.all(p);};n.prototype._setupCardContent=function(){var o=new M(this.getId()+"-message",{showCloseButton:true,visible:false}),p=new a(this.getId()+"content",{preferDOM:false,content:"<div>&nbsp;</div>"});o.addStyleClass("sapUiTinyMargin");this.setAggregation("_content",new V({items:[o,p]}));};n.prototype.setConfiguration=function(o){this._oCardConfig=o;if(o&&o.request&&o.request.url){this._loadManifestFromUrl(o.request.url);return;}this._handleMarkDown();this._setupMSCardContent();};n.prototype.getConfiguration=function(){return this._oCardConfig;};n.prototype._handleMarkDown=function(){var t=this;A.AdaptiveCard.onProcessMarkdown=function(T,r){var o=t.getParent(),E=o&&o.getManifestEntry("/sap.card/configuration/enableMarkdown");if(E){r.outputHtml=new d().render(T);r.didProcess=true;return r;}};};n.prototype._loadManifestFromUrl=function(u){var o=new J(),t=this;o.loadData(u).then(function(){t._oCardConfig=Object.assign(t._oCardConfig,o.getData());}).then(function(){t._handleMarkDown();t._setupMSCardContent();}).then(function(){o.destroy();o=null;}).catch(function(){L.error("No JSON file found on this URL. Please provide a correct path to the JSON-serialized card object model file.");});};n.prototype._setupAdaptiveCardDependency=function(){this.adaptiveCardInstance=new A.AdaptiveCard();this._doMSCardsOverwrites();this._adjustHostConfig();this._handleActions();this._replaceElements();this._isRtl();};n.prototype._doMSCardsOverwrites=function(){A.Action.prototype.render=k;};n.prototype._adjustHostConfig=function(){this.adaptiveCardInstance.hostConfig=new A.HostConfig(H);};n.prototype._isRtl=function(){this.adaptiveCardInstance.isRtl=function(){return C.getConfiguration().getRTL();};};n.prototype._handleActions=function(){this.adaptiveCardInstance.onExecuteAction=function(o){var t,p,q;if(o instanceof A.OpenUrlAction){p={url:o.url};t=l.CardActionType.Navigation;}else if(o instanceof A.SubmitAction){p={data:o.data};t=l.CardActionType.Submit;}else{return;}q=this.getActions();if(q){q.fireAction(this,t,p);}}.bind(this);};n.prototype.onActionSubmitStart=function(F){this.getParent().setBusy(true);};n.prototype.onActionSubmitEnd=function(r,E){var R=C.getLibraryResourceBundle("sap.ui.integration"),s=E?R.getText("CARDS_ADAPTIVE_ACTION_SUBMIT_ERROR"):R.getText("CARDS_ADAPTIVE_ACTION_SUBMIT_SUCCESS"),o=E?m.Error:m.Success;this.showMessage(s,o);this.getParent().setBusy(false);};n.prototype.showMessage=function(s,t){var o=this.getAggregation("_content").getItems()[0];o.applySettings({"type":t,"text":s,"visible":true});};n.prototype._replaceElements=function(){A.AdaptiveCard.elementTypeRegistry.unregisterType("Input.Text");A.AdaptiveCard.elementTypeRegistry.registerType("Input.Text",function(){return new U();});A.AdaptiveCard.elementTypeRegistry.unregisterType("Input.Number");A.AdaptiveCard.elementTypeRegistry.registerType("Input.Number",function(){return new e();});A.AdaptiveCard.elementTypeRegistry.unregisterType("Input.ChoiceSet");A.AdaptiveCard.elementTypeRegistry.registerType("Input.ChoiceSet",function(){return new f();});A.AdaptiveCard.elementTypeRegistry.unregisterType("Input.Time");A.AdaptiveCard.elementTypeRegistry.registerType("Input.Time",function(){return new g();});A.AdaptiveCard.elementTypeRegistry.unregisterType("Input.Date");A.AdaptiveCard.elementTypeRegistry.registerType("Input.Date",function(){return new h();});A.AdaptiveCard.elementTypeRegistry.unregisterType("Input.Toggle");A.AdaptiveCard.elementTypeRegistry.registerType("Input.Toggle",function(){return new j();});};n.prototype.setCardDataProvider=function(o){this._oCardDataProvider=o;};n.prototype._setupMSCardContent=function(){var o=this._oCardConfig,p,q=this._oCardDataProvider;if(!this.adaptiveCardInstance||!o){return;}p=o.$data||o.data;if(!p&&!q){this._oCardTemplate=null;this._renderMSCardContent(o);return;}if(o.$data){p={"json":p};}this._setDataConfiguration(p);};n.prototype.onDataChanged=function(){var p=this.getBindingContext().getPath(),o=this.getModel().getProperty(p);this._oCardTemplate=this._setTemplating(this._oCardConfig,o);this.getAggregation("_loadingProvider").setLoading(false);this.invalidate();};n.prototype._renderMSCardContent=function(o){var p=this.getAggregation("_content").getItems()[1].$(),I=!!this.isLoading();this.setBusy(I);this.getAggregation("_content").toggleStyleClass("sapFCardContentHidden",I);if(this.adaptiveCardInstance&&o&&p.length){this.adaptiveCardInstance.parse(o);p.html(this.adaptiveCardInstance.render());this._bAdaptiveCardElementsReady=true;this._fireCardReadyEvent();if(this.adaptiveCardInstance.renderedElement){this.adaptiveCardInstance.renderedElement.tabIndex=-1;}}};n.prototype._fireCardReadyEvent=function(){if(this._bAdaptiveCardElementsReady&&this.getComponentsReady()){this._bReady=true;this.fireReady();}};n.prototype._setTemplating=function(t,o){var p=new b.Template(t),q=new b.EvaluationContext();q.$root=o;return p.expand(q);};n.prototype._loadWebcomponents=function(){if(this.getComponentsReady()){L.debug("WebComponents were already loaded");this._fireCardReadyEvent();return;}if(window.customElements){window.customElements.whenDefined("ui5-button").then(function(){if(!this.getComponentsReady()){this.setComponentsReady(true);this._fireCardReadyEvent();}}.bind(this));}setTimeout(function(){if(this.getComponentsReady()){L.debug("WebComponents were already loaded");return;}i({id:"webcomponents-loader",url:sap.ui.require.toUrl("sap/ui/integration/thirdparty/webcomponents/webcomponentsjs/webcomponents-loader.js")});}.bind(this));document.addEventListener("WebComponentsReady",function(){if(this.getComponentsReady()){L.debug("WebComponents were already loaded");return;}if(D.browser.edge||D.browser.msie){i({id:"webcomponents-bundle-es5",url:sap.ui.require.toUrl("sap/ui/integration/thirdparty/webcomponents/bundle.es5.js")});}else{i({id:"webcomponents-bundle",attributes:{type:"module"},url:sap.ui.require.toUrl("sap/ui/integration/thirdparty/webcomponents/bundle.esm.js")});}this.setComponentsReady(true);this._fireCardReadyEvent();}.bind(this));};n.prototype.setComponentsReady=function(v){this._bComponentsReady=v;return this;};n.prototype.getComponentsReady=function(){return!!this._bComponentsReady;};return n;});
