/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./BaseController","./util/TreeUtil","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(q,B,T,F,a){"use strict";var b=300;var M=B.extend("sap.ui.documentation.sdk.controller.MasterTreeBaseController",{_initTreeUtil:function(n,d){this._oTreeUtil=new T(n,d);},_expandTreeToNode:function(t,m){var o=this.byId("tree"),d=m.getData();var e=this._oTreeUtil.getPathToNode(t,d);var l;e.forEach(function(i){var I=this._findTreeItem(i);if(I){o.getBinding("items").expand(o.indexOfItem(I));l=I;}},this);if(l){l.setSelected(true);this.oSelectedItem={sTopicId:t,oModel:m};setTimeout(function(){if(l.getDomRef()&&!c(l.getDomRef())){this._scrollTreeItemIntoView(l);}}.bind(this),0);}},_findTreeItem:function(I){var o=this.byId("tree").getItems();for(var i=0;i<o.length;i++){if(o[i].getTarget()===I){return o[i];}}return null;},_scrollTreeItemIntoView:function(i){var p=this.byId("page");p.scrollToElement(i.getDomRef(),b);},onTreeFilter:function(e){this._sFilter=e.getParameter("newValue").trim();if(this._filterTimeout){clearTimeout(this._filterTimeout);}this._filterTimeout=setTimeout(function(){if(this.buildAndApplyFilters()){this._expandAllNodes();}else{this._collapseAllNodes();if(this.oSelectedItem){this._expandTreeToNode(this.oSelectedItem.sTopicId,this.oSelectedItem.oModel);}}this._filterTimeout=null;}.bind(this),250);},buildAndApplyFilters:function(){var o=this.byId("tree").getBinding("items");if(this._sFilter){o.filter(new F({path:"name",operator:a.Contains,value1:this._sFilter}));return true;}else{o.filter();return false;}},_expandAllNodes:function(){this.byId("tree").expandToLevel(10);},_collapseAllNodes:function(){this.byId("tree").collapseAll();},_clearSelection:function(){var i=this.byId("tree").getItems();if(i.length){i[0].setSelected(false);}},onTreeExpandAll:function(e){this._expandAllNodes();},onTreeCollapseAll:function(e){this._collapseAllNodes();}});function c(d){var r=d.getBoundingClientRect();return(r.top>=0&&r.left>=0&&r.bottom<=q(document).height()&&r.right<=q(document).width());}return M;});
