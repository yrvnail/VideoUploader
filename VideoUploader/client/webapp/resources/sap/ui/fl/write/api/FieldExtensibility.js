/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/fieldExtensibility/ABAPAccess"],function(A){"use strict";var F={};var _;function g(){if(!_){_=A;}return _;}function c(f,a){var i=g();return Promise.resolve(i[f](a));}F.onControlSelected=function(C){return c("onControlSelected",C);};F.isExtensibilityEnabled=function(C){return c("isExtensibilityEnabled",C);};F.isServiceOutdated=function(s){return c("isServiceOutdated",s);};F.setServiceValid=function(s){return c("setServiceValid",s);};F.getTexts=function(){return c("getTexts");};F.getExtensionData=function(){return c("getExtensionData");};F.onTriggerCreateExtensionData=function(e){return c("onTriggerCreateExtensionData",e);};return F;});
