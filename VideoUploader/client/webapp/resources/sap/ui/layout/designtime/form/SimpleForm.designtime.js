/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils"],function(F){"use strict";function g(e){var s=[];var l;var t;if(e.getMetadata().getName()==="sap.ui.layout.form.FormElement"){l=e.getLabel();if(l){s.push(l);}s=s.concat(e.getFields());}else if(e.getMetadata().getName()==="sap.ui.layout.form.FormContainer"){t=e.getTitle()||e.getToolbar();if(t){s[0]=t;}e.getFormElements().forEach(function(d){l=d.getLabel();if(l){s.push(l);}s=s.concat(d.getFields());});}else if(e.getMetadata().getName()==="sap.ui.layout.form.Form"){s.push(e);}return s;}function a(C){if(C.getMetadata().getName()==="sap.ui.layout.form.SimpleForm"){return C;}else if(C.getParent()){return a(C.getParent());}}function c(C){var s=a(C);return s&&s.getContent().every(function(d){return F.checkControlId(d);});}var f={aggregations:{formContainers:{childNames:{singular:"GROUP_CONTROL_NAME",plural:"GROUP_CONTROL_NAME_PLURAL"},getIndex:function(d,e){var h=d.getFormContainers();if(e){return h.indexOf(e)+1;}if(h.length>0&&h[0].getFormElements().length===0&&h[0].getTitle()===null){return 0;}return h.length;},beforeMove:function(s){if(s){s._bChangedByMe=true;}},afterMove:function(s){if(s){s._bChangedByMe=false;}},actions:{move:function(C){if(c(C)){return{changeType:"moveSimpleFormGroup"};}},createContainer:{changeType:"addSimpleFormGroup",changeOnRelevantContainer:true,isEnabled:function(d){var e=d.getFormContainers();for(var i=0;i<e.length;i++){if(e[i].getToolbar&&e[i].getToolbar()){return false;}}return true;},getCreatedContainerId:function(n){var t=sap.ui.getCore().byId(n);var p=t.getParent().getId();return p;}}}}},actions:{localReset:{changeType:"localReset",changeOnRelevantContainer:true}},getStableElements:g};var o={name:{singular:"GROUP_CONTROL_NAME",plural:"GROUP_CONTROL_NAME_PLURAL"},aggregations:{formElements:{childNames:{singular:"FIELD_CONTROL_NAME",plural:"FIELD_CONTROL_NAME_PLURAL"},beforeMove:function(s){if(s){s._bChangedByMe=true;}},afterMove:function(s){if(s){s._bChangedByMe=false;}},actions:{move:function(C){if(c(C)){return{changeType:"moveSimpleFormField"};}},add:{delegate:{changeType:"addSimpleFormField",changeOnRelevantContainer:true,supportsDefaultDelegate:true}}}}},actions:{rename:function(r){return{changeType:"renameTitle",changeOnRelevantContainer:true,isEnabled:!(r.getToolbar()||!r.getTitle()),domRef:function(C){if(C.getTitle&&C.getTitle()){return C.getTitle().getDomRef();}}};},remove:function(r){return{changeType:"removeSimpleFormGroup",changeOnRelevantContainer:true,isEnabled:!!(r.getToolbar()||r.getTitle()),getConfirmationText:function(r){var C=false;if(r.getMetadata().getName()==="sap.ui.layout.form.FormContainer"&&r.getToolbar&&r.getToolbar()){var t=r.getToolbar().getContent();if(t.length>1){C=true;}else if((t.length===1)&&(!t[0].getMetadata().isInstanceOf("sap.ui.core.Label")&&!t[0]instanceof sap.ui.core.Title&&!t[0]instanceof sap.m.Title)){C=true;}}if(C){var T=sap.ui.getCore().getLibraryResourceBundle("sap.ui.layout.designtime");return T.getText("MSG_REMOVING_TOOLBAR");}}};}},getStableElements:g};var b={name:{singular:"FIELD_CONTROL_NAME",plural:"FIELD_CONTROL_NAME_PLURAL"},actions:{rename:{changeType:"renameLabel",changeOnRelevantContainer:true,domRef:function(C){return C.getLabel().getDomRef();}},remove:{changeType:"hideSimpleFormField",changeOnRelevantContainer:true},reveal:{changeType:"unhideSimpleFormField",changeOnRelevantContainer:true}},getStableElements:g};return{palette:{group:"LAYOUT",icons:{svg:"sap/ui/layout/designtime/form/SimpleForm.icon.svg"}},aggregations:{content:{ignore:true},title:{ignore:true},toolbar:{ignore:function(s){return!s.getToolbar();},domRef:function(s){return s.getToolbar().getDomRef();}},form:{ignore:false,propagateMetadata:function(e){var t=e.getMetadata().getName();if(t==="sap.ui.layout.form.Form"){return f;}else if(t==="sap.ui.layout.form.FormContainer"){return o;}else if(t==="sap.ui.layout.form.FormElement"){return b;}else{return{actions:null};}},propagateRelevantContainer:true}}};});
