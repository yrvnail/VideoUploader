/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','./ExportRow','./File','sap/base/Log','./ExportColumn','./ExportType'],function(C,E,F,L){'use strict';function w(f,o){if(f){return function(){return f.apply(o,arguments);};}else{return f;}}function p(m){L.warning("Usage of deprecated jQuery Promise method: '"+m+"'. "+"Please use the standard Promise methods 'then' / 'catch' instead!","","sap.ui.core.util.Export");}function c(P,o){var O=new Promise(P);o=o||O;var r=false,R=false;O.then(function(v){r=true;return v;},function(e){R=true;throw e;});var m={then:O.then,"catch":O["catch"]};function b(d){d.then=function(s,e){var A=[w(s,o),w(e,o)];return b(m.then.apply(d,A),o);};d["catch"]=function(f){var A=[w(f,o)];return b(m["catch"].apply(d,A),o);};[{jq:"done",es6:"then"},{jq:"fail",es6:"catch"},{jq:"always",es6:"then"}].forEach(function(e){d[e.jq]=function(){p(e.jq);var f=null;Array.prototype.concat.apply([],arguments).forEach(function(g){var W=w(g,o);var h=function(v){W.apply(this,arguments);return v;};var A=[h];if(e.jq==="always"){A.push(h);}if(!f){f=m[e.es6].apply(d,A);}else{f=f[e.es6].apply(f,A);}});return b(f,o);};});d.pipe=function(D,f){p("pipe");return d.then(D,f);};d.state=function(){p("state");if(r){return"resolved";}else if(R){return"rejected";}else{return"pending";}};return d;}return b(O);}var a=C.extend('sap.ui.core.util.Export',{metadata:{publicMethods:["generate","saveFile"],library:"sap.ui.core",aggregations:{exportType:{type:'sap.ui.core.util.ExportType',multiple:false},columns:{type:'sap.ui.core.util.ExportColumn',multiple:true,bindable:'bindable'},rows:{type:'sap.ui.core.util.ExportRow',multiple:true,bindable:'bindable'},_template:{type:'sap.ui.core.util.ExportRow',multiple:false,visibility:'hidden'}}},renderer:null});a.getMetadata().getAggregation("rows")._doesNotRequireFactory=true;a.prototype.init=function(){this._oPromise=null;this._fnResolvePromise=null;this._oRowBindingArgs=null;};a.prototype.exit=function(){delete this._oPromise;delete this._fnResolvePromise;delete this._oRowBindingArgs;};a.prototype._createRowTemplate=function(){var t=new E(this.getId()+"-row"),b=this.getColumns();for(var i=0,l=b.length;i<l;i++){var o=b[i].getTemplate();if(o){t.addCell(o.clone("col"+i));}}return t;};a.prototype.bindAggregation=function(n,b){if(n==='rows'){this._oRowBindingArgs=arguments;return this;}return C.prototype.bindAggregation.apply(this,arguments);};a.prototype.updateRows=function(r){if(r==='change'&&this._fnResolvePromise){var s=this.getExportType()._generate(this);this.destroyAggregation('_template');this.unbindAggregation('rows');this._fnResolvePromise(s);this._oPromise=null;this._fnResolvePromise=null;}};a.prototype.generate=function(){var t=this;if(!this._oPromise){this._oPromise=c(function(r,b){t._fnResolvePromise=r;if(!t.hasModel()){b("Generate is not possible beause no model was set.");}else{var T=t._createRowTemplate();t.setAggregation('_template',T,true);C.prototype.bindAggregation.apply(t,t._oRowBindingArgs);if(t.getBinding("rows")){t.getBinding("rows").getContexts(0,t.getBinding("rows").getLength());}}},this);}return this._oPromise;};a.prototype.saveFile=function(f){return this.generate().then(function(s){var e=this.getExportType();F.save(s,f||"data",e.getFileExtension(),e.getMimeType(),e.getCharset(),e.getByteOrderMark());});};return a;});
