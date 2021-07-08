/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/p13n/Engine','./ItemBaseFlex'],function(E,I){"use strict";var C=Object.assign({},I);var r=function(c){if(c&&c.isA&&c.isA("sap.ui.mdc.Table")&&c.isTableBound()){if(!c._bWaitForBindChanges){c._bWaitForBindChanges=true;E.getInstance().waitForChanges(c).then(function(){c.checkAndRebind();delete c._bWaitForBindChanges;});}}};C.findItem=function(m,c,n){return c.find(function(o){var d=m.getProperty(o,"dataProperty");return d===n;});};C.afterApply=function(c,t,i){r(t);};C.addColumn=C.createAddChangeHandler();C.removeColumn=C.createRemoveChangeHandler();C.moveColumn=C.createMoveChangeHandler();return C;});
