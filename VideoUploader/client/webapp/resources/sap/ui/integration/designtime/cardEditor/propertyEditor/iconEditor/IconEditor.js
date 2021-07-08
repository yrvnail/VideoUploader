/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/baseEditor/util/isValidBindingString","sap/ui/core/Fragment",'sap/ui/unified/ColorPickerPopover','sap/ui/unified/library',"sap/ui/model/json/JSONModel","sap/base/util/deepClone","sap/base/util/isPlainObject","sap/base/util/isEmptyObject","sap/base/util/restricted/_omit","sap/ui/core/IconPool"],function(B,i,F,C,U,J,d,a,b,_,I){"use strict";var c=B.extend("sap.ui.integration.designtime.cardEditor.propertyEditor.iconEditor.IconEditor",{xmlFragment:"sap.ui.integration.designtime.cardEditor.propertyEditor.iconEditor.IconEditor",renderer:B.getMetadata().getRenderer().render});var o={config:{type:"simpleicon"},key:"src"};var t={config:{type:"string",maxLength:2,validators:{isAlphabetic:{type:"pattern",config:{pattern:"^[A-Za-z]*$"},errorMessage:"CARD_EDITOR.VALIDATOR.NOT_AN_ALPHABETIC"}}},key:"text"};var p={config:{type:"string"},key:"src"};var D={type:"icon",src:"",shape:"Circle",alt:"",text:"",backgroundColor:"",color:""};var e=U.ColorPickerMode;var f=U.ColorPickerDisplayMode;c.prototype.init=function(){this._oIconModel=new J(d(D));this._oIconModel.setDefaultBindingMode("OneWay");this.setModel(this._oIconModel,"icon");this._oConfigsModel=new J({selectConfig:{type:"select",items:[],allowBindings:false},valueConfig:o});this._oConfigsModel.setDefaultBindingMode("OneWay");this.setModel(this._oConfigsModel,"configs");this._oSettingsModel=new J({shapes:[],altVisible:true,backgroundColorVisible:false,colorVisible:false});this._oSettingsModel.setDefaultBindingMode("OneWay");this.setModel(this._oSettingsModel,"settings");this.attachModelContextChange(function(){if(this.getModel("i18n")){var h=d(this._oConfigsModel.getData());h.selectConfig.items=[{"key":"icon","title":this.getI18nProperty("BASE_EDITOR.ICON.TYPE_ICON")},{"key":"text","title":this.getI18nProperty("BASE_EDITOR.ICON.SETTINGS_DIALOG_TEXT_LABEL")},{"key":"picture","title":this.getI18nProperty("BASE_EDITOR.ICON.TYPE_PICTURE")}];this._oConfigsModel.setData(h);var j=d(this._oSettingsModel.getData());j.shapes=[{key:"Square",text:this.getI18nProperty("BASE_EDITOR.ICON.SETTINGS_DIALOG_SHAPE_SQUARE")},{key:"Circle",text:this.getI18nProperty("BASE_EDITOR.ICON.SETTINGS_DIALOG_SHAPE_CIRCLE")}];this._oSettingsModel.setData(j);}},this);};c.prototype.getExpectedWrapperCount=function(){return 2;};c.prototype.setValue=function(v){var n=b(v)?undefined:v;B.prototype.setValue.call(this,n);this._oIconModel.setData(Object.assign({},this._oIconModel.getData(),v,{type:this.getDesigntimeMetadataValue().type||g(v)}));};function g(v){if(a(v)){if(v.src){if(v.backgroundColor||v.color||(I.isIconURI(v.src)&&!!I.getIconInfo(v.src))||i(v.src,false)){return"icon";}else{return"picture";}}else if(v.text){return"text";}}return D.type;}c.prototype._prepareValue=function(k,h){return h[k];};c.prototype._onTypeChange=function(E){var h;var T=E.getSource().getValue();switch(T){case"icon":h=o;this._oSettingsModel.setProperty("/altVisible",true);break;case"text":h=t;this._oSettingsModel.setProperty("/altVisible",false);break;case"picture":h=p;this._oSettingsModel.setProperty("/altVisible",true);break;}this._oConfigsModel.setData(Object.assign({},this._oConfigsModel.getData(),{valueConfig:h}));this.setDesigntimeMetadataValue({type:T});this.setValue(this._processOutputValue(this._oIconModel.getData()));};c.prototype._updateValue=function(E){var k=this._oConfigsModel.getData().valueConfig.key;var n={};n[k]=E.getSource().getValue();var N=Object.assign({},this._oIconModel.getData(),n);this.setValue(this._processOutputValue(N));};c.prototype._handleSettings=function(){this._oOldData=d(this.getModel("icon").getData());if(!this._oSettingsDialog){return F.load({name:"sap.ui.integration.designtime.cardEditor.propertyEditor.iconEditor.IconEditorSettingsDialog",controller:this}).then(function(h){this._oDialogModel=new J(this._oOldData);this._oSettingsDialog=h;this._oSettingsDialog.setModel(this._oDialogModel,"data");this.addDependent(this._oSettingsDialog);this._oSettingsDialog.open();return this._oSettingsDialog;}.bind(this));}else{this._oSettingsDialog.open();this._oDialogModel.setData(this._oOldData);return Promise.resolve(this._oSettingsDialog);}};c.prototype._onSettingsSave=function(){this._oSettingsDialog.close();this.setValue(this._processOutputValue(this._oDialogModel.getData()));};c.prototype._onSettingsCancel=function(){this._oSettingsDialog.close();};c.prototype._processOutputValue=function(v){var T=this.getDesigntimeMetadataValue().type;var O=["type"];Object.keys(v).forEach(function(k){if(!v[k]||v[k]===D[k]){O.push(k);}});switch(T){case"icon":O.push("text");if(!v["src"]){O.push("shape","alt","backgroundColor","color");}break;case"picture":O.push("text","backgroundColor","color");if(!v["src"]){O.push("shape","alt");}break;case"text":O.push("src","alt");if(!v["text"]){O.push("shape","backgroundColor","color");}break;}return _(v,O);};c.prototype._openColorPickerPopup=function(E){this._inputId=E.getSource().getId();if(!this.oColorPickerSimplifiedPopover){this.oColorPickerSimplifiedPopover=new C("oColorPickerSimpplifiedPopover",{colorString:"blue",displayMode:f.Simplified,mode:e.HSL,change:this._handleColorPickerChange.bind(this)});}this.oColorPickerSimplifiedPopover.openBy(E.getSource());};c.prototype._handleColorPickerChange=function(E){var h=sap.ui.getCore().byId(this._inputId);h.setValue(E.getParameter("hex"));h.setValueState("None");this._inputId="";};c.prototype.getFocusDomRef=function(){var h=this.getContent();if(h){return this.getContent().getItems()[0].getContent()[0].getFocusDomRef();}};c.prototype.getIdForLabel=function(){var h=this.getContent();if(h){return this.getContent().getItems()[0].getContent()[0].getIdForLabel();}};return c;});
