/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/thirdparty/handlebars','sap/ui/support/supportRules/report/Archiver','sap/ui/support/supportRules/report/IssueRenderer'],function(q,H,A,I){'use strict';var r=q.sap.getResourcePath('sap/ui/support/supportRules/report/resources');var b=[{url:r+'/ReportTemplate.html',type:'template'},{url:r+'/styles.css',type:'css'},{url:r+'/filter.css',type:'css'},{url:r+'/collapseExpand.css',type:'css'},{url:r+'/filter.js',type:'js'},{url:r+'/collapseExpand.js',type:'js'}];var t={line:function(a,i,u,v,w){a.push("<tr><td ",i?"align='right' ":"","valign='top'>","<label class='sapUiSupportLabel'>",q.sap.escapeHTML(v||""),"</label></td><td",u?" class='sapUiSupportTechInfoBorder'":"",">");var x=w;if(typeof w==="function"){x=w(a);}a.push(q.sap.escapeHTML(x||""));a.push("</td></tr>");},multiline:function(a,u,w,x,y){var z=this;z.line(a,u,w,x,function(a){a.push("<table border='0' cellspacing='0' cellpadding='3'>");q.each(y,function(i,v){var B="";if(v){if(typeof(v)==="string"||typeof(v)==="string"||typeof(v)==="boolean"){B=v;}else if(Array.isArray(v)||q.isPlainObject(v)){B=JSON.stringify(v);}}z.line(a,false,false,i,""+B);});a.push("</table>");});},subheader:function(a,i){a.push("<tr class='sapUiSupportTitle'><td valign='top' colspan='2'>","<label class='sapUiSupportLabel'>",q.sap.escapeHTML(i||""),"</label></td></tr>");}};function g(a){return q.ajax({type:'GET',url:a.url,dataType:'text'}).then(function(i){return{content:i,type:a.type};});}function c(){var a=[];for(var i=0;i<b.length;i++){a.push(g(b[i]));}return q.when.apply(q,a);}function d(a){var u='';if(!a){return new H.SafeString(u);}try{a.modules.sort();var w=["<div class='sapUiSupportToolbar'>","<div><div class='sapUiSupportTechInfoCntnt'>","<table border='0' cellpadding='3'>"];t.subheader(w,"Support Assistant Information");t.line(w,true,true,"Location",a.supportAssistant.location);t.line(w,true,true,"Version",a.supportAssistant.versionAsString);t.subheader(w,"Application Information");t.line(w,true,true,"SAPUI5 Version",function(i){var v=a.sapUi5Version;if(v&&v.version){var V=v.version;var y=q.sap.escapeHTML(V.version||"");i.push(y," (built at ",q.sap.escapeHTML(V.buildTimestamp||""),", last change ",q.sap.escapeHTML(V.scmRevision||""),")");}else{i.push("not available");}});t.line(w,true,true,"Core Version",function(i){return a.version+" (built at "+a.build+", last change "+a.change+")";});t.line(w,true,true,"Loaded jQuery Version",function(i){return a.jquery;});t.line(w,true,true,"User Agent",function(i){return a.useragent+(a.docmode?", Document Mode '"+a.docmode+"'":"");});t.line(w,true,true,"Application",a.appurl);t.multiline(w,true,true,"Configuration (bootstrap)",a.bootconfig);t.multiline(w,true,true,"Configuration (computed)",a.config);if(!q.isEmptyObject(a.libraries)){t.multiline(w,true,true,"Libraries",a.libraries);}t.multiline(w,true,true,"Loaded Libraries",a.loadedLibraries);t.line(w,true,true,"Loaded Modules",function(y){q.each(a.modules,function(i,v){if(v.indexOf("sap.ui.core.support")<0){y.push("<span>",q.sap.escapeHTML(v||""),"</span>");if(i<a.modules.length-1){y.push(", ");}}});});t.multiline(w,true,true,"URI Parameters",a.uriparams);w.push("</table></div>");u=w.join('');}catch(x){q.sap.log.warning('There was a problem extracting technical info.');}return new H.SafeString(u);}function e(v){var a='<td>';if(v){a+=q.sap.escapeHTML(v);}a+='</td>';return a;}function f(a){var u='';if(!a){return new H.SafeString(u);}u+='<table class="sapUiTable"><tr><th>Component ID</th><th>Type</th><th>Title</th><th>Subtitle</th><th>Application version</th><th>Description</th><th>BCP Component</th></tr>';try{for(var i=0;i<a.length;i++){var v=a[i];u+='<tr>';u+=e(v.id);u+=e(v.type);u+=e(v.title);u+=e(v.subTitle);if(v.applicationVersion){u+=e(v.applicationVersion.version);}else{u+='<td></td>';}u+=e(v.description);u+=e(v.ach);u+='</tr>';}u+='</table>';}catch(w){q.sap.log.warning('There was a problem extracting app info.');u='';}return new H.SafeString(u);}function h(a){var i='';i+='<div><span class="sapUiSupportLabel">'+a.displayName+'</span>';i+='<span> ('+a.description+')</span></div>';return i;}function j(a,i){var u='';u+='<div><span class="sapUiSupportLabel">'+i.displayName+' with id:</span> '+a;u+='<span> ('+i.description+')</span></div>';return u;}function k(a,u){var v='';if(a.length>5){v+='<div class="expandable-control collapsed-content" data-expandableElement="execution-scope-components">';v+='<span class="expandable-title"><span class="sapUiSupportLabel">'+u.displayName+'</span>';v+='<span> ('+u.description+')</span></span></div>';}else{v+='<div><span class="sapUiSupportLabel">'+u.displayName+'</span>';v+='<span> ('+u.description+')</span></div>';}v+='<ol id="execution-scope-components" class="top-margin-xsmall">';for(var i=0;i<a.length;i++){v+='<li>'+a[i]+'</li>';}v+='</ol>';return v;}function l(a){var i='';try{var u=a.executionScope.getType();var v=a.scopeDisplaySettings.executionScopes[u];var w=a.scopeDisplaySettings.executionScopeTitle;i+='<div class="sapUiSupportLabel">'+w+': </div>';switch(u){case'global':i+=h(v);break;case'subtree':i+=j(a.executionScope._getContext().parentId,v);break;case'components':i+=k(a.executionScope._getContext().components,v);break;}}catch(x){q.sap.log.warning('There was a problem extracting scope info.');i='';}return new H.SafeString(i);}function m(a){var i='';if(!a){return new H.SafeString(i);}try{var u=1;i+='<table class="sapUiTable"><tbody><tr><th>Name</th><th>Description</th><th>Categories</th><th>Audiences</th></tr></tbody>';for(var v in a){var w=a[v];var x='collapsed-content';if(u===1){x='expanded-content';}var y=a[v].selected?' ('+a[v].issueCount+' issues)':'';var z='<span class="'+(a[v].selected?'checked':'unchecked')+'"></span>';i+='<tbody><tr><td colspan="100" ';i+='class="expandable-control '+x+'" data-expandableElement="section-selected-rules-group'+u+'">'+z;i+='<span class="sapUiSupportLabel expandable-title">'+v+y+'</span>';i+='</td></tr></tbody>';var B='';for(var C in w){var D=w[C].selected?' ('+w[C].issueCount+' issues)':'';var E='<span class="'+(w[C].selected?'checked':'unchecked')+'"></span>';B+='<tr>';B+='<td>'+E+w[C].title+D+'</td>';B+='<td>'+w[C].description+'</td>';B+='<td>'+w[C].categories.join(', ')+'</td>';B+='<td>'+w[C].audiences.join(', ')+'</td>';B+='</tr>';}i+='<tbody id="section-selected-rules-group'+u+'">'+B+'</tbody>';u++;}i+='</table>';}catch(F){q.sap.log.warning('There was a problem extracting selected rules info.');i='';}return new H.SafeString(i);}function n(b,a){var u='';if(a!=='script'&&a!=='style'){return u;}for(var i=0;i<b.length;i++){switch(a){case'script':u+='<script>'+b[i]+'</script>\n';break;case'style':u+='<style type="text/css">'+b[i]+'</style>\n';break;}}return new H.SafeString(u);}H.registerHelper('getTechnicalInformation',function(a){return d(a);});H.registerHelper('getRules',function(a){return m(a);});H.registerHelper('getIssues',function(i){return new H.SafeString(I.render(i,true));});H.registerHelper('getAppInfo',function(a){return f(a);});H.registerHelper('getScope',function(a){return l(a);});H.registerHelper('getScripts',function(a){return n(a,'script');});H.registerHelper('getStyles',function(a){return n(a,'style');});function o(D){return c().then(function(){var a=[],u=[],v='',i,w={},x={};for(i=0;i<arguments.length;i++){switch(arguments[i].type){case'template':v=arguments[i].content;break;case'css':a.push(arguments[i].content);break;case'js':u.push(arguments[i].content);break;}}w=H.compile(v);x={technicalInfo:D.technical,issues:D.issues,appInfo:D.application,rules:D.rules,rulePreset:D.rulePreset,metadata:{title:D.name+' Analysis Results',title_TechnicalInfo:'Technical Information',title_Issues:'Issues',title_AppInfo:'Application Information',title_SelectedRules:'Available and (<span class="checked"></span>) Selected Rules',timestamp:new Date(),scope:D.scope,analysisDuration:D.analysisDuration,analysisDurationTitle:D.analysisDurationTitle,styles:a,scripts:u}};return w(x);});}function p(D){this.getReportHtml(D).done(function(a){var i='<!DOCTYPE HTML><html><head><title>Report</title></head><body><div id="sap-report-content">'+a+'</div></body></html>';var u={'issues':D.issues};var v={'appInfos':D.application};var w={'technicalInfo':D.technical};var x=new A();x.add('technicalInfo.json',w,'json');x.add('issues.json',u,'json');x.add('appInfos.json',v,'json');x.add('report.html',i);x.add('abap.json',D.abap,'json');x.download("SupportAssistantReport");x.clear();});}function s(D){var i='';var a=q('<a style="display: none;"></a>');a.on('click',function(){var u=window.open('','_blank');u.opener=null;q(u.document).ready(function(){if(u.document.getElementById('sap-report-content')){u.document.getElementById('sap-report-content').innerHtml=i;}else{u.document.write('<div id="sap-report-content">'+i+'</div>');}u.document.title='Report';});});q('body').append(a);this.getReportHtml(D).then(function(u){i=u;a[0].click();a.remove();});}return{getReportHtml:o,downloadReportZip:p,openReport:s};},true);
