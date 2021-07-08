/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/LoaderExtensions","sap/base/i18n/ResourceBundle","sap/base/util/includes"],function(L,R,i){"use strict";var C=(function(){var c;function a(r){c=[];var l=L.loadResource("sap/ui/integration/designtime/editor/languages.json",{dataType:"json",failOnError:false,async:false});for(var p in l){var f=[p];if(p.indexOf("_")>-1){f.push(p.substring(0,p.indexOf("_")));}if(!i(f,"en")){f.push("en");}var o=R.create({url:r,async:false,locale:p,supportedLocales:f,fallbackLocale:"en"});c[p]={"language":l[p],"resourceBundle":o};}return c;}return{getInstance:function(r){if(!c){c=a(r);}return c;}};})();return C;});
