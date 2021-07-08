/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element','sap/ui/core/IconPool','./library',"sap/base/security/encodeXML"],function(E,I,l,e){"use strict";var S=E.extend("sap.ui.unified.ShellHeadUserItem",{metadata:{library:"sap.ui.unified",properties:{username:{type:"string",group:"Appearance",defaultValue:''},showPopupIndicator:{type:"boolean",group:"Accessibility",defaultValue:true},image:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{}}}});I.insertFontFaceStyle();S.prototype.onclick=function(o){this.firePress();o.preventDefault();};S.prototype.onsapspace=S.prototype.onclick;S.prototype.onsapenter=S.prototype.onclick;S.prototype.setImage=function(i){this.setProperty("image",i,true);if(this.getDomRef()){this._refreshImage();}return this;};S.prototype._refreshImage=function(){var i=this.$("img");var s=this.getImage();if(!s){i.html("").attr("style","").css("display","none");}else if(I.isIconURI(s)){var o=I.getIconInfo(s);i.html("").attr("style","");if(o){i.text(o.content).attr("role","presentation").attr("aria-label",o.text||o.name).css("font-family","'"+o.fontFamily+"'");}}else{var $=this.$("img-inner");if($.length==0||$.attr("src")!=s){i.attr("style","").attr("aria-label",null).html("<img role='presentation' id='"+this.getId()+"-img-inner' src='"+e(s)+"'>");}}};S.prototype._checkAndAdaptWidth=function(s){if(!this.getDomRef()){return false;}var r=this.$(),n=this.$("name");var b=r.width();r.toggleClass("sapUiUfdShellHeadUsrItmLimit",false);var m=240;if(s){m=Math.min(m,0.5*document.documentElement.clientWidth-225);}if(m<n.width()){r.toggleClass("sapUiUfdShellHeadUsrItmLimit",true);}return b!=r.width();};return S;});
