/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/base/Log','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/core/Icon','sap/ui/core/delegate/ScrollEnablement','sap/ui/Device','./TabStripRenderer','sap/ui/core/ResizeHandler','sap/ui/core/Title','./Tab','sap/ui/events/KeyCodes','sap/ui/dom/jquery/parentByAttribute','sap/ui/dom/jquery/zIndex','sap/ui/thirdparty/jqueryui/jquery-ui-position'],function(q,L,l,C,I,a,S,D,T,R,b,c,K){"use strict";var d=C.extend("sap.ui.commons.TabStrip",{metadata:{library:"sap.ui.commons",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},selectedIndex:{type:"int",group:"Misc",defaultValue:0},enableTabReordering:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"tabs",aggregations:{tabs:{type:"sap.ui.commons.Tab",multiple:true,singularName:"tab"},_leftArrowControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_rightArrowControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{select:{parameters:{index:{type:"int"}}},close:{parameters:{index:{type:"int"}}}}}});d.SCROLL_SIZE=320;d.ANIMATION_DURATION=sap.ui.getCore().getConfiguration().getAnimation()?200:0;d.SCROLL_ANIMATION_DURATION=sap.ui.getCore().getConfiguration().getAnimation()?500:0;d.prototype.init=function(){this._bInitialized=true;this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._iCurrentScrollLeft=0;this._iMaxOffsetLeft=null;this._scrollable=null;this._oScroller=new S(this,this.getId()+"-tablist",{horizontal:!this.getEnableTabReordering(),vertical:false,nonTouchScrolling:true});this.data("sap-ui-fastnavgroup","true",true);};d.prototype.setEnableTabReordering=function(v){this.setProperty("enableTabReordering",v,true);if(this._oScroller){this._oScroller.setHorizontal(!v);}return this;};d.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};d.prototype.onAfterRendering=function(){if(this._oScroller){this._oScroller.setIconTabBar(this,q.proxy(this._updateScrollingAppearance,this),null);}this._initItemNavigation();this._updateScrollingAppearance();this._sResizeListenerId=R.register(this.getDomRef(),q.proxy(this._updateScrollingAppearance,this));var t=this.getTabs();var s=this.getSelectedIndex();var o=t[s];if(this._oScroller&&o&&o.$().length>0){if(!this._oScroller._$Container){this._oScroller.onAfterRendering();}this._scrollIntoView(o.$(),d.SCROLL_ANIMATION_DURATION);}for(var i=0;i<t.length;i++){t[i].onAfterRendering();}};d.prototype.createTab=function(t,o){var e=new b({text:t}),f=new c();f.setTitle(e);f.addContent(o);this.addTab(f);return f;};d.prototype.selectTabByDomRef=function(o){var i=this.getItemIndex(o);if(i>-1){if((i!=this.getSelectedIndex())&&(this.getTabs()[i].getEnabled())){var O=this.getSelectedIndex();this.setProperty('selectedIndex',i,true);this.rerenderPanel(O,true);this.oItemNavigation.setSelectedIndex(this.oItemNavigation.getFocusedIndex());}}};d.prototype.onsapspace=function(e){var s=e.target;this.selectTabByDomRef(s);};d.prototype.onsapspacemodifiers=d.prototype.onsapspace;d.prototype.onsapenter=d.prototype.onsapspace;d.prototype.onsapentermodifiers=d.prototype.onsapspace;d.prototype.onsapdelete=function(e){var s=e.target;var i=this.getItemIndex(s);if(i>-1&&this.getTabs()[i].getClosable()){this.fireClose({index:i});}};d.prototype.getFocusDomRef=function(){return this.getDomRef().firstChild;};d.prototype.exit=function(){this._bInitialized=false;this._iCurrentScrollLeft=null;this._iMaxOffsetLeft=null;this._scrollable=null;if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation;}};d.prototype.getItemIndex=function(o){var i;if(!o.id||o.id.search("-close")!=-1){var e=q(o).parentByAttribute("id");i=e.id;}else{i=o.id;}for(var f=0,t=this.getTabs();f<t.length;f++){if(i==t[f].getId()){return f;}}return-1;};d.prototype.removeTab=function(e){var i=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e);}if(typeof(e)=="object"){i=this.indexOfTab(e);}var t=this.getTabs()[i];if(t.getVisible()){t.setProperty("visible",false,true);this.hideTab(i);t.setProperty("visible",true,true);}if(this.getSelectedIndex()>i){this.setProperty('selectedIndex',this.getSelectedIndex()-1,true);}return this.removeAggregation("tabs",i,true);};d.prototype.setSelectedIndex=function(s){var o=this.getSelectedIndex();if(s==o){return this;}var t=this.getTabs();var e=t[s];if(this._oScroller&&e&&e.$().length>0){this._scrollIntoView(e.$(),d.SCROLL_ANIMATION_DURATION);}if(!e&&!this.getDomRef()){this.setProperty('selectedIndex',s,false);}else if(e&&e.getEnabled()&&e.getVisible()){this.setProperty('selectedIndex',s,true);if(this.getDomRef()&&!this.invalidated){this.rerenderPanel(o);if(this.oItemNavigation){var v=0;var f=-1;for(var i=0;i<t.length;i++){e=t[i];if(e.getVisible()===false){continue;}if(i==s){f=v;break;}v++;}this.oItemNavigation.setSelectedIndex(f);}}}else{this._warningInvalidSelectedIndex(s,e);}return this;};d.prototype.closeTab=function(i){var t=this.getTabs()[i];if(!t||!t.getClosable()||!t.getVisible()){return;}t.setProperty("visible",false,true);this.hideTab(i);};d.prototype.hideTab=function(e){var t=this.getTabs()[e];if(!this.getDomRef()){return;}var f=this.oItemNavigation.getFocusedIndex();var v=parseInt(t.$().attr("aria-posinset"))-1;var F=sap.ui.getCore().getCurrentFocusedControlId();t.$().remove();if(this.iVisibleTabs==1){this.setProperty('selectedIndex',-1,true);t.$("panel").remove();}else if(e==this.getSelectedIndex()){var n=e+1;while(n<this.getTabs().length&&(!this.getTabs()[n].getEnabled()||!this.getTabs()[n].getVisible())){n++;}if(n==this.getTabs().length){n=e-1;while(n>=0&&(!this.getTabs()[n].getEnabled()||!this.getTabs()[n].getVisible())){n--;}}this.setProperty('selectedIndex',n,true);this.rerenderPanel(e);}else{this.toggleTabClasses(this.getSelectedIndex(),this.getSelectedIndex());}this.iVisibleTabs--;var v=0;var g=[];var s=-1;var h=false;for(var i=0;i<this.getTabs().length;i++){var t=this.getTabs()[i];if(F==t.getId()){h=true;}if(t.getVisible()===false){continue;}if(i==this.getSelectedIndex()){s=v;}v++;t.$().attr("aria-posinset",v).attr("aria-setsize",this.iVisibleTabs);g.push(t.getDomRef());}if(v<=f){f--;}this.oItemNavigation.setItemDomRefs(g);this.oItemNavigation.setSelectedIndex(s);this.oItemNavigation.setFocusedIndex(f);if(h){this.oItemNavigation.focusItem(f);}this._updateScrollingAppearance();};d.prototype.rerenderPanel=function(o,f){var t=this.getTabs();var n=this.getSelectedIndex();var e=t[n];var O=t[o];setTimeout(function(){if(!this._bInitialized){return;}var $=this.$().find('.sapUiTabPanel');if(e){if($.length>0){var r=sap.ui.getCore().createRenderManager();this.getRenderer().renderTabContents(r,e);r.flush($[0]);r.destroy();}var N=e.getId();$.attr("id",N+"-panel").attr("aria-labelledby",N);}else{$.empty();}O.setProperty("scrollTop",$.scrollTop(),true);O.setProperty("scrollLeft",$.scrollLeft(),true);if(e){e.onAfterRendering();}if(f){this.fireSelect({index:n});}}.bind(this),0);if(e){this.toggleTabClasses(o,n);}};d.prototype.toggleTabClasses=function(o,n){var t=this.getTabs();var e=t[o];if(e){e.$().toggleClass("sapUiTabSel sapUiTab").attr("aria-selected",false);}var B=o-1;while(B>=0&&!t[B].getVisible()){B--;}if(B>=0){t[B].$().removeClass("sapUiTabBeforeSel");}var A=o+1;while(A<t.length&&!t[A].getVisible()){A++;}if(A<t.length){t[A].$().removeClass("sapUiTabAfterSel");}e=t[n];if(e){e.$().toggleClass("sapUiTabSel sapUiTab").attr("aria-selected",true);}B=n-1;while(B>=0&&!t[B].getVisible()){B--;}if(B>=0){t[B].$().addClass("sapUiTabBeforeSel");}A=n+1;while(A<t.length&&!t[A].getVisible()){A++;}if(A<t.length){t[A].$().addClass("sapUiTabAfterSel");}};d.prototype.invalidate=function(){this.invalidated=true;C.prototype.invalidate.apply(this,arguments);};d.prototype._warningInvalidSelectedIndex=function(s,t){var e="";if(!t){e="Tab not exists";}else if(!t.getEnabled()){e="Tab disabled";}else if(!t.getVisible()){e="Tab not visible";}L.warning("SelectedIndex "+s+" can not be set",e,"sap.ui.commons.TabStrip");};d.prototype.onkeydown=function(e){if(e.which===K.ESCAPE){this._stopMoving();}};d.prototype.onclick=function(e){var s=e.target;var $=q(s);if(s.className=="sapUiTabClose"){var i=this.getItemIndex($.parentByAttribute("id"));if(i>-1){this.fireClose({index:i});}}};d.prototype.onmousedown=function(e){var f=!e.button;var i=this._isTouchMode(e);if(!i&&!f){return;}var s=e.target;var $=q(s);if(s.className=="sapUiTabClose"){e.preventDefault();e.stopPropagation();e.target=null;return;}this.selectTabByDomRef(s);if(!this.getEnableTabReordering()){return;}var g=$.closest(".sapUiTab, .sapUiTabSel, .sapUiTabDsbl");if(g.length===1){this._onTabMoveStart(g,e,i);}};d.prototype._onTabMoveStart=function($,e,i){this._disableTextSelection();e.preventDefault();$.zIndex(this.$().zIndex()+10);var f=this.getItemIndex(e.target);var t=this.getTabs()[f];var g=this.$().find('.sapUiTabBarCnt').children();var h=q.inArray($[0],g);var w=$.outerWidth();this._dragContext={index:h,tabIndex:f,isTouchMode:i,startX:i?e.originalEvent.targetTouches[0].pageX:e.pageX,tab:t,tabWidth:w,tabCenter:$.position().left+w/2};this._aMovedTabIndexes=[];var j=q(document);if(i){j.on("touchmove",q.proxy(this._onTabMove,this));j.on("touchend",q.proxy(this._onTabMoved,this));}else{j.on("mousemove",q.proxy(this._onTabMove,this));j.on("mouseup",q.proxy(this._onTabMoved,this));}};d.prototype._onTabMove=function(e){var o=this._dragContext;if(!o){return;}var f=this._isTouchMode(e);if(f){e.preventDefault();}var p=f?e.targetTouches[0].pageX:e.pageX;var g=p-o.startX;o.tab.$().css({left:g});var $,x,O,r,h=this.$().find('.sapUiTabBarCnt').children(),m=this._aMovedTabIndexes,j=sap.ui.getCore().getConfiguration().getRTL();for(var i=0;i<h.length;i++){if(i==o.index){continue;}$=q(h[i]);x=$.position().left;O=parseFloat($.css('left'));if(!isNaN(O)){x-=O;}if(i<o.index!=j){r=x+$.outerWidth()>o.tabCenter+g;this._onAnimateTab($,o.tabWidth,r,m,i);}else{r=x<o.tabCenter+g;this._onAnimateTab($,-o.tabWidth,r,m,i);}}};d.prototype._onAnimateTab=function($,i,r,m,e){var f=q.inArray(e,m);var g=f!=-1;if(r&&!g){$.stop(true,true);$.animate({left:i},d.ANIMATION_DURATION);m.push(e);}else if(!r&&g){$.stop(true,true);$.animate({left:0},d.ANIMATION_DURATION);m.splice(f,1);}};d.prototype._onTabMoved=function(e){var o=this._dragContext;if(!o){return;}this._stopMoving();var m=this._aMovedTabIndexes;if(m.length==0){return;}var $=o.tab.$(),f,g=this.$().find('.sapUiTabBarCnt').children();var n=m[m.length-1],s=n,N=this.getItemIndex(g[n]);this.removeAggregation('tabs',o.tab,true);this.insertAggregation('tabs',o.tab,N,true);if(n>o.index){$.insertAfter(q(g[n]));}else{$.insertBefore(q(g[n]));}g=this.$().find('.sapUiTabBarCnt').children();if(!o.tab.getEnabled()){for(var i=0;i<g.length;i++){f=q(g[i]);if(f.hasClass('sapUiTabSel')){s=i;N=this.getItemIndex(f[0]);break;}}}this.setProperty('selectedIndex',N,true);g.removeClass('sapUiTabAfterSel');g.removeClass('sapUiTabBeforeSel');for(var i=0;i<g.length;i++){f=q(g[i]);f.attr("aria-posinset",i+1);if(i==s-1){f.addClass('sapUiTabBeforeSel');}else if(i==s+1){f.addClass('sapUiTabAfterSel');}}$.trigger("focus");this._initItemNavigation();};d.prototype._stopMoving=function(){var o=this._dragContext;if(!o){return;}var $=o.tab.$();$.css('z-index','');var e=this.$().find('.sapUiTabBarCnt').children();e.stop(true,true);e.css('left','');this._dragContext=null;var f=q(document);if(o.isTouchMode){f.off("touchmove",this._onTabMove);f.off("touchend",this._onTabMoved);}else{f.off("mousemove",this._onTabMove);f.off("mouseup",this._onTabMoved);}this._enableTextSelection();};d.prototype._isTouchMode=function(e){return!!e.originalEvent["touches"];};d.prototype._initItemNavigation=function(){var f=this.getDomRef('tablist'),t=f.childNodes,e=[],s=-1;for(var i=0;i<t.length;i++){e.push(t[i]);if(q(t[i]).hasClass("sapUiTabSel")){s=i;}}if(!this.oItemNavigation){this.oItemNavigation=new I();this.oItemNavigation.attachEvent(I.Events.AfterFocus,this._onItemNavigationAfterFocus,this);this.oItemNavigation.setCycling(false);this.addDelegate(this.oItemNavigation);}this.oItemNavigation.setRootDomRef(f);this.oItemNavigation.setItemDomRefs(e);this.oItemNavigation.setSelectedIndex(s);};d.prototype._disableTextSelection=function(e){q(e||document.body).attr("unselectable","on").addClass('sapUiTabStripNoSelection').bind("selectstart",function(E){E.preventDefault();return false;});};d.prototype._enableTextSelection=function(e){q(e||document.body).attr("unselectable","off").removeClass('sapUiTabStripNoSelection').unbind("selectstart");};d.prototype._getActualSelectedIndex=function(){var s=Math.max(0,this.getSelectedIndex());var t=this.getTabs();var o=t[s];if(o&&o.getVisible()&&o.getEnabled()){return s;}for(var i=0;i<t.length;i++){var e=t[i];if(e.getVisible()&&e.getEnabled()){return i;}}return 0;};d.prototype._getLeftArrowControl=function(){var i=this.getAggregation('_leftArrowControl');var t=this;if(!i){i=new a({src:'sap-icon://navigation-left-arrow',noTabStop:true,useIconTooltip:false,tooltip:'',press:function(e){t._scroll(-d.SCROLL_SIZE,d.SCROLL_ANIMATION_DURATION);}}).addStyleClass('sapUiTabStripScrollIcon sapUiTabStripLeftScrollIcon');this.setAggregation("_leftArrowControl",i,true);}return i;};d.prototype._getRightArrowControl=function(){var i=this.getAggregation('_rightArrowControl');var t=this;if(!i){i=new a({src:'sap-icon://navigation-right-arrow',noTabStop:true,useIconTooltip:false,tooltip:'',press:function(e){t._scroll(d.SCROLL_SIZE,d.SCROLL_ANIMATION_DURATION);}}).addStyleClass('sapUiTabStripScrollIcon sapUiTabStripRightScrollIcon');this.setAggregation("_rightArrowControl",i,true);}return i;};d.prototype._scroll=function(i,e){var s=this.getDomRef("scrollCont").scrollLeft,f;if(this._bRtl&&D.browser.firefox){f=s-i;if(f<-this._iMaxOffsetLeft){f=-this._iMaxOffsetLeft;}if(f>0){f=0;}}else{f=s+i;if(f<0){f=0;}if(f>this._iMaxOffsetLeft){f=this._iMaxOffsetLeft;}}if(this._oScroller){this._oScroller.scrollTo(f,0,e);}this._iCurrentScrollLeft=f;};d.prototype._scrollIntoView=function($,i){var e=this.$("tablist"),t=e.innerWidth()-e.width(),f=$.outerWidth(true),g=$.position().left-t/2,s=this.getDomRef("scrollCont"),h=s.scrollLeft,j=this.$("scrollCont").width(),n=h;if(g<0||g>j-f){if(this._bRtl&&D.browser.firefox){if(g<0){n+=g+f-j;}else{n+=g;}}else{if(g<0){n+=g;}else{n+=g+f-j;}}this._iCurrentScrollLeft=n;if(this._oScroller){this._oScroller.scrollTo(n,0,i);}}};d.prototype._hasScrolling=function(){var t=this.getDomRef("tablist"),s=this.getDomRef("scrollCont"),e=t&&(t.scrollWidth>s.clientWidth);this.$().toggleClass("sapUiTabStripScrollable",e);return e;};d.prototype._updateScrollingAppearance=function(){var t=this.getDomRef("tablist"),s=this.getDomRef("scrollCont"),i,r,e,f=false,g=false;if(this._hasScrolling()&&t&&s){if(this._bRtl&&D.browser.firefox){i=-s.scrollLeft;}else{i=s.scrollLeft;}r=t.scrollWidth;e=s.clientWidth;if(Math.abs(r-e)===1){r=e;}if(i>0){f=true;}if((r>e)&&(i+e<r)){g=true;}}this.$().toggleClass("sapUiTabStripScrollBack",f).toggleClass("sapUiTabStripScrollForward",g);this._iMaxOffsetLeft=Math.abs(q(s).width()-q(t).width());};d.prototype._onItemNavigationAfterFocus=function(e){var i=e.getParameter("index"),$=e.getParameter('event');if(!$){return;}var f=q($.target);if(!f||$.keyCode===undefined){return;}if(i!==null&&i!==undefined){var n=q(f.parent().children()[i]);if(n&&n.length){this._scrollIntoView(n,0);}}};return d;});
