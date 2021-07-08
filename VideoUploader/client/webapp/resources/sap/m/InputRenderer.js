/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/InvisibleText','sap/ui/core/Renderer','./InputBaseRenderer','sap/m/library'],function(I,R,a,l){"use strict";var b=l.InputType;var c=R.extend(a);c.apiVersion=2;c.addOuterClasses=function(r,C){r.class("sapMInput");if(C.getDescription()){r.class("sapMInputWithDescription");}};c.writeInnerAttributes=function(r,C){var s=C.getShowSuggestion();r.attr("type",C.getType().toLowerCase());if(C.getType()==b.Number){r.attr("step","any");}if(C.getType()==b.Number&&sap.ui.getCore().getConfiguration().getRTL()){r.attr("dir","ltr").style("text-align","right");}if(s){r.attr("aria-haspopup","listbox");}if(s||C.getShowValueStateMessage()){r.attr("autocomplete","off");}if((!C.getEnabled()&&C.getType()=="Password")||(C.getShowSuggestion()&&C.isMobileDevice())||(C.getValueHelpOnly()&&C.getEnabled()&&C.getEditable()&&C.getShowValueHelp())){r.attr("readonly","readonly");}};c.addInnerClasses=function(r,C){};c.writeDescription=function(r,C){r.openStart("div").class("sapMInputDescriptionWrapper").style("width","calc(100% - "+C.getFieldWidth()+")").openEnd();r.openStart("span",C.getId()+"-descr").class("sapMInputDescriptionText").openEnd().text(C.getDescription()).close("span");r.close("div");};c.writeDecorations=function(r,C){if(C.getDescription()){this.writeDescription(r,C);}if(sap.ui.getCore().getConfiguration().getAccessibility()){if(C.getShowSuggestion()&&C.getEnabled()&&C.getEditable()){r.openStart("span",C.getId()+"-SuggDescr").class("sapUiPseudoInvisibleText").attr("role","status").attr("aria-live","polite").openEnd().close("span");}}};c.addWrapperStyles=function(r,C){r.style("width",C.getDescription()?C.getFieldWidth():"100%");};c.getAriaDescribedBy=function(C){var A=a.getAriaDescribedBy.apply(this,arguments);function d(s){A=A?A+" "+s:s;}if(C.getDescription()){d(C.getId()+"-descr");}if(C.getShowValueHelp()&&C.getEnabled()&&C.getEditable()){d(I.getStaticId("sap.m","INPUT_VALUEHELP"));if(C.getValueHelpOnly()){d(I.getStaticId("sap.m","INPUT_DISABLED"));}}return A;};c.getAriaRole=function(C){return"";};c.getAccessibilityState=function(C){var A=a.getAccessibilityState.apply(this,arguments);return A;};return c;},true);
