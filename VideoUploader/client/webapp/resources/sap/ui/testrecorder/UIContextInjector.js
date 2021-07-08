/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/thirdparty/URI","sap/ui/base/Object","sap/base/util/restricted/_debounce","sap/ui/testrecorder/CommunicationBus","sap/ui/testrecorder/CommunicationChannels","sap/ui/testrecorder/Constants"],function(q,U,B,_,C,a,c){"use strict";var u=null;var r=false;var b=B.extend("sap.ui.testrecorder.UIContextInjector",{constructor:function(){if(!u){this._sIdentifier=j();Object.apply(this,arguments);}else{return u;}}});b.prototype.injectFrame=function(t,o){window.communicationWindows=window.communicationWindows||{};this._generateTestRecorderUrl();this.fnOnClose=o;this._isInIframe=t.indexOf("window")===-1;this._onResizeHandleMouseover=d.bind(this);this._onResizeHandleMousedown=f.bind(this);this._onResizeHandleMouseleave=g.bind(this);this._onDocumentMouseup=h.bind(this);this._onDocumentMousemove=i.bind(this);if(this._isInIframe){this.dockFrameBottom();}else{this._openWindow();}window.communicationWindows.testRecorder.addEventListener("beforeunload",function(){if(!this._dockStarted&&!this._closeTriggered){this.close();}}.bind(this));C.subscribe(a.MINIMIZE_IFRAME,this.minimizeFrame.bind(this));C.subscribe(a.SHOW_IFRAME,this.unminimizeFrame.bind(this));C.subscribe(a.CLOSE_IFRAME,this.close.bind(this));C.subscribe(a.OPEN_NEW_WINDOW,this.openNewWindow.bind(this));C.subscribe(a.DOCK_IFRAME_BOTTOM,this.dockFrameBottom.bind(this));C.subscribe(a.DOCK_IFRAME_RIGHT,this.dockFrameRight.bind(this));C.subscribe(a.DOCK_IFRAME_LEFT,this.dockFrameLeft.bind(this));};b.prototype.minimizeFrame=function(){this._iframe.style.width=c.FRAME.MINIMIZED.width;this._iframe.style.height=c.FRAME.MINIMIZED.height;Object.values(this._resizeHandles).forEach(function(e){e.style.display="none";});};b.prototype.unminimizeFrame=function(){switch(this._sRememberedDockSide){case c.DOCK.RIGHT:this.dockFrameRight();break;case c.DOCK.LEFT:this.dockFrameLeft();break;case c.DOCK.BOTTOM:default:this.dockFrameBottom();break;}};b.prototype.dockFrameBottom=function(){this._dockFrame(c.DOCK.BOTTOM);};b.prototype.dockFrameRight=function(){this._dockFrame(c.DOCK.RIGHT);};b.prototype.dockFrameLeft=function(){this._dockFrame(c.DOCK.LEFT);};b.prototype._dockFrame=function(s){if(!this._iframe){this._dockStarted=true;this.close();this._openFrame();}this._sRememberedDockSide=s;for(var F in c.FRAME[s]){this._iframe.style[F]=c.FRAME[s][F];}Object.values(this._resizeHandles).forEach(function(e){e.style.display="none";});this._resizeHandles[s].style.display="block";for(var H in c.RESIZE_HANDLE[s]){this._resizeHandles[s].style[H]=c.RESIZE_HANDLE[s][H];}};b.prototype.openNewWindow=function(){this._dockStarted=true;this.close();this._openWindow();};b.prototype._openWindow=function(){window.communicationWindows.testRecorder=window.open(this._sUrl,"sapUiTestRecorder","width=1024,height=700,status=no,toolbar=no,menubar=no,resizable=yes,location=no,directories=no,scrollbars=yes");window.communicationWindows.testRecorder.document.title="Test Recorder";k();this._isInIframe=false;this._dockStarted=false;this._closeTriggered=false;};b.prototype._openFrame=function(){var F=document.createElement("IFRAME");var e=document.createElement("DIV");var m=this._createResizeHandle(q.extend(c.RESIZE_HANDLE.BOTTOM,{cursor:"n-resize",resize:function(p,P){p.style.top=P.y+"px";this._iframe.style.height="calc(100% - "+P.y+"px)";}.bind(this)}));var n=this._createResizeHandle(q.extend(c.RESIZE_HANDLE.RIGHT,{cursor:"e-resize",resize:function(p,P){p.style.left=P.x+"px";this._iframe.style.left=P.x+"px";this._iframe.style.width="calc(100% - "+P.x+"px)";}.bind(this)}));var o=this._createResizeHandle(q.extend(c.RESIZE_HANDLE.LEFT,{cursor:"w-resize",resize:function(p,P){p.style.left=P.x+"px";this._iframe.style.width=P.x+"px";}.bind(this)}));e.id=c.RESIZE_OVERLAY_ID;e.style.position="absolute";e.style.width="100%";e.style.height="100%";e.style.top="0";e.style.left="0";e.style["z-index"]=c.RESIZE_OVERLAY_ZINDEX;e.style.display="none";F.id=c.IFRAME_ID;F.src=this._sUrl;F.style.position="absolute";F.style.border="none";F.style.borderRadius="1px";F.style["z-index"]=c.IFRAME_ZINDEX;F.style.boxShadow="1px -10px 42px -4px #888";document.body.appendChild(m);document.body.appendChild(n);document.body.appendChild(o);document.body.appendChild(e);document.body.appendChild(F);window.communicationWindows.testRecorder=F.contentWindow;k();this._iframe=F;this._resizeOverlay=e;this._resizeHandles={BOTTOM:m,RIGHT:n,LEFT:o};this._dockStarted=false;this._isInIframe=true;this._closeTriggered=false;};b.prototype.close=function(){if(this._closeTriggered){return;}this._closeTriggered=true;if(this._isInIframe){var e=this._iframe&&this._iframe.contentWindow;if(e){this._iframe.src="about:blank";e.close();if(typeof CollectGarbage=="function"){CollectGarbage();}this._iframe.remove();this._resizeOverlay.remove();Object.values(this._resizeHandles).forEach(function(m){m.remove();});this._iframe=null;this._resizeOverlay=null;this._resizeHandles={};}}else if(window.communicationWindows.testRecorder){window.communicationWindows.testRecorder.close();}if(!this._dockStarted){window.communicationWindows={};this.fnOnClose();}};b.prototype.getCommunicationInfo=function(){return{origin:this._sOrigin,identifier:this._sIdentifier,url:this._sUrl};};b.prototype._generateTestRecorderUrl=function(){var m=new U().search(true);var I=["sap-language"];var e=["sap-ui-testRecorder"];var s=Object.keys(m).map(function(o){if(e.indexOf(o)===-1&&o.startsWith("sap-ui-")||I.indexOf(o)>-1){return"&"+o+"="+m[o];}}).join("");this._sUrl=sap.ui.require.toUrl("sap/ui/testrecorder/ui/overlay.html")+"?sap-ui-testrecorder-origin="+window.location.protocol+"//"+window.location.host+"&"+"sap-ui-testrecorder-frame-identifier="+this._sIdentifier+s;var n=new U(this._sUrl);this._sOrigin=(n.protocol()||window.location.protocol.replace(':',''))+'://'+(n.host()||window.location.host);};b.prototype._createResizeHandle=function(o){var e=document.createElement("DIV");e.id=o.id;e.style.position="absolute";e.style.width=o.width;e.style.height=o.height;e.style.left=o.left;e.style.top=o.top;e.style["z-index"]=c.RESIZE_HANDLE_ZINDEX;e.style.cursor=o.cursor;e.style.display="none";e.onmouseover=this._onResizeHandleMouseover(e);e.onmousedown=this._onResizeHandleMousedown(e,o.resize);e.onmouseleave=this._onResizeHandleMouseleave(e);return e;};function d(e){return function(){e.style.background="#0854a0";};}function f(m,R){return function(e){e.preventDefault();r=true;this._resizeOverlay.style.display="block";document.onmouseup=this._onDocumentMouseup;document.onmousemove=this._onDocumentMousemove(m,R);}.bind(this);}function g(e){return function(){if(!r){e.style.background="transparent";}};}function h(){r=false;this._resizeOverlay.style.display="none";document.onmouseup=null;document.onmousemove=null;}function i(m,R){return _(function(e){e.preventDefault();var L=150;R(m,{x:Math.max(Math.min(e.clientX,window.innerWidth-L),L),y:Math.max(Math.min(e.clientY,window.innerHeight-L),L)});},50);}function j(){return''+Date.now();}function k(){var e=window.document.getElementById("sap-ui-bootstrap");if(e&&e.dataset.sapUiLanguage){l(function(m){m.dataset.sapUiLanguage=e.dataset.sapUiLanguage;});}if(e&&e.dataset.sapUiConfig){e.dataset.sapUiConfig.split(",").forEach(function(s){if(s.startsWith("language:")){l(function(m){m.dataset.sapUiConfig=m.dataset.sapUiConfig?m.dataset.sapUiConfig+","+s:s;});}});}if(window["sap-ui-config"].language){window.communicationWindows.testRecorder["sap-ui-config"]=window.communicationWindows.testRecorder["sap-ui-config"]||{};window.communicationWindows.testRecorder["sap-ui-config"].language=window["sap-ui-config"].language;}}function l(D){var e=window.communicationWindows.testRecorder.document.getElementById("sap-ui-bootstrap");if(e){D(e);}else{setTimeout(function(){l(D);},10);}}u=new b();return u;},true);