/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/odata/ODataMetadata","sap/ui/model/odata/ODataUtils","sap/ui/core/library","sap/ui/thirdparty/URI","sap/ui/core/message/MessageParser","sap/ui/core/message/Message","sap/base/Log"],function(O,a,c,U,M,b,L){"use strict";var C="sap.ui.model.odata.ODataMessageParser",r=/^\/+|\/$/g,d=c.MessageType,s={"error":d.Error,"info":d.Information,"success":d.Success,"warning":d.Warning};var e=M.extend("sap.ui.model.odata.ODataMessageParser",{metadata:{publicMethods:["parse","setProcessor","getHeaderField","setHeaderField"]},constructor:function(S,m,p){M.apply(this);this._serviceUrl=f(this._parseUrl(S).url);this._metadata=m;this._headerField="sap-message";this._lastMessages=[];this._bPersistTechnicalMessages=p;}});e.prototype.getHeaderField=function(){return this._headerField;};e.prototype.setHeaderField=function(F){this._headerField=F;return this;};e.prototype.parse=function(R,o,G,m,i){var k,n,S=String(R.statusCode);if(o.method==="GET"&&(S==="204"||S==="424")){return;}k=[];n={request:o,response:R,url:o?o.requestUri:R.requestUri};if(R.statusCode>=200&&R.statusCode<300){this._parseHeader(k,R,n);}else if(R.statusCode>=400&&R.statusCode<600){this._parseBody(k,R,n);}else{this._addGenericError(k,n);}this._propagateMessages(k,n,G,m,!i);};e.prototype._getAffectedTargets=function(m,R,G,i){var A=Object.assign({"":true},G,i),E,k=this._parseUrl(R.url).url;if(R.request&&R.request.key&&R.request.created){A[R.request.key]=true;}if(k.startsWith(this._serviceUrl)){k=k.slice(this._serviceUrl.length+1);}E=this._metadata._getEntitySetByPath(k);if(E){A[E.name]=true;}m.forEach(function(o){o.getTargets().forEach(function(t){var p,S,T;if(!t){return;}T=t.replace(r,"");A[T]=true;S=T.lastIndexOf("/");if(S>0){p=T.slice(0,S);A[p]=true;}});});return A;};e.prototype._propagateMessages=function(m,R,G,i,S){var A,D=R.request.deepPath,k=[],n,p=D&&R.request.updateAggregatedMessages,t=R.request.headers&&R.request.headers["sap-messages"]==="transientOnly",o=[],q=O._returnsCollection(R.request.functionMetadata),u,v,w;function x(y,T){return T.some(function(z){return A[z];})||p&&y.aFullTargets.some(function(F){if(q){return n.some(function(K){var z=K.slice(K.indexOf("("));return F.startsWith(D+z);});}else{return F.startsWith(D);}});}G=G||{};if(t){k=this._lastMessages;u=m.some(function(y){return!y.getPersistent()&&!y.getTechnical();});if(u){L.error("Unexpected non-persistent message in response, but requested only "+"transition messages",undefined,C);}}else{A=this._getAffectedTargets(m,R,G,i);n=Object.keys(G);v=R.response.statusCode;w=(v>=200&&v<300);this._lastMessages.forEach(function(y){var T=y.getTargets().map(function(z){z=z.replace(r,"");var P=z.lastIndexOf(")/");if(P>0){z=z.substr(0,P+1);}return z;});if(w||S){if(!y.getPersistent()&&x(y,T)){o.push(y);}else{k.push(y);}}else if(!y.getPersistent()&&y.getTechnical()&&x(y,T)){o.push(y);}else{k.push(y);}});}this.getProcessor().fireMessageChange({oldMessages:o,newMessages:m});this._lastMessages=k.concat(m);};e.prototype._createMessage=function(m,R,i){var p=m.target&&m.target.indexOf("/#TRANSIENT#")===0||m.transient||m.transition||i&&this._bPersistTechnicalMessages,t,T=typeof m.message==="object"?m.message.value:m.message,k=m["@sap.severity"]||m.severity;m.transition=!!p;t=this._createTargets(m,R,i);return new b({code:m.code||"",description:m.description,descriptionUrl:m.longtext_url||"",fullTarget:t.aDeepPaths,message:T,persistent:!!p,processor:this._processor,target:t.aTargets,technical:i,technicalDetails:{headers:R.response.headers,statusCode:R.response.statusCode},type:s[k]||k});};e._isResponseForCreate=function(R){var o=R.request,i=R.response;if(o.method==="POST"&&i.statusCode==201&&i.headers["location"]){return true;}if(o.key&&o.created&&i.statusCode>=400){return false;}};e.prototype._createTarget=function(o,R,i,k){var m,n,D,p,P,q,u,t,v,w=R.request,x=R.response;if(o===undefined&&(!i&&w.headers["sap-message-scope"]==="BusinessObject"||i&&k)){return{deepPath:"",target:""};}o=o||"";o=o.startsWith("/#TRANSIENT#")?o.slice(12):o;if(o[0]!=="/"){n=e._isResponseForCreate(R);D=w.deepPath||"";if(n===true){v=x.headers["location"];}else if(n===false){v=w.key;}else{v=R.url;}t=this._parseUrl(v);u=t.url;p=u.indexOf(this._serviceUrl);if(p>-1){q=u.slice(p+this._serviceUrl.length);}else{q="/"+u;}if(!n&&w.functionMetadata){q=w.functionTarget;}if(q.slice(q.lastIndexOf("/")).indexOf("(")>-1||!this._metadata._isCollection(q)){D=o?D+"/"+o:D;o=o?q+"/"+o:q;}else{D=D+o;o=q+o;}}m=this._processor.resolve(o,undefined,true);while(m&&m.lastIndexOf("/")>0&&m!==P){P=m;m=this._processor.resolve(m,undefined,true)||P;}o=m||o;return{deepPath:this._metadata._getReducedPath(D||o),target:a._normalizeKey(o)};};e.prototype._createTargets=function(m,R,i){var D=[],k=Array.isArray(m.additionalTargets)?[m.target].concat(m.additionalTargets):[m.target],t,T=[],n=this;if(m.propertyref!==undefined&&k[0]!==undefined){L.warning("Used the message's 'target' property for target calculation; the property"+" 'propertyref' is deprecated and must not be used together with 'target'",R.url,C);}else if(k[0]===undefined){k[0]=m.propertyref;}k.forEach(function(A){t=n._createTarget(A,R,i,m.transition);D.push(t.deepPath);T.push(t.target);});return{aDeepPaths:D,aTargets:T};};e.prototype._parseHeader=function(m,R,k){var F=this.getHeaderField();if(!R.headers){return;}for(var K in R.headers){if(K.toLowerCase()===F.toLowerCase()){F=K;}}if(!R.headers[F]){return;}var n=R.headers[F];var S=null;try{S=JSON.parse(n);m.push(this._createMessage(S,k));if(Array.isArray(S.details)){for(var i=0;i<S.details.length;++i){m.push(this._createMessage(S.details[i],k));}}}catch(o){L.error("The message string returned by the back-end could not be parsed: '"+o.message+"'");return;}};e.prototype._parseBody=function(m,R,i){var k=g(R);if(k&&k.indexOf("xml")>-1){this._parseBodyXML(m,R,i,k);}else{this._parseBodyJSON(m,R,i);}j(m);};e.prototype._addGenericError=function(m,R){m.push(this._createMessage({description:R.response.body,message:sap.ui.getCore().getLibraryResourceBundle().getText("CommunicationError"),severity:d.Error,transition:true},R,true));};e.prototype._parseBodyXML=function(k,R,o,p){try{var D=new DOMParser().parseFromString(R.body,p);var E=h(D,["error","errordetail"]);if(!E.length){this._addGenericError(k,o);return;}for(var i=0;i<E.length;++i){var N=E[i];var q={};q["severity"]=d.Error;for(var n=0;n<N.childNodes.length;++n){var t=N.childNodes[n];var u=t.nodeName;if(u==="errordetails"||u==="details"||u==="innererror"||u==="#text"){continue;}if(u==="message"&&t.hasChildNodes()&&t.firstChild.nodeType!==window.Node.TEXT_NODE){for(var m=0;m<t.childNodes.length;++m){if(t.childNodes[m].nodeName==="value"){q["message"]=t.childNodes[m].text||t.childNodes[m].textContent;}}}else{q[t.nodeName]=t.text||t.textContent;}}k.push(this._createMessage(q,o,true));}}catch(v){this._addGenericError(k,o);L.error("Error message returned by server could not be parsed");}};e.prototype._parseBodyJSON=function(m,R,k){try{var E=JSON.parse(R.body);var o;if(E["error"]){o=E["error"];}else{o=E["odata.error"];}if(!o){this._addGenericError(m,k);L.error("Error message returned by server did not contain error-field");return;}o["severity"]=d.Error;m.push(this._createMessage(o,k,true));var F=null;if(Array.isArray(o.details)){F=o.details;}else if(o.innererror&&Array.isArray(o.innererror.errordetails)){F=o.innererror.errordetails;}else{F=[];}for(var i=0;i<F.length;++i){m.push(this._createMessage(F[i],k,true));}}catch(n){this._addGenericError(m,k);L.error("Error message returned by server could not be parsed");}};e.prototype._parseUrl=function(u){var m={url:u,parameters:{},hash:""};var p=-1;p=u.indexOf("#");if(p>-1){m.hash=m.url.substr(p+1);m.url=m.url.substr(0,p);}p=u.indexOf("?");if(p>-1){var P=m.url.substr(p+1);m.parameters=U.parseQuery(P);m.url=m.url.substr(0,p);}return m;};e.prototype._setPersistTechnicalMessages=function(p){this._bPersistTechnicalMessages=p;};function g(R){if(R&&R.headers){for(var H in R.headers){if(H.toLowerCase()==="content-type"){return R.headers[H].replace(/([^;]*);.*/,"$1");}}}return false;}var l=document.createElement("a");function f(u){l.href=u;return U.parse(l.href).path;}function h(D,E){var k=[];var m={};for(var i=0;i<E.length;++i){m[E[i]]=true;}var o=D;while(o){if(m[o.tagName]){k.push(o);}if(o.hasChildNodes()){o=o.firstChild;}else{while(!o.nextSibling){o=o.parentNode;if(!o||o===D){o=null;break;}}if(o){o=o.nextSibling;}}}return k;}function j(m){if(m.length>1){for(var i=1;i<m.length;i++){if(m[0].getCode()==m[i].getCode()&&m[0].getMessage()==m[i].getMessage()){m.shift();break;}}}}return e;});
