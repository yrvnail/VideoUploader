/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/appVariant/AppVariantInlineChangeFactory","sap/ui/fl/apply/_internal/appVariant/DescriptorChangeTypes","sap/base/util/merge"],function(A,D,m){"use strict";function _(c,p,t){var P=m({},{changeType:c},{content:p});if(t){P.texts=t;}return P;}var a={};a.getDescriptorChangeTypes=function(){return D.getChangeTypes();};a.getCondensableDescriptorChangeTypes=function(){return D.getCondensableChangeTypes();};a.createNew=function(c,p,t){var P=_(c,p,t);return A.createNew(P);};a.createDescriptorInlineChange=function(d,p,t){var P=_(d,p,t);return A.createDescriptorInlineChange(P);};a.create_ovp_addNewCard=function(p,t){var P=_("appdescr_ovp_addNewCard",p,t);return A.create_ovp_addNewCard(P);};a.create_ovp_removeCard=function(p){var P=_("appdescr_ovp_removeCard",p);return A.create_ovp_removeCard(P);};a.create_ovp_changeCard=function(p,t){var P=_("appdescr_ovp_changeCard",p,t);return A.create_ovp_changeCard(P);};a.create_app_addNewInbound=function(p,t){var P=_("appdescr_app_addNewInbound",p,t);return A.create_app_addNewInbound(P);};a.create_app_removeInbound=function(p){var P=_("appdescr_app_removeInbound",p);return A.create_app_removeInbound(P);};a.create_app_removeAllInboundsExceptOne=function(p){var P=_("appdescr_app_removeAllInboundsExceptOne",p);return A.create_app_removeAllInboundsExceptOne(P);};a.create_app_changeInbound=function(p,t){var P=_("appdescr_app_changeInbound",p,t);return A.create_app_changeInbound(P);};a.create_app_addNewOutbound=function(p){var P=_("appdescr_app_addNewOutbound",p);return A.create_app_addNewOutbound(P);};a.create_app_removeOutbound=function(p){var P=_("appdescr_app_removeOutbound",p);return A.create_app_removeOutbound(P);};a.create_app_changeOutbound=function(p){var P=_("appdescr_app_changeOutbound",p);return A.create_app_changeOutbound(P);};a.create_app_addNewDataSource=function(p){var P=_("appdescr_app_addNewDataSource",p);return A.create_app_addNewDataSource(P);};a.create_app_removeDataSource=function(p){var P=_("appdescr_app_removeDataSource",p);return A.create_app_removeDataSource(P);};a.create_app_changeDataSource=function(p){var P=_("appdescr_app_changeDataSource",p);return A.create_app_changeDataSource(P);};var T={BEGINNING:"BEGINNING",END:"END"};a.create_app_addAnnotationsToOData=function(p){var P=_("appdescr_app_addAnnotationsToOData",p);return A.create_app_addAnnotationsToOData(P);};a.create_app_setTitle=function(p,t){if(!t){t={"":p};p={};}var P=_("appdescr_app_setTitle",p,t);return A.create_app_setTitle(P);};a.create_app_setSubTitle=function(p,t){if(!t){t={"":p};p={};}var P=_("appdescr_app_setSubTitle",p,t);return A.create_app_setSubTitle(P);};a.create_app_setShortTitle=function(p,t){if(!t){t={"":p};p={};}var P=_("appdescr_app_setShortTitle",p,t);return A.create_app_setShortTitle(P);};a.create_app_setDescription=function(p,t){if(!t){t={"":p};p={};}var P=_("appdescr_app_setDescription",p,t);return A.create_app_setDescription(P);};a.create_app_setInfo=function(p,t){if(!t){t={"":p};p={};}var P=_("appdescr_app_setInfo",p,t);return A.create_app_setInfo(P);};a.create_app_setAch=function(p){var P=_("appdescr_app_setAch",p);return A.create_app_setAch(P);};a.create_app_setDestination=function(p){var P=_("appdescr_app_setDestination",p);return A.create_app_setDestination(P);};a.create_app_setKeywords=function(p,t){var P=_("appdescr_app_setKeywords",p,t);return A.create_app_setKeywords(P);};a.create_app_addTechnicalAttributes=function(p){var P=_("appdescr_app_addTechnicalAttributes",p);return A.create_app_addTechnicalAttributes(P);};a.create_app_removeTechnicalAttributes=function(p){var P=_("appdescr_app_removeTechnicalAttributes",p);return A.create_app_removeTechnicalAttributes(P);};a.create_app_addCdsViews=function(p){var P=_("appdescr_app_addCdsViews",p);return A.create_app_addCdsViews(P);};a.create_app_removeCdsViews=function(p){var P=_("appdescr_app_removeCdsViews",p);return A.create_app_removeCdsViews(P);};a.create_flp_setConfig=function(p){var P=_("appdescr_flp_setConfig",p);return A.create_flp_setConfig(P);};a.create_ui5_addNewModel=function(p){var P=_("appdescr_ui5_addNewModel",p);return A.create_ui5_addNewModel(P);};a.create_ui5_removeModel=function(p){var P=_("appdescr_ui5_removeModel",p);return A.create_ui5_removeModel(P);};a.create_ui5_addNewModelEnhanceWith=function(p,t){var P=_("appdescr_ui5_addNewModelEnhanceWith",p,t);return A.create_ui5_addNewModelEnhanceWith(P);};a.create_ui5_replaceComponentUsage=function(p){var P=_("appdescr_ui5_replaceComponentUsage",p);return A.create_ui5_replaceComponentUsage(P);};a.create_ui5_addLibraries=function(p){var P=_("appdescr_ui5_addLibraries",p);return A.create_ui5_addLibraries(P);};a.create_ui5_setMinUI5Version=function(p){var P=_("appdescr_ui5_setMinUI5Version",p);return A.create_ui5_setMinUI5Version(P);};a.create_smb_addNamespace=function(p){var P=_("appdescr_smb_addNamespace",p);return A.create_smb_addNamespace(P);};a.create_smb_changeNamespace=function(p){var P=_("appdescr_smb_changeNamespace",p);return A.create_smb_changeNamespace(P);};a.create_ui_generic_app_setMainPage=function(p,t){var P=_("appdescr_ui_generic_app_setMainPage",p,t);return A.create_ui_generic_app_setMainPage(P);};a.create_ui_setIcon=function(p){var P=_("appdescr_ui_setIcon",p);return A.create_ui_setIcon(P);};a.create_ui_setDeviceTypes=function(p){var P=_("appdescr_ui_setDeviceTypes",p);return A.create_ui_setDeviceTypes(P);};a.create_url_setUri=function(p){var P=_("appdescr_url_setUri",p);return A.create_url_setUri(P);};a.create_fiori_setRegistrationIds=function(p){var P=_("appdescr_fiori_setRegistrationIds",p);return A.create_fiori_setRegistrationIds(P);};a.create_ui5_setFlexExtensionPointEnabled=function(p){var P=_("appdescr_ui5_setFlexExtensionPointEnabled",p);return A.create_ui5_setFlexExtensionPointEnabled(P);};return a;});