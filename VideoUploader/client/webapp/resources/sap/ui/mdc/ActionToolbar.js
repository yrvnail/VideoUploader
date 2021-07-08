/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/OverflowToolbar","sap/m/OverflowToolbarRenderer","sap/m/ToolbarSpacer","sap/m/ToolbarSeparator","sap/ui/mdc/enum/ActionToolbarActionAlignment","sap/ui/mdc/actiontoolbar/ActionToolbarAction"],function(O,a,T,b,A,c){"use strict";var d=O.extend("sap.ui.mdc.ActionToolbar",{metadata:{library:"sap.ui.mdc",defaultAggregation:"actions",properties:{useAsHeader:{type:"boolean",group:"Behavior",defaultValue:true}},aggregations:{begin:{type:"sap.ui.core.Control",multiple:true},between:{type:"sap.ui.core.Control",multiple:true},actions:{type:"sap.ui.core.Control",multiple:true},end:{type:"sap.ui.core.Control",multiple:true}}},renderer:a});var _=["begin","between","end"];function e(t,s){var i=_.indexOf(s);if(i>=0&&t._oSpacer){return i;}return-1;}function f(t,o){t._editctx=true;var r=t.addContent(o);t._editctx=false;return r;}function g(t,o,i){t._editctx=true;var r=t.insertContent(o,i);t._editctx=false;return r;}function h(t,o){t._editctx=true;var r=t.removeContent(o);t._editctx=false;return r;}function j(t){t._editctx=true;var r=t.destroyContent();t._editctx=false;return r;}function k(t,s){if(s==="content"&&!t._editctx){throw new Error("Mutator functions of the content aggregation of the ActionToolbar '"+t.getId()+"' must not be used.");}}d.prototype.init=function(){this._oTitleSeparator=new b({visible:false});this._oSpacer=new T();if(O.prototype.init){O.prototype.init.apply(this,arguments);}f(this,this._oTitleSeparator);f(this,this._oSpacer);this.setUseAsHeader(true);this._aActions=[];};d.prototype.exit=function(){this._oSpacer=null;this._oTitleSeparator=null;this._aActions=undefined;j(this);if(O.prototype.exit){O.prototype.exit.apply(this,arguments);}};d.prototype._getState=function(s){var i=e(this,s);if(i>=0){return{aggregationIndex:i,separatorIndex:[this.indexOfContent(this._oTitleSeparator),this.indexOfContent(this._oSpacer)]};}return null;};d.prototype.onAfterRendering=function(){O.prototype.onAfterRendering.apply(this,arguments);this._updateSeparator();};d.prototype._onContentPropertyChangedOverflowToolbar=function(E){if(this._bIsBeingDestroyed){return;}O.prototype._onContentPropertyChangedOverflowToolbar.apply(this,arguments);if(E.getParameter("name")==="visible"||E.getParameter("name")==="width"&&E.getSource()!=this._oTitleSeparator){this._updateSeparator();}};d.prototype._updateSeparator=function(){if(this._oTitleSeparator&&!this._editctx){var H=function(m){return m?m.some(function(C){var n=C.getWidth?C.getWidth()!=="0px":true;return C.getVisible()&&n;}):false;};var i=H(this.getBegin());var l=H(this.getBetween());this._oTitleSeparator.setVisible(i&&l);}};d.prototype.setUseAsHeader=function(H){this.setProperty("useAsHeader",H,true);this.toggleStyleClass("sapMTBHeader-CTX",!!H);return this;};d.prototype.indexOfAggregation=function(s,o){if(s==="action"&&o){return this._aActions.indexOf(o);}var i=this._getState(s);if(i){var I=this.indexOfContent(o);if(I<0){return-1;}var p=i.aggregationIndex==0?-1:i.separatorIndex[i.aggregationIndex-1];var n=i.aggregationIndex==2?this.getContent().length:i.separatorIndex[i.aggregationIndex];if(I<p||I>n){return-1;}return I-p-1;}return O.prototype.indexOfAggregation.apply(this,arguments);};d.prototype.indexOfAction=function(o){return this._aActions.indexOf(o);};d.prototype.getAggregation=function(s){var i=this._getState(s);if(i){var C=this.getContent();return C.slice(i.aggregationIndex===0?0:(i.separatorIndex[i.aggregationIndex-1]+1),i.aggregationIndex>=i.separatorIndex.length?C.length:i.separatorIndex[i.aggregationIndex]);}return O.prototype.getAggregation.apply(this,arguments);};d.prototype.getActions=function(){return this._aActions;};d.prototype.addAggregation=function(s,o){if(s==="actions"&&o){if(o.getMetadata().getName()==="sap.ui.mdc.actiontoolbar.ActionToolbarAction"){return this._addAction(o);}return this._addAction(new c({action:o}));}var i=this._getState(s);if(i){if(!o){return this;}var I=this.indexOfContent(o);if(I>=0){h(this,o);this.addAggregation(s,o);}else{g(this,o,i.aggregationIndex>=i.separatorIndex.length?this.getContent().length:i.separatorIndex[i.aggregationIndex]);}this._updateSeparator();return this;}k(this,s);return O.prototype.addAggregation.apply(this,arguments);};d.prototype.insertAggregation=function(s,o,i){if(s==="actions"&&o){if(o.getMetadata().getName()==="sap.ui.mdc.actiontoolbar.ActionToolbarAction"){return this._addAction(o);}return this._addAction(new c({action:o}));}var I=this._getState(s);if(I){if(!o){return this;}var l=this.indexOfContent(o);if(l>=0){l=this.indexOfAggregation(s,o);if(l>=0&&i>l){i--;}h(this,o);this.insertAggregation(s,o,i);}else{var L=this.getAggregation(s).length;if(i<0){l=0;}else if(i>L){l=L;}else{l=i;}var p=I.aggregationIndex==0?-1:I.separatorIndex[I.aggregationIndex-1];g(this,o,l+p+1);}this._updateSeparator();return this;}k(this,s);return O.prototype.insertAggregation.apply(this,arguments);};d.prototype._addAction=function(o){var s=o.getLayoutInformation().aggregationName;var i=o.getLayoutInformation().alignment;var l=this.getAggregation(s);var m;var L;var n=0;if(i===A.End){if(!this._aggregationContainsActionSeparatorBefore(s)){this.addAggregation(s,o.getSeparatorBefore());}this.addAggregation(s,o);if(!this._aActions.includes(o)){this._aActions.push(o);}}else if(i===A.Begin&&l[0]!==o){m=this._getActionsInAggregationWithAlignment(s,i);if(m.length){L=m[m.length-1];n=this.indexOfAggregation(s,L)+1;}this.insertAggregation(s,o,n);if(!this._aggregationContainsActionSeparatorAfter(s)){this.insertAggregation(s,o.getSeparatorAfter(),n+1);}if(!this._aActions.includes(o)){this._aActions.push(o);}}o.updateSeparators();return this;};d.prototype._aggregationContainsActionSeparator=function(s,i){var l=this._getActionsInAggregation(s);return l.some(function(o){return o['getSeparator'+i]().getVisible()&&!o.bIsDestroyed;});};d.prototype._aggregationContainsActionSeparatorBefore=function(s){return this._aggregationContainsActionSeparator(s,"Before");};d.prototype._aggregationContainsActionSeparatorAfter=function(s){return this._aggregationContainsActionSeparator(s,"After");};d.prototype._getActionsInAggregation=function(s){return this._aActions.filter(function(o){return o.getLayoutInformation().aggregationName===s&&!o.bIsDestroyed;});};d.prototype._getActionsInAggregationWithAlignment=function(s,i){return this._getActionsInAggregation(s).filter(function(o){return o.getLayoutInformation().alignment===i;});};d.prototype.removeAggregation=function(s,o){if(s!=="content"&&o&&o.getMetadata().getName()==="sap.ui.mdc.actiontoolbar.ActionToolbarAction"){return this._removeAction(o);}return this._removeAggregation(s,o);};d.prototype._removeAggregation=function(s,o){if(e(this,s)>=0){var r=h(this,o);this._updateSeparator();return r;}k(this,s);return O.prototype.removeAggregation.apply(this,arguments);};d.prototype._removeAction=function(o){var s=o.getLayoutInformation().aggregationName;var i=o.getLayoutInformation().alignment;var l;var m;var r;var S;var I=this._aActions.indexOf(o);if(I>-1){this._aActions.splice(I,1);}r=this._removeAggregation(s,o);l=this._getActionsInAggregation(s).filter(function(m){return m.getLayoutInformation().alignment===i;});if(l.length>0){m=l[0];S=this.indexOfAggregation(s,m);if(i===A.Begin&&!this._aggregationContainsActionSeparatorAfter(s)){S=S+1;this.insertAggregation(s,m.getSeparatorAfter(),S);}else if(i===A.End&&!this._aggregationContainsActionSeparatorBefore(s)){this.insertAggregation(s,m.getSeparatorBefore(),S);}m.updateSeparators();}return r;};d.prototype.removeAllAggregation=function(s){if(s==="actions"){return this._removeAllActions();}if(e(this,s)>=0){var C=this.getAggregation(s);for(var i=0;i<C.length;i++){this.removeAggregation(s,C[i]);}this._updateSeparator();return C;}k(this,s);return O.prototype.removeAllAggregation.apply(this,arguments);};d.prototype._removeAllActions=function(){var r=[];while(this._aActions&&this._aActions.length>0){r.push(this._removeAction(this._aActions[0]));}return r;};d.prototype.destroyAggregation=function(s){if(e(this,s)>=0||s==="actions"){var C=this.removeAllAggregation(s);for(var i=0;i<C.length;i++){C[i].destroy();}this._updateSeparator();return this;}k(this,s);return O.prototype.destroyAggregation.apply(this,arguments);};d.prototype.propagateProperties=function(){var C=this.getContent();var i;for(i=0;i<C.length;i++){if(C[i].aAPIParentInfos){C[i].__aAPIParentInfos=C[i].aAPIParentInfos;C[i].aAPIParentInfos=null;}}var r=O.prototype.propagateProperties.apply(this,arguments);for(i=0;i<C.length;i++){if(C[i].__aAPIParentInfos){C[i].aAPIParentInfos=C[i].__aAPIParentInfos;C[i].__aAPIParentInfos=null;}}return r;};return d;},true);