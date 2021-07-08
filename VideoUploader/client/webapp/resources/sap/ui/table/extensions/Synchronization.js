/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ExtensionBase","../Table","../utils/TableUtils","../library","sap/base/Log"],function(E,T,a,l,L){"use strict";var b={setRowSelection:function(i,s){var t=this.getTable();var r=t.getRows()[i];if(r&&s!=null){a.toggleRowSelection(t,r.getIndex(),s);}},setRowHover:function(i,h){var t=this.getTable();var r=t.getRows()[i];if(r&&h!=null){r._setHovered(h);}},addVerticalScrollingListener:function(C){var t=this.getTable();var s=t._getScrollExtension();var d=s.constructor.ScrollDirection;if(C){s.registerForMouseWheel(C.wheelAreas,{scrollDirection:d.VERTICAL});s.registerForTouch(C.touchAreas,{scrollDirection:d.VERTICAL});}},placeVerticalScrollbarAt:function(h){var t=this.getTable();var s=t._getScrollExtension();if(!h){throw new Error("The HTMLElement in which the vertical scrollbar should be placed must be specified.");}if(!s.isVerticalScrollbarExternal()){var r=sap.ui.getCore().createRenderManager();t.getRenderer().renderVSbExternal(r,t);r.flush(h);var e=h.querySelector("#"+t.getId()+"-"+l.SharedDomRef.VerticalScrollBar);s.markVerticalScrollbarAsExternal(e);t.invalidate();}else{h.appendChild(s.getVerticalScrollbar());s.restoreVerticalScrollPosition();}},renderHorizontalScrollbar:function(r,i,s){var t=this.getTable();if(i==null){throw new Error("The id must be specified.");}t.getRenderer().renderHSbExternal(r,t,i,s);}};var c={onBeforeRendering:function(e){var s=this._getSyncExtension();var r=e&&e.isMarked("renderRows");var C=this.getDomRef("tableCCnt");if(!r&&C&&s._onTableContainerScrollEventHandler){C.removeEventListener("scroll",s._onTableContainerScrollEventHandler);delete s._onTableContainerScrollEventHandler;}},onAfterRendering:function(e){var s=this._getScrollExtension();var r=e&&e.isMarked("renderRows");var C=this.getDomRef("tableCCnt");if(s.isVerticalScrollbarExternal()&&!r){s.updateVerticalScrollbarHeight();s.updateVerticalScrollHeight();}if(!r){var o=this._getSyncExtension();o.syncInnerVerticalScrollPosition(C.scrollTop);if(!o._onTableContainerScrollEventHandler){o._onTableContainerScrollEventHandler=function(e){o.syncInnerVerticalScrollPosition(e.target.scrollTop);};}C.addEventListener("scroll",o._onTableContainerScrollEventHandler);}}};var S=E.extend("sap.ui.table.extensions.Synchronization",{_init:function(t,s,m){this._delegate=c;this._oPublicInterface={syncRowSelection:b.setRowSelection.bind(this),syncRowHover:b.setRowHover.bind(this),registerVerticalScrolling:b.addVerticalScrollingListener.bind(this),placeVerticalScrollbarAt:b.placeVerticalScrollbarAt.bind(this),renderHorizontalScrollbar:b.renderHorizontalScrollbar.bind(this)};a.addDelegate(t,this._delegate,t);return"SyncExtension";},destroy:function(){var t=this.getTable();if(t){t.removeEventDelegate(this._delegate);}this._delegate=null;this._oPublicInterface=null;E.prototype.destroy.apply(this,arguments);}});S.prototype.syncRowCount=function(C){this.callInterfaceHook("rowCount",arguments);};S.prototype.syncRowSelection=function(i,s){this.callInterfaceHook("rowSelection",arguments);};S.prototype.syncRowHover=function(i,h){this.callInterfaceHook("rowHover",arguments);};S.prototype.syncRowHeights=function(h){return this.callInterfaceHook("rowHeights",arguments);};S.prototype.syncInnerVerticalScrollPosition=function(s){this.callInterfaceHook("innerVerticalScrollPosition",arguments);};S.prototype.syncLayout=function(m){this.callInterfaceHook("layout",arguments);};S.prototype.callInterfaceHook=function(h,A){var C={};C[h]=Array.prototype.slice.call(A);L.debug("sap.ui.table.extensions.Synchronization","Sync "+h+"("+C[h]+")",this.getTable());return a.dynamicCall(this._oPublicInterface,C);};S.prototype.getInterface=function(){return this._oPublicInterface;};return S;});
