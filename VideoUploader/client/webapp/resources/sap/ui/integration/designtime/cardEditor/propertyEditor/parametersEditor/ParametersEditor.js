/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/baseEditor/propertyEditor/mapEditor/MapEditor","sap/base/util/includes","sap/base/util/restricted/_merge","sap/base/util/deepEqual"],function(B,M,i,_,d){"use strict";var P=M.extend("sap.ui.integration.designtime.cardEditor.propertyEditor.parametersEditor.ParametersEditor",{metadata:{library:"sap.ui.integration"},renderer:B.getMetadata().getRenderer().render});P.configMetadata=Object.assign({},M.configMetadata,{allowLabelChange:{defaultValue:true,mergeStrategy:"mostRestrictiveWins"}});P.prototype.getBoolenValue=function(v,V,D){if(typeof v==="boolean"){return v;}if(typeof V==="boolean"){return V;}return D;};P.prototype.formatItemConfig=function(c){var m=M.prototype.formatItemConfig.apply(this,arguments);var k=c.key;var t=c.value.type;var I=this.getNestedDesigntimeMetadataValue(k);var v=this.getBoolenValue(c.value.visible,I.visible,true);var e=this.getBoolenValue(c.value.editable,I.editable,true);var r=this.getBoolenValue(c.value.required,I.required,false);var E=this.getBoolenValue(c.value.expanded,I.expanded,true);var s=c.value.manifestpath||I.manifestpath||"";var D=c.value.description||I.description||"";var T=this.getBoolenValue(c.value.translatable,I.translatable,false);var a=this.getBoolenValue(c.value.allowSettings,I.allowSettings,true);var A=this.getBoolenValue(c.value.allowDynamicValues,I.allowDynamicValues,false);var V=c.value.visualization||I.visualization;var o=c.value.values||I.values;var l=c.value.label||I.label;var p=c.value.placeholder||I.placeholder||"";var b=c.value.validations||I.validations;var h=c.value.hint||I.hint||"";var f=c.value.formatter||I.formatter;m[2].visible=!(t==="group"||t==="array");m.push({label:this.getI18nProperty("CARD_EDITOR.LABEL"),path:"label",value:l,placeholder:l?undefined:k,type:"string",enabled:this.getConfig().allowLabelChange,itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.DESCRIPTION"),path:"description",value:D,allowBindings:true,visible:t!=="group",type:"string",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.HINT"),path:"hint",value:h,allowBindings:true,enabled:true,type:"string",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.FORMATTER"),path:"formatter",value:f,allowBindings:true,enabled:true,visible:t==="date"||t==="datetime"||t==="number"||t==="integer",type:"textArea",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.PLACEHOLDER"),path:"placeholder",value:p,allowBindings:true,visible:t==="string",type:"string",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.MANIFESTPATH"),path:"manifestpath",value:s,allowBindings:true,visible:t!=="group",type:"string",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.VISIBLE"),path:"visible",value:v,allowBindings:true,type:"boolean",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.EDITABLE"),path:"editable",allowBindings:true,value:e,enabled:true,visible:t!=="group",type:"boolean",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.REQUIRED"),path:"required",allowBindings:true,value:r,visible:t==="string"||t==="number"||t==="integer",enabled:true,type:"boolean",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.EXPANDED"),path:"expanded",allowBindings:true,value:E,enabled:true,visible:t==="group",type:"boolean",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.TRANSLATABLE"),path:"translatable",value:T,enabled:true,type:"boolean",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.ALLOWDYNAMICVALUES"),path:"allowDynamicValues",allowBindings:true,enabled:true,value:A,visible:t!=="group",type:"boolean",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.ALLOWSETTINGS"),path:"allowSettings",allowBindings:true,value:a,visible:t!=="group",type:"boolean",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.VISUALIZATION"),path:"visualization",allowBindings:true,value:V,visible:t!=="group",placeholder:this.getI18nProperty("CARD_EDITOR.PARAMETERS.VISUALIZATION.PLACEHOLDER"),type:"textArea",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.VALIDATIONS"),path:"validations",allowBindings:true,value:b,visible:t==="string"||t==="number"||t==="integer",placeholder:this.getI18nProperty("CARD_EDITOR.PARAMETERS.VALIDATIONS.PLACEHOLDER"),type:"textArea",itemKey:k},{label:this.getI18nProperty("CARD_EDITOR.PARAMETERS.VALUES"),path:"values",allowBindings:true,value:o,visible:t==="string"||t==="array",placeholder:this.getI18nProperty("CARD_EDITOR.PARAMETERS.VALUES.PLACEHOLDER"),type:"textArea",itemKey:k});return m;};P.prototype.processInputValue=function(v){return v;};P.prototype.processOutputValue=function(v){return v;};P.prototype._configItemsFormatter=function(I){return Array.isArray(I)?I.map(function(o){var a=this.getNestedDesigntimeMetadataValue(o.key);var c=_({},o.value,a);if(!c.label){c.label=o.key;}c.itemKey=o.key;c.path="value";c.designtime=this.getNestedDesigntimeMetadata(o.key);return c;}.bind(this)):[];};P.prototype.getItemChangeHandlers=function(){return Object.assign({},M.prototype.getItemChangeHandlers.apply(this,arguments),{label:this._onDesigntimeChange});};P.prototype.onBeforeConfigChange=function(c){if(!c.allowTypeChange&&!c.allowKeyChange){this.setFragment("sap.ui.integration.designtime.cardEditor.propertyEditor.parametersEditor.ParametersConfigurationEditor",function(){return 1;});}return c;};P.prototype._isValidItem=function(I,o){var t=o.type;var v=o.value;var a=this._getAllowedTypes();return(t&&i(a,t)||typeof v==="string"&&i(a,"string"));};return P;});
