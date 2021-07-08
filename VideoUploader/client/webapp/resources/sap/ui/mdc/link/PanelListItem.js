/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/XMLComposite'],function(X){"use strict";var P=X.extend("sap.ui.mdc.link.PanelListItem",{metadata:{library:"sap.ui.mdc",properties:{key:{type:"string"},text:{type:"string"},description:{type:"string"},href:{type:"string"},icon:{type:"string"},target:{type:"string",defaultValue:undefined},visible:{type:"boolean",defaultValue:true}},events:{pressLink:{allowPreventDefault:true,parameters:{target:{type:"string"}}}}}});P.prototype.onPress=function(e){if(!this.firePressLink({href:e.getSource().getHref(),target:e.getSource().getTarget()})){e.preventDefault();}};return P;});
