/*
* jQuery Mobile v1.3.1
* http://jquerymobile.com
*
* Copyright 2010, 2013 jQuery Foundation, Inc. and other contributors
* Released under the MIT license.
* http://jquery.org/license
*
*/
(function(r,d,f){if(typeof define==="function"&&define.amd){define(["jquery"],function($){f($,r,d);return $.mobile;});}else{f(r.jQuery,r,d);}}(this,document,function(Q,d,f,u){
// About: License
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
(function($,d,u){var s='hashchange',a=f,b,c=$.event.special,e=a.documentMode,g='on'+s in d&&(e===u||e>7);function h(i){i=i||location.href;return'#'+i.replace(/^[^#]*#?(.*)$/,'$1');};$.fn[s]=function(i){return i?this.on(s,i):this.trigger(s);};$.fn[s].delay=50;c[s]=$.extend(c[s],{setup:function(){if(g){return false;}$(b.start);},teardown:function(){if(g){return false;}$(b.stop);}});b=(function(){var i={},t,l=h(),j=function(v){return v;},k=j,m=j;i.start=function(){t||p();};i.stop=function(){t&&clearTimeout(t);t=u;};function p(){var n=h(),o=m(l);if(n!==l){k(l=n,o);$(d).trigger(s);}else if(o!==l){location.href=location.href.replace(/#.*/,'')+o;}t=setTimeout(p,$.fn[s].delay);};return i;})();})(Q,this);(function($){$.mobile={};Q.mobile.orientationChangeEnabled=true;}(Q));(function($,d,u){var n={};$.mobile=$.extend($.mobile,{version:"1.3.1",ns:"",subPageUrlKey:"ui-page",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",focusClass:"ui-focus",ajaxEnabled:true,hashListeningEnabled:true,linkBindingEnabled:true,defaultPageTransition:"fade",maxTransitionWidth:false,minScrollBack:250,touchOverflowEnabled:false,defaultDialogTransition:"pop",pageLoadErrorMessage:"Error Loading Page",pageLoadErrorMessageTheme:"e",phonegapNavigationEnabled:false,autoInitializePage:true,pushStateEnabled:true,ignoreContentEnabled:false,orientationChangeEnabled:true,buttonMarkup:{hoverDelay:200},window:$(d),document:$(f),keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91},behaviors:{},silentScroll:function(y){if(typeof y!=="number"){y=$.mobile.defaultHomeScroll;}$.event.special.scrollstart.enabled=false;setTimeout(function(){d.scrollTo(0,y);$.mobile.document.trigger("silentscroll",{x:0,y:y});},20);setTimeout(function(){$.event.special.scrollstart.enabled=true;},150);},nsNormalizeDict:n,nsNormalize:function(p){if(!p){return;}return n[p]||(n[p]=$.camelCase($.mobile.ns+p));},getInheritedTheme:function(a,b){var e=a[0],l="",r=/ui-(bar|body|overlay)-([a-z])\b/,c,m;while(e){c=e.className||"";if(c&&(m=r.exec(c))&&(l=m[2])){break;}e=e.parentNode;}return l||b||"a";},closestPageData:function(a){return a.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("mobile-page");},enhanceable:function(a){return this.haveParents(a,"enhance");},hijackable:function(a){return this.haveParents(a,"ajax");},haveParents:function(a,b){if(!$.mobile.ignoreContentEnabled){return a;}var g=a.length,h=$(),e,k,l;for(var i=0;i<g;i++){k=a.eq(i);l=false;e=a[i];while(e){var c=e.getAttribute?e.getAttribute("data-"+$.mobile.ns+b):"";if(c==="false"){l=true;break;}e=e.parentNode;}if(!l){h=h.add(k);}}return h;},getScreenHeight:function(){return d.innerHeight||$.mobile.window.height();}},$.mobile);$.fn.jqmData=function(p,v){var r;if(typeof p!=="undefined"){if(p){p=$.mobile.nsNormalize(p);}if(arguments.length<2||v===u){r=this.data(p);}else{r=this.data(p,v);}}return r;};$.jqmData=function(e,p,v){var r;if(typeof p!=="undefined"){r=$.data(e,p?$.mobile.nsNormalize(p):p,v);}return r;};$.fn.jqmRemoveData=function(p){return this.removeData($.mobile.nsNormalize(p));};$.jqmRemoveData=function(e,p){return $.removeData(e,$.mobile.nsNormalize(p));};$.fn.removeWithDependents=function(){$.removeWithDependents(this);};$.removeWithDependents=function(e){var a=$(e);(a.jqmData('dependents')||$()).remove();a.remove();};$.fn.addDependents=function(a){$.addDependents($(this),a);};$.addDependents=function(e,a){var b=$(e).jqmData('dependents')||$();$(e).jqmData('dependents',$.merge(b,a));};$.fn.getEncodedText=function(){return $("<div/>").text($(this).text()).html();};$.fn.jqmEnhanceable=function(){return $.mobile.enhanceable(this);};$.fn.jqmHijackable=function(){return $.mobile.hijackable(this);};var o=$.find,j=/:jqmData\(([^)]*)\)/g;$.find=function(s,c,r,e){s=s.replace(j,"[data-"+($.mobile.ns||"")+"$1]");return o.call(this,s,c,r,e);};$.extend($.find,o);})(Q,this);(function($,u){
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
d.matchMedia=d.matchMedia||(function(a,u){var b,c=a.documentElement,r=c.firstElementChild||c.firstChild,e=a.createElement("body"),g=a.createElement("div");g.id="mq-test-1";g.style.cssText="position:absolute;top:-100em";e.style.background="none";e.appendChild(g);return function(q){g.innerHTML="&shy;<style media=\""+q+"\"> #mq-test-1 { width: 42px; }</style>";c.insertBefore(e,r);b=g.offsetWidth===42;c.removeChild(e);return{matches:b,media:q};};}(f));$.mobile.media=function(q){return d.matchMedia(q).matches;};})(Q);(function($,u){var s={touch:"ontouchend"in f};if(d.sap&&sap.ui&&sap.ui.Device&&sap.ui.Device.support&&!(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge)){s.touch=sap.ui.Device.support.touch}$.mobile.support=$.mobile.support||{};$.extend($.support,s);$.extend($.mobile.support,s);}(Q));(function($,u){$.extend($.support,{orientation:"orientation"in d&&"onorientationchange"in d});}(Q));(function($,u){function p(a){var i=a.charAt(0).toUpperCase()+a.substr(1),s=(a+" "+e.join(i+" ")+i).split(" ");for(var v in s){if(c[s[v]]!==u){return true;}}}var b=$("<body>").prependTo("html"),c=b[0].style,e=["Webkit","Moz","O"],g="palmGetResource"in d,o=d.opera,h=d.operamini&&({}).toString.call(d.operamini)==="[object OperaMini]",j=d.blackberry&&!p("-webkit-transform");function k(a,v,s){var t=f.createElement('div'),w=function(B){return B.charAt(0).toUpperCase()+B.substr(1);},x=function(B){if(B===""){return"";}else{return"-"+B.charAt(0).toLowerCase()+B.substr(1)+"-";}},y=function(B){var C=x(B)+a+": "+v+";",D=w(B),E=D+(D===""?a:w(a));t.setAttribute("style",C);if(!!t.style[E]){A=true;}},z=s?s:e,A;for(var i=0;i<z.length;i++){y(z[i]);}return!!A;}function l(){var a="transform-3d",i=$.mobile.media("(-"+e.join("-"+a+"),(-")+"-"+a+"),("+a+")");if(i){return!!i;}var s=f.createElement("div"),v={'MozTransform':'-moz-transform','transform':'transform'};b.append(s);for(var t in v){if(s.style[t]!==u){s.style[t]='translate3d( 100px, 1px, 1px )';i=d.getComputedStyle(s).getPropertyValue(v[t]);}}return(!!i&&i!=="none");}function m(){var a=f.createElement('x'),i=f.documentElement,s=d.getComputedStyle,t=s&&s(a,''),v;if(!('pointerEvents'in a.style)){return false;}a.style.pointerEvents='auto';a.style.pointerEvents='x';i.appendChild(a);v=t&&t.pointerEvents==='auto';i.removeChild(a);return!!v;}function n(){var a=f.createElement("div");return typeof a.getBoundingClientRect!=="undefined";}$.extend($.mobile,{browser:{}});$.mobile.browser.oldIE=(function(){var v=3,i=f.createElement("div"),a=i.all||[];do{i.innerHTML="<!--[if gt IE "+(++v)+"]><br><![endif]-->";}while(a[0]);return v>4?v:!v;})();function q(){var w=d,a=navigator.userAgent,i=navigator.platform,s=a.match(/AppleWebKit\/([0-9]+)/),t=!!s&&s[1],v=a.match(/Fennec\/([0-9]+)/),x=!!v&&v[1],y=a.match(/Opera Mobi\/([0-9]+)/),z=!!y&&y[1];if(((i.indexOf("iPhone")>-1||i.indexOf("iPad")>-1||i.indexOf("iPod")>-1)&&t&&t<534)||(w.operamini&&({}).toString.call(w.operamini)==="[object OperaMini]")||(y&&z<7458)||(a.indexOf("Android")>-1&&t&&t<533)||(x&&x<6)||("palmGetResource"in d&&t&&t<534)||(a.indexOf("MeeGo")>-1&&a.indexOf("NokiaBrowser/8.5.0")>-1)){return false;}return true;}$.extend($.support,{cssTransitions:"WebKitTransitionEvent"in d||k('transition','height 100ms linear',["Webkit","Moz",""])&&!$.mobile.browser.oldIE&&!o,pushState:"pushState"in history&&"replaceState"in history&&!(d.navigator.userAgent.indexOf("Firefox")>=0&&d.top!==d)&&(d.navigator.userAgent.search(/CriOS/)===-1),mediaquery:$.mobile.media("only all"),cssPseudoElement:!!p("content"),touchOverflow:!!p("overflowScrolling"),cssTransform3d:l(),boxShadow:!!p("boxShadow")&&!j,fixedPosition:q(),scrollTop:("pageXOffset"in d||"scrollTop"in f.documentElement||"scrollTop"in b[0])&&!g&&!h,dynamicBaseTag:true,cssPointerEvents:m(),boundingRect:n()});b.remove();var r=(function(){var a=d.navigator.userAgent;return a.indexOf("Nokia")>-1&&(a.indexOf("Symbian/3")>-1||a.indexOf("Series60/5")>-1)&&a.indexOf("AppleWebKit")>-1&&a.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/);})();$.mobile.gradeA=function(){return($.support.mediaquery||$.mobile.browser.oldIE&&$.mobile.browser.oldIE>=7)&&($.support.boundingRect||$.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/)!==null);};$.mobile.ajaxBlacklist=d.blackberry&&!d.WebKitPoint||h||r;if(r){$(function(){$("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet");});}if(!$.support.boxShadow){$("html").addClass("ui-mobile-nosupport-boxshadow");}})(Q);(function($,u){var a=$.mobile.window,s,h;$.event.special.navigate=s={bound:false,pushStateEnabled:true,originalEventName:u,isPushStateEnabled:function(){return $.support.pushState&&$.mobile.pushStateEnabled===true&&this.isHashChangeEnabled();},isHashChangeEnabled:function(){return $.mobile.hashListeningEnabled===true;},popstate:function(e){var n=new $.Event("navigate"),b=new $.Event("beforenavigate"),c=e.originalEvent.state||{},g=location.href;a.trigger(b);if(b.isDefaultPrevented()){return;}if(e.historyState){$.extend(c,e.historyState);}n.originalEvent=e;setTimeout(function(){a.trigger(n,{state:c});},0);},hashchange:function(e,b){var n=new $.Event("navigate"),c=new $.Event("beforenavigate");a.trigger(c);if(c.isDefaultPrevented()){return;}n.originalEvent=e;a.trigger(n,{state:e.hashchangeState||{}});},setup:function(b,n){if(s.bound){return;}s.bound=true;if(s.isPushStateEnabled()){s.originalEventName="popstate";a.on("popstate.navigate",s.popstate);}else if(s.isHashChangeEnabled()){s.originalEventName="hashchange";a.on("hashchange.navigate",s.hashchange);}}};})(Q);(function($){$.event.special.throttledresize={setup:function(){$(this).on("resize",h);},teardown:function(){$(this).off("resize",h);}};var t=250,h=function(){c=(new Date()).getTime();b=c-l;if(b>=t){l=c;$(this).trigger("throttledresize");}else{if(a){clearTimeout(a);}a=setTimeout(h,t-b);}},l=0,a,c,b;})(Q);(function($,d){var w=$(d),e="orientationchange",s,g,l,i,a,p={"0":true,"180":true};if($.support.orientation){var b=d.innerWidth||w.width(),c=d.innerHeight||w.height(),h=50;i=b>c&&(b-c)>h;a=p[d.orientation];if((i&&a)||(!i&&!a)){p={"-90":true,"90":true};}}$.event.special.orientationchange=$.extend({},$.event.special.orientationchange,{setup:function(){if($.support.orientation&&!$.event.special.orientationchange.disabled){return false;}l=g();w.on("throttledresize",j);},teardown:function(){if($.support.orientation&&!$.event.special.orientationchange.disabled){return false;}w.off("throttledresize",j);},add:function(k){var o=k.handler;k.handler=function(m){m.orientation=g();return o.apply(this,arguments);};}});function j(){var o=g();if(o!==l){l=o;w.trigger(e);}}$.event.special.orientationchange.orientation=g=function(){var k=true,m=f.documentElement;if($.support.orientation){k=p[d.orientation];}else{k=m&&m.clientWidth/m.clientHeight<1.1;}return k?"portrait":"landscape";};$.fn[e]=function(k){return k?this.on(e,k):this.trigger(e);};if($.attrFn){$.attrFn[e]=true;}}(Q,this));(function($,d,f,u){var a="virtualMouseBindings",c="virtualTouchID",v="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),g="clientX clientY pageX pageY screenX screenY".split(" "),m=$.event.mouseHooks?$.event.mouseHooks.props:[],h=("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase "+"metaKey relatedTarget shiftKey target timeStamp view which").split(" "),l=h.concat(m),n={},r=0,s=0,p=0,q=false,w=[],z=false,A=false,B="addEventListener"in f,C=$(f),D=1,E=0,F;$.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};function G(e){while(e&&typeof e.originalEvent!=="undefined"){e=e.originalEvent;}return e;}function H(e,b){var t=e.type,o,k,x,y,ct,b1,i,j,c1;e=$.Event(e);e.type=b;o=e.originalEvent;k=h;if(t.search(/^(mouse|click)/)>-1){k=l;}if(o){for(i=k.length,y;i;){y=k[--i];e[y]=o[y];}}if(t.search(/mouse(down|up)|click/)>-1&&!e.which){e.which=1;}if(t.search(/^touch/)!==-1){x=G(o);t=x.touches;ct=x.changedTouches;b1=(t&&t.length)?t[0]:((ct&&ct.length)?ct[0]:u);if(b1){for(j=0,c1=g.length;j<c1;j++){y=g[j];e[y]=b1[y];}}}return e;}function I(e){var j={},b,k;while(e){b=$.data(e,a);for(k in b){if(b[k]){j[k]=j.hasVirtualBinding=true;}}e=e.parentNode;}return j;}function J(e,j){var b;while(e){b=$.data(e,a);if(b&&(!j||b[j])){return e;}e=e.parentNode;}return null;}function K(){A=false;}function L(){A=true;}function M(){E=0;w.length=0;z=false;L();}function N(){K();}function O(){P();r=setTimeout(function(){r=0;M();},$.vmouse.resetTimerDuration);}function P(){if(r){clearTimeout(r);r=0;}}function R(e,b,j){var k;if((j&&j[e])||(!j&&J(b.target,e))){k=H(b,e);$(b.target).trigger(k);}return k;}function S(e){var t=$.data(e.target,c);if(!z&&(!E||E!==t)){var b=R("v"+e.type,e);if(b){if(b.isDefaultPrevented()){e.preventDefault();}if(b.isPropagationStopped()){e.stopPropagation();}if(b.isImmediatePropagationStopped()){e.stopImmediatePropagation();}}}}function T(e){var b=G(e).touches,j,k;if(b&&b.length===1){j=e.target;k=I(j);if(k.hasVirtualBinding){E=D++;$.data(j,c,E);P();N();q=false;var t=G(e).touches[0];s=t.pageX;p=t.pageY;R("vmouseover",e,k);R("vmousedown",e,k);}}}function U(e){if(A){return;}if(!q){R("vmousecancel",e,I(e.target));}q=true;O();}function V(e){if(A){return;}var t=G(e).touches[0],b=q,j=$.vmouse.moveDistanceThreshold,k=I(e.target);q=q||(Math.abs(t.pageX-s)>j||Math.abs(t.pageY-p)>j);if(q&&!b){R("vmousecancel",e,k);}R("vmousemove",e,k);O();}function W(e){if(A){return;}L();var b=I(e.target),t;R("vmouseup",e,b);if(!q){R("vclick",e,b);if($.support.touch){t=G(e).changedTouches[0];w.push({touchID:E,x:t.clientX,y:t.clientY+d.scrollY,target:e.target});z=true;}}R("vmouseout",e,b);q=false;O();}function X(e){var b=$.data(e,a),k;if(b){for(k in b){if(b[k]){return true;}}}return false;}function Y(){}function Z(e){var b=e.substr(1);return{setup:function(j,k){if(!X(this)){$.data(this,a,{});}var o=$.data(this,a);o[e]=true;n[e]=(n[e]||0)+1;if(n[e]===1){C.on(b,S);}$(this).on(b,Y);if(B){n["touchstart"]=(n["touchstart"]||0)+1;if(n["touchstart"]===1){C.on("touchstart",T).on("touchend",W).on("touchmove",V);}}},teardown:function(j,k){--n[e];if(!n[e]){C.off(b,S);}if(B){--n["touchstart"];if(!n["touchstart"]){C.off("touchstart",T).off("touchmove",V).off("touchend",W).off("scroll",U);}}var o=$(this),t=$.data(this,a);if(t){t[e]=false;}o.off(b,Y);if(!X(this)){o.removeData(a);}}};}for(var i=0;i<v.length;i++){$.event.special[v[i]]=Z(v[i]);}if(B){function _(e){var b=w.length,t=e.target,x,y,j,i,o,k;if(b){x=e.clientX;y=e.clientY+d.scrollY;F=$.vmouse.clickDistanceThreshold;j=t;while(j){for(i=0;i<b;i++){o=w[i];k=0;if((j===t&&Math.abs(o.x-x)<F&&Math.abs(o.y-y)<F)||$.data(j,c)===o.touchID){if(!e.isSynthetic){e._sapui_delayedMouseEvent=true;}if(t!==o.target){e.preventDefault();e.stopPropagation();}if(e.type==="click"){w.length=0;}return;}}j=j.parentNode;}}};if(!(sap.ui.Device.os.windows_phone&&sap.ui.Device.os.version<10)){f.addEventListener("mousedown",_,true);f.addEventListener("mouseup",_,true);f.addEventListener("click",_,true);}}})(Q,d,f);(function($,d,u){var a=$(f);$.each(("touchstart touchmove touchend "+"tap taphold "+"swipe swipeleft swiperight "+"scrollstart scrollstop").split(" "),function(i,n){$.fn[n]=function(h){return h?this.on(n,h):this.trigger(n);};if($.attrFn){$.attrFn[n]=true;}});var s=$.mobile.support.touch,b="touchmove scroll",t=s?"touchstart":"mousedown",c=s?"touchend touchcancel":"mouseup",e=s?"touchmove":"mousemove";function g(o,h,i){var j=i.type;i.type=h;$.event.dispatch.call(o,i);i.type=j;}$.event.special.scrollstart={enabled:true,setup:function(){var h=this,i=$(h),j,k;function l(m,n){j=n;g(h,j?"scrollstart":"scrollstop",m);}i.on(b,function(m){if(!$.event.special.scrollstart.enabled){return;}if(!j){l(m,true);}clearTimeout(k);k=setTimeout(function(){l(m,false);},50);});}};$.event.special.tap={tapholdThreshold:750,setup:function(){var h=this,i=$(h),m,j,k;function l(r){var v=r.target;var w=sap.ui.Device.browser;return w.edge&&w.version>=14&&(v.tagName.toLowerCase()==="button"&&v.contains(m)||m.tagName.toLowerCase()==="button"&&m.contains(v));}function n(){clearTimeout(k);}function o(){n();i.removeData("__tap_event_in_progress");i.off("vclick",q).off("vmouseup",n);a.off("vmousecancel",o).off("vmouseup",p);}function p(r){if(r.target!==m&&!$.contains(m,r.target)&&!l(r)){o();}}function q(r){o();if(m===r.target||l(r)){g(h,"tap",r);}}i.on("vmousedown",function(r){if(r.which&&r.which!==1){return;}m=r.target;j=r.originalEvent;if(i.data("__tap_event_in_progress")){o();}i.data("__tap_event_in_progress","X");i.on("vmouseup",n).on("vclick",q);a.on("vmousecancel",o).on("vmouseup",p);k=setTimeout(function(){var T=$.event.fix(j);T.type="taphold";g(h,"taphold",T);},$.event.special.tap.tapholdThreshold);});}};$.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1000,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,start:function(h){var i=h.originalEvent&&h.originalEvent.touches?h.originalEvent.touches[0]:h;return{time:(new Date()).getTime(),coords:[i.pageX,i.pageY],origin:$(h.target)};},stop:function(h){var i=h.originalEvent&&h.originalEvent.touches?h.originalEvent.touches[0]:h;return{time:(new Date()).getTime(),coords:[i.pageX,i.pageY]};},handleSwipe:function(h,i){if(i.time-h.time<$.event.special.swipe.durationThreshold&&Math.abs(h.coords[0]-i.coords[0])>$.event.special.swipe.horizontalDistanceThreshold&&Math.abs(h.coords[1]-i.coords[1])<$.event.special.swipe.verticalDistanceThreshold){h.origin.trigger("swipe").trigger(h.coords[0]>i.coords[0]?"swipeleft":"swiperight");}},setup:function(){var h=this,i=$(h);i.on(t,function(j){if(j.isMarked("swipestartHandled")){return;}j.setMarked("swipestartHandled");var k=$.event.special.swipe.start(j),l;function m(j){if(!k){return;}l=$.event.special.swipe.stop(j);if(j.cancelable&&(!sap.ui.Device.system.desktop||sap.ui.Device.browser.name!=="cr")){if(!sap.ui.Device.os.blackberry&&Math.abs(k.coords[0]-l.coords[0])>$.event.special.swipe.scrollSupressionThreshold){j.preventDefault();}}}function n(j){i.off(e,m).off(c,n);if(k&&l){$.event.special.swipe.handleSwipe(k,l);}k=l=u;}i.on(e,m).on(c,n);});}};$.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(h,i){$.event.special[h]={setup:function(){$(this).on(i,$.noop);}};});})(Q,this);}));
