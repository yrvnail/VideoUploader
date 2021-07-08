/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_GroupingUtils","./_ColumnUtils","./_MenuUtils","./_BindingUtils","./_HookUtils","../library","sap/ui/base/Object","sap/ui/core/ResizeHandler","sap/ui/core/library","sap/ui/core/theming/Parameters","sap/ui/model/ChangeReason","sap/ui/thirdparty/jquery","sap/base/util/restricted/_throttle"],function(G,C,M,B,H,l,a,R,c,T,b,q,t){"use strict";var S=l.SelectionBehavior;var d=l.SelectionMode;var e=c.MessageType;var r;var f=null;var g={DATACELL:1<<1,COLUMNHEADER:1<<2,ROWHEADER:1<<3,ROWACTION:1<<4,COLUMNROWHEADER:1<<5,PSEUDO:1<<6};g.ANYCONTENTCELL=g.ROWHEADER|g.DATACELL|g.ROWACTION;g.ANYCOLUMNHEADER=g.COLUMNHEADER|g.COLUMNROWHEADER;g.ANYROWHEADER=g.ROWHEADER|g.COLUMNROWHEADER;g.ANY=g.ANYCONTENTCELL|g.ANYCOLUMNHEADER;var m={sapUiSizeCozy:48,sapUiSizeCompact:32,sapUiSizeCondensed:24,undefined:32};var h=1;var j=1;var D={sapUiSizeCozy:m.sapUiSizeCozy+j,sapUiSizeCompact:m.sapUiSizeCompact+j,sapUiSizeCondensed:m.sapUiSizeCondensed+j,undefined:m.undefined+j};var k={navigationIcon:"navigation-right-arrow",deleteIcon:"sys-cancel",resetIcon:"undo",navIndicatorWidth:3};var n={Render:"Render",VerticalScroll:"VerticalScroll",FirstVisibleRowChange:"FirstVisibleRowChange",Unbind:"Unbind",Animation:"Animation",Resize:"Resize",Zoom:"Zoom",Unknown:"Unknown"};for(var p in b){n[p]=b[p];}var I=":sapTabbable, .sapUiTableTreeIcon:not(.sapUiTableTreeIconLeaf)";function o(E){return E!=null&&E instanceof window.HTMLInputElement&&/^(text|password|search|tel|url)$/.test(E.type);}var s={Grouping:G,Column:C,Menu:M,Binding:B,Hook:H,CELLTYPE:g,BaseSize:m,BaseBorderWidth:h,RowHorizontalFrameSize:j,DefaultRowHeight:D,RowsUpdateReason:n,INTERACTIVE_ELEMENT_SELECTORS:I,ThemeParameters:k,hasRowHeader:function(i){return(i.getSelectionMode()!==d.None&&i.getSelectionBehavior()!==S.RowOnly)||G.isGroupMode(i);},hasSelectAll:function(i){var u=i?i.getSelectionMode():d.None;return u===d.MultiToggle&&i.getEnableSelectAll();},hasRowHighlights:function(i){if(!i){return false;}var u=i.getRowSettingsTemplate();if(!u){return false;}var v=u.getHighlight();return u.isBound("highlight")||(v!=null&&v!==e.None);},hasRowNavigationIndicators:function(i){if(!i){return false;}var u=i.getRowSettingsTemplate();if(!u){return false;}var N=u.getNavigated();return u.isBound("navigated")||N;},hasRowActions:function(i){var u=i?i.getRowActionTemplate():null;return u!=null&&(u.isBound("visible")||u.getVisible())&&i.getRowActionCount()>0;},isRowSelectionAllowed:function(i){return i.getSelectionMode()!==d.None&&(i.getSelectionBehavior()===S.Row||i.getSelectionBehavior()===S.RowOnly);},isRowSelectorSelectionAllowed:function(i){return i.getSelectionMode()!==d.None&&s.hasRowHeader(i);},areAllRowsSelected:function(i){if(!i){return false;}var u=i._getSelectionPlugin();var v=u.getSelectableCount();var w=u.getSelectedCount();return v>0&&v===w;},isNoDataVisible:function(i){return i.getShowNoData()&&!i._getRowMode().isNoDataDisabled()&&!s.hasData(i)||s.getVisibleColumnCount(i)===0;},hasData:function(i){var u=i.getBinding();var v=i._getTotalRowCount();var w=v>0;if(u&&u.providesGrandTotal){var x=u.providesGrandTotal()&&u.hasTotaledMeasures();w=(x&&v>1)||(!x&&v>0);}return w;},isBusyIndicatorVisible:function(i){if(!i||!i.getDomRef()){return false;}return i.getDomRef().querySelector("#"+i.getId()+"-sapUiTableGridCnt > .sapUiLocalBusyIndicator")!=null;},hasPendingRequests:function(i){if(!i){return false;}if(s.canUsePendingRequestsCounter(i)){return i._iPendingRequests>0;}else{return i._bPendingRequest;}},canUsePendingRequestsCounter:function(i){var u=i?i.getBinding():null;if(s.isA(u,"sap.ui.model.analytics.AnalyticalBinding")){return u.bUseBatchRequests;}else if(s.isA(u,"sap.ui.model.TreeBinding")){return false;}return true;},isA:function(O,v){return a.isA(O,v);},toggleRowSelection:function(i,v,u,w){if(!i||!i.getBinding()||i.getSelectionMode()===d.None||v==null){return false;}var x=i._getSelectionPlugin();function y(E){if(!x.isIndexSelectable(E)){return false;}i._iSourceRowIndex=E;var F=false;if(w){F=w(E,u);}else if(x.isIndexSelected(E)){if(u!==true){F=true;x.removeSelectionInterval(E,E);}}else if(u!==false){F=true;x.addSelectionInterval(E,E);}delete i._iSourceRowIndex;return F;}if(typeof v==="number"){if(v<0||v>=i._getTotalRowCount()){return false;}return y(v);}else{var $=q(v);var z=s.getCellInfo($[0]);var A=s.isRowSelectionAllowed(i);if(!s.Grouping.isInGroupHeaderRow($[0])&&((z.isOfType(s.CELLTYPE.DATACELL|s.CELLTYPE.ROWACTION)&&A)||(z.isOfType(s.CELLTYPE.ROWHEADER)&&s.isRowSelectorSelectionAllowed(i)))){var E=i.getRows()[z.rowIndex].getIndex();return y(E);}return false;}},getNoDataText:function(i){if(s.getVisibleColumnCount(i)===0){return s.getResourceText("TBL_NO_COLUMNS");}var N=i.getNoData();if(s.isA(N,"sap.ui.core.Control")){return null;}else if(typeof N==="string"){return N;}else{return s.getResourceText("TBL_NO_DATA");}},getVisibleColumnCount:function(i){return i._getVisibleColumns().length;},getHeaderRowCount:function(u){if(u._iHeaderRowCount===undefined){if(!u.getColumnHeaderVisible()){u._iHeaderRowCount=0;}else{var v=1;var w=u.getColumns();for(var i=0;i<w.length;i++){if(w[i].shouldRender()){v=Math.max(v,w[i].getMultiLabels().length);}}u._iHeaderRowCount=v;}}return u._iHeaderRowCount;},isVariableRowHeightEnabled:function(i){var u=i._getRowCounts();return i&&i._bVariableRowHeightEnabled&&!u.fixedTop&&!u.fixedBottom;},getNonEmptyRowCount:function(i){return Math.min(i._getRowCounts().count,i._getTotalRowCount());},getFocusedItemInfo:function(i){var u=i._getItemNavigation();if(!u){return null;}return{cell:u.getFocusedIndex(),columnCount:u.iColumns,cellInRow:u.getFocusedIndex()%u.iColumns,row:Math.floor(u.getFocusedIndex()/u.iColumns),cellCount:u.getItemDomRefs().length,domRef:u.getFocusedDomRef()};},getRowIndexOfFocusedCell:function(i){var u=s.getFocusedItemInfo(i);return u.row-s.getHeaderRowCount(i);},isFixedColumn:function(i,u){return u<i.getComputedFixedColumnCount();},hasFixedColumns:function(i){return i.getComputedFixedColumnCount()>0;},focusItem:function(i,u,E){var v=i._getItemNavigation();if(v){v.focusItem(u,E);}},getCellInfo:function(i){var u;var $=q(i);var v;var w;var x;var y;var z;u={type:0,cell:null,rowIndex:null,columnIndex:null,columnSpan:null};if($.hasClass("sapUiTableDataCell")){v=$.attr("data-sap-ui-colid");w=sap.ui.getCore().byId(v);u.type=s.CELLTYPE.DATACELL;u.rowIndex=parseInt($.parent().attr("data-sap-ui-rowindex"));u.columnIndex=w.getIndex();u.columnSpan=1;}else if($.hasClass("sapUiTableHeaderDataCell")){x=/_([\d]+)/;v=$.attr("id");y=x.exec(v);z=y&&y[1]!=null?parseInt(y[1]):0;u.type=s.CELLTYPE.COLUMNHEADER;u.rowIndex=z;u.columnIndex=parseInt($.attr("data-sap-ui-colindex"));u.columnSpan=parseInt($.attr("colspan")||1);}else if($.hasClass("sapUiTableRowSelectionCell")){u.type=s.CELLTYPE.ROWHEADER;u.rowIndex=parseInt($.parent().attr("data-sap-ui-rowindex"));u.columnIndex=-1;u.columnSpan=1;}else if($.hasClass("sapUiTableRowActionCell")){u.type=s.CELLTYPE.ROWACTION;u.rowIndex=parseInt($.parent().attr("data-sap-ui-rowindex"));u.columnIndex=-2;u.columnSpan=1;}else if($.hasClass("sapUiTableRowSelectionHeaderCell")){u.type=s.CELLTYPE.COLUMNROWHEADER;u.columnIndex=-1;u.columnSpan=1;}else if($.hasClass("sapUiTablePseudoCell")){v=$.attr("data-sap-ui-colid");w=sap.ui.getCore().byId(v);u.type=s.CELLTYPE.PSEUDO;u.rowIndex=-1;u.columnIndex=w?w.getIndex():-1;u.columnSpan=1;}if(u.type!==0){u.cell=$;}u.isOfType=function(A){if(A==null){return false;}return(this.type&A)>0;};return u;},getRowColCell:function(i,u,v,w){var x=i.getRows()[u]||null;var y=w?i.getColumns():i._getVisibleColumns();var z=y[v]||null;var A;var E=null;if(x&&z){if(!A){var F=z.getMetadata();while(F.getName()!=="sap.ui.table.Column"){F=F.getParent();}A=F.getClass();}E=x.getCells().find(function(E){return z===A.ofCell(E);})||null;}return{row:x,column:z,cell:E};},getCell:function(i,E,u){u=u===true;if(!i||!E){return null;}var $=q(E);var v=i.getDomRef();var w=".sapUiTableCell";if(!u){w+=":not(.sapUiTablePseudoCell)";}var x=$.closest(w,v);if(x.length>0){return x;}return null;},getParentCell:function(i,E,u){u=u===true;var $=q(E);var v=s.getCell(i,E,u);if(!v||v[0]===$[0]){return null;}else{return v;}},registerResizeHandler:function(i,u,v,w,x){w=w==null?"":w;x=x===true;if(!i||typeof u!=="string"||typeof v!=="function"){return undefined;}var y=i.getDomRef(w);s.deregisterResizeHandler(i,u);if(!i._mResizeHandlerIds){i._mResizeHandlerIds={};}if(x&&y){y=y.parentNode;}if(y){i._mResizeHandlerIds[u]=R.register(y,v);}return i._mResizeHandlerIds[u];},deregisterResizeHandler:function(u,v){var w=[];if(!u._mResizeHandlerIds){return;}if(typeof v==="string"){w.push(v);}else if(v===undefined){for(var K in u._mResizeHandlerIds){if(typeof K=="string"&&u._mResizeHandlerIds.hasOwnProperty(K)){w.push(K);}}}else if(Array.isArray(v)){w=v;}for(var i=0;i<w.length;i++){var x=w[i];if(u._mResizeHandlerIds[x]){R.deregister(u._mResizeHandlerIds[x]);u._mResizeHandlerIds[x]=undefined;}}},isFirstScrollableRow:function(i,u){if(isNaN(u)){var $=q(u);u=parseInt($.add($.parent()).filter("[data-sap-ui-rowindex]").attr("data-sap-ui-rowindex"));}return u==i._getRowCounts().fixedTop;},isLastScrollableRow:function(i,u){if(isNaN(u)){var $=q(u);u=parseInt($.add($.parent()).filter("[data-sap-ui-rowindex]").attr("data-sap-ui-rowindex"));}var v=i._getRowCounts();return u==v.count-v.fixedBottom-1;},getContentDensity:function(u){var v;var w=["sapUiSizeCondensed","sapUiSizeCompact","sapUiSizeCozy"];var x=function(F,O){if(!O[F]){return;}for(var i=0;i<w.length;i++){if(O[F](w[i])){return w[i];}}};var $=u.$();if($.length>0){v=x("hasClass",$);}else{v=x("hasStyleClass",u);}if(v){return v;}var P=null;var y=u.getParent();if(y){do{v=x("hasStyleClass",y);if(v){return v;}if(y.getDomRef){P=y.getDomRef();}else if(y.getRootNode){P=y.getRootNode();}if(!P&&y.getParent){y=y.getParent();}else{y=null;}}while(y&&!P);}$=q(P||document.body);v=x("hasClass",$.closest("."+w.join(",.")));return v;},isVariableWidth:function(w){return!w||w=="auto"||w.toString().match(/%$/);},getFirstFixedBottomRowIndex:function(i){var u=i._getRowCounts();if(!i.getBinding()||u.fixedBottom===0){return-1;}var F=-1;var v=i.getFirstVisibleRow();var w=i._getTotalRowCount();if(w>=u.count){F=u.count-u.fixedBottom;}else{var x=w-u.fixedBottom-v;if(x>=0&&(v+x)<w){F=x;}}return F;},getResourceBundle:function(O){O=q.extend({async:false,reload:false},O);if(r&&O.reload!==true){if(O.async===true){return Promise.resolve(r);}else{return r;}}var v=sap.ui.getCore().getLibraryResourceBundle("sap.ui.table",O.async===true);if(v instanceof Promise){v=v.then(function(i){r=i;return r;});}else{r=v;}return v;},getResourceText:function(K,v){return r?r.getText(K,v):"";},dynamicCall:function(O,v,i){var u=typeof O==="function"?O():O;if(!u||!v){return undefined;}i=i||u;if(typeof v==="function"){v.call(i,u);return undefined;}else{var P;var w=[];for(var F in v){if(typeof u[F]==="function"){P=v[F];w.push(u[F].apply(i,P));}else{w.push(undefined);}}if(w.length===1){return w[0];}else{return w;}}},throttle:function(i,w,O){O=Object.assign({leading:true,asyncLeading:false,trailing:true},O);var u;var v=false;var L={};var _;var x;if(O.leading&&O.asyncLeading){_=function(){if(v){var P=Promise.resolve().then(function(){if(!P.canceled){i.apply(L.context,L.args);}u=null;});P.cancel=function(){P.canceled=true;};u=P;}else{i.apply(this,arguments);}};}else{_=i;}var y=t(_,w,{leading:O.leading,trailing:O.trailing});if(O.leading&&O.asyncLeading){var z=y.cancel;y.cancel=function(){if(u){u.cancel();}z();};x=Object.assign(function(){L={context:this,args:arguments};v=true;y.apply(this,arguments);v=false;},y);}else{x=y;}return x;},throttleFrameWise:function(i){var A=null;var u=function(){u.cancel();A=window.requestAnimationFrame(function(v){i.apply(this,v);}.bind(this,arguments));};u.cancel=function(){window.cancelAnimationFrame(A);A=null;};return u;},getInteractiveElements:function(i){if(!i){return null;}var $=q(i);var u=s.getCellInfo($);if(u.isOfType(g.ANY|g.PSEUDO)){var v=$.find(I);if(v.length>0){return v;}}return null;},getFirstInteractiveElement:function(u,v){if(!u){return null;}var w=u.getTable();var x=u.getCells();if(v===true&&this.hasRowActions(w)){x.push(u.getRowAction());}for(var i=0;i<x.length;i++){var y=x[i].getDomRef();var $=this.getCell(w,y,true);var z=s.getInteractiveElements($);if(z){return z[0];}}return null;},convertCSSSizeToPixel:function(i,w){var P;if(typeof i!=="string"){return null;}if(i.endsWith("px")){P=parseInt(i);}else if(i.endsWith("em")||i.endsWith("rem")){P=Math.ceil(parseFloat(i)*s.getBaseFontSize());}else{return null;}if(w){return P+"px";}else{return P;}},getBaseFontSize:function(){if(f==null){var i=document.documentElement;if(i){f=parseInt(window.getComputedStyle(i).fontSize);}}return f==null?16:f;},readThemeParameters:function(){function i(u){return s.convertCSSSizeToPixel(T.get(u));}m.undefined=i("_sap_ui_table_BaseSize");m.sapUiSizeCozy=i("_sap_ui_table_BaseSizeCozy");m.sapUiSizeCompact=i("_sap_ui_table_BaseSizeCompact");m.sapUiSizeCondensed=i("_sap_ui_table_BaseSizeCondensed");h=i("_sap_ui_table_BaseBorderWidth");j=h;D.undefined=m.undefined+j;D.sapUiSizeCozy=m.sapUiSizeCozy+j;D.sapUiSizeCompact=m.sapUiSizeCompact+j;D.sapUiSizeCondensed=m.sapUiSizeCondensed+j;k.navigationIcon=T.get("_sap_ui_table_NavigationIcon");k.deleteIcon=T.get("_sap_ui_table_DeleteIcon");k.resetIcon=T.get("_sap_ui_table_ResetIcon");k.navIndicatorWidth=i("_sap_ui_table_NavIndicatorWidth");},selectElementText:function(E){if(o(E)){E.select();}},deselectElementText:function(E){if(o(E)){E.setSelectionRange(0,0);}},addDelegate:function(E,i,u){if(E&&i){E.addDelegate(i,false,u?u:i,false);}},removeDelegate:function(E,i){if(E&&i){E.removeDelegate(i);}},createWeakMapFacade:function(){var w=new window.WeakMap();return function(K){if(!K||!(typeof K==="object")){return null;}if(!w.has(K)){w.set(K,{});}return w.get(K);};}};G.TableUtils=s;C.TableUtils=s;M.TableUtils=s;B.TableUtils=s;H.TableUtils=s;return s;},true);