/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","sap/ui/thirdparty/URI","sap/base/Log","sap/ui/documentation/sdk/controller/util/ResourceDownloadUtil"],function(B,U,L,R){"use strict";var T=sap.ui.require.toUrl("sap/ui/documentation/sdk/tmpl"),M=sap.ui.require.toUrl("sap/ui/demo/mock");var O=["sap.ui.core","sap.ui.dt","sap.m","sap.ui.fl","sap.ui.layout","sap.ui.mdc","sap.ui.unified","sap.f","sap.ui.rta","sap.ui.commons","sap.ui.codeeditor","sap.ui.table","sap.uxap","sap.ui.integration","sap.tnt","sap.ui.ux3","sap.ui.suite"];var S=["sap.ushell","sap.fe","sap.viz","sap.suite.ui.microchart","sap.chart","sap.ui.comp","sap.ui.generic.app","sap.fe.navigation","sap.suite.ui.generic.template","sap.ui.richtexteditor","sap.suite.ui.commons","sap.ui.export","sap.ndc","sap.me","sap.fe.core","sap.fe.macros","sap.collaboration","sap.fe.templates","sap.ui.generic.template","sap.zen.dsh","sap.ovp","sap.zen.crosstab","sap.zen.commons","sap.gantt","sap.ui.mdc","sap.fe.plugins","sap.ui.vbm","sap.apf","sap.rules.ui","sap.ui.vk","sap.ui.vtm","sap.ushell_abap","sap.fe.placeholder","sap.feedback.ui","sap.fileviewer","sap.ca.ui","sap.landvisz"];return B.extend("sap.ui.documentation.sdk.controller.SampleBaseController",{_aMockFiles:["products.json","supplier.json","img.json"],fetchSourceFile:function(u,t){return R.fetch(u,t).catch(function(e){L.warning(e);return"File not loaded";});},onDownload:function(){sap.ui.require(["sap/ui/thirdparty/jszip","sap/ui/core/util/File"],function(J,F){var z=new J(),r=sap.ui.require.toUrl((this._sId).replace(/\./g,"/")),d=this.oModel.getData(),e=d.includeInDownload||[],m,h,p=[],a=function(s){var b=[];for(var j=0;j<this._aMockFiles.length;j++){var g=this._aMockFiles[j];if((typeof s==="string")&&s.indexOf(g)>-1){b.push(this._addFileToZip({name:"mockdata/"+g,url:M+"/"+g,formatter:this._formatMockFile},z));}}return Promise.all(b);};for(var i=0;i<d.files.length;i++){var f=d.files[i],u=r+"/"+f.name,c=f.name&&(f.name===d.iframe||f.name.split(".").pop()==="html");if(f.name==="manifest.json"){m=f;p.push(this._addFileToZip({name:f.name,url:u,formatter:this._formatManifestJsFile},z));continue;}p.push(this._addFileToZip({name:f.name.replace(new RegExp(/(\.\.\/)+/g),"./"),url:u,formatter:c?this._changeIframeBootstrapToCloud:undefined},z));p.push(this.fetchSourceFile(u).then(a.bind(this)));}if(!d.iframe){h=d.files.some(function(f){return f.name==="manifest.json";});p.push(this._addFileToZip({name:"Component.js",url:r+"/"+"Component.js"},z));p.push(this._addFileToZip({name:"index.html",url:T+"/"+(h?"indexevo.html.tmpl":"index.html.tmpl"),formatter:function(I){return this._changeIframeBootstrapToCloud(this._formatIndexHtmlFile(I,d));}.bind(this)},z,true));if(!h){p.push(this._addFileToZip({name:"index.js",url:T+"/"+"index.js.tmpl",formatter:function(I){return this._changeIframeBootstrapToCloud(this._formatIndexJsFile(I,d));}.bind(this)},z,true));}}e.forEach(function(s){p.push(this._addFileToZip({name:s,url:r+"/"+s},z));});
// add generic license file
p.push(this._addFileToZip({name:"LICENSE.txt",url:"LICENSE.txt"},z));p.push(this._addFileToZip({name:"ui5.yaml",url:T+"/ui5.yaml.tmpl",formatter:function(y){return this._formatYamlFile(y,d);}.bind(this)},z,true));p.push(this._addFileToZip({name:"package.json",url:T+"/package.json.tmpl",formatter:function(P){return this._formatPackageJson(P,m,d);}.bind(this)},z,true));Promise.all(p).then(function(){var C=z.generate({type:"blob"});this._openGeneratedFile(C,this._sId);}.bind(this));}.bind(this));},_openGeneratedFile:function(c,i){sap.ui.require(["sap/ui/core/util/File"],function(F){F.save(c,i,"zip","application/zip");});},_addFileToZip:function(f,z,t){var F=f.name,u=f.url,a=f.formatter;return this.fetchSourceFile(u,t).then(function(r){if(r==="File not loaded"){return;
// ignore 404 responses, e.g. for Apache license text file in SAPUI5 environment
}if(a){r=a(r);}z.file(F,r);});},_formatPackageJson:function(p,m,d){var f=p.replace(/{{TITLE}}/g,d.title).replace(/{{SAMPLE_ID}}/g,d.id),P=JSON.parse(f),o=P.dependencies,a,u,D;if(m){a=JSON.parse(m.raw);u=a["sap.ui5"];D=u&&u.dependencies;if(D&&D.libs){Object.keys(D.libs).forEach(function(k){if(O.indexOf(k)>-1){o["@openui5/"+k]="^1";}if(S.indexOf(k)>-1){o["@sapui5/"+k]="^1";}});}}return JSON.stringify(P,null,2);},_formatYamlFile:function(f,d){return f.replace(/{{SAMPLE_ID}}/g,d.id);},_formatManifestJsFile:function(r){return r.replace(new RegExp(/(\.\.\/)+/g),"./");},_formatIndexHtmlFile:function(f,d){return f.replace(/{{TITLE}}/g,d.name).replace(/{{SAMPLE_ID}}/g,d.id);},_formatIndexJsFile:function(f,d){return f.replace(/{{TITLE}}/g,d.name).replace(/{{SAMPLE_ID}}/g,d.id).replace(/{{HEIGHT}}/g,d.stretch?'height : "100%", ':"").replace(/{{SCROLLING}}/g,!d.stretch);},_formatMockFile:function(m){var w="test-resources/sap/ui/documentation/sdk/images/",c="https://openui5.hana.ondemand.com/test-resources/sap/ui/documentation/sdk/images/",r=new RegExp(w,"g");return m.replace(r,c);},_changeIframeBootstrapToCloud:function(r){var a=/src=(?:"[^"]*\/sap-ui-core\.js"|'[^']*\/sap-ui-core\.js')/,o=new U(sap.ui.require.toUrl("")+"/sap-ui-core.js"),b=o.toString();return r.replace(a,'src="./'+b+'"');}});});
