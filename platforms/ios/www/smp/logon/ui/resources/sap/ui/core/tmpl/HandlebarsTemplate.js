/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.tmpl.HandlebarsTemplate");jQuery.sap.require("sap.ui.core.library");jQuery.sap.require("sap.ui.core.tmpl.Template");sap.ui.core.tmpl.Template.extend("sap.ui.core.tmpl.HandlebarsTemplate",{metadata:{library:"sap.ui.core"}});jQuery.sap.require("sap.ui.thirdparty.handlebars");sap.ui.core.tmpl.Template.register("text/x-handlebars-template","sap.ui.core.tmpl.HandlebarsTemplate");sap.ui.core.tmpl.HandlebarsTemplate.RENDER_HELPERS=(function(){var e=Handlebars.helpers["each"],w=Handlebars.helpers["with"],I=Handlebars.helpers["if"],u=Handlebars.helpers["unless"],p=sap.ui.core.tmpl.Template.parsePath;var h={"each":function(c,o){o=o||c;if(!o.hash.path){return e.apply(this,arguments)}else{var r=o.data.renderManager,R=o.data.rootControl,P=o.data.path,a=o.data.parentControl,s=(jQuery.sap.startsWith(o.hash.path,"/")?"":(P||""))+o.hash.path,b=R.bindList(s),H=[],d;if(o.data){d=Handlebars.createFrame(o.data)}jQuery.each(b,function(k,v){if(d){d.renderManager=r;d.rootControl=R;d.path=s+"/"+k+"/";d.parentControl=a}H.push(o.fn({},{data:d}))});if(!a){return new Handlebars.SafeString(H.join(""))}}},"with":function(c,o){o=o||c;if(!o.hash.path){return w.apply(this,arguments)}else{}},"if":function(c,o){o=o||c;if(!o.hash.path){return I.apply(this,arguments)}else{}},"unless":function(c,o){o=o||c;if(!o.hash.path){return u.apply(this,arguments)}else{}},"text":function(c,o){o=o||c;var r=o.data.rootControl,P=o.data.path,s=(jQuery.sap.startsWith(o.hash.path,"/")?"":(P||""))+o.hash.path;if(s){var v=r.bindText(s);return v&&new Handlebars.SafeString(v)}else{throw new Error("The expression \"text\" requires the option \"path\"!")}},"element":function(c,o){o=o||c;var r=o.data.renderManager,R=o.data.rootControl,E=R.createDOMElement(o.hash,o.data.path),P=o.data.parentElement;if(o.fn){var C=o.fn({},{data:{renderManager:r,rootControl:R,parentElement:E}})}if(P){P.addElement(E);return}return new Handlebars.SafeString(r.getHTML(E))},"control":function(c,o){o=o||c;var r=o.data.renderManager,C=o.data.control;if(C){return new Handlebars.SafeString(r.getHTML(C))}var R=o.data.rootControl,P=o.data.path,a=o.data.parentControl,A=o.hash["sap-ui-aggregation"],d=o.data.defaultAggregation;var n=R.createControl(o.hash,o.data.path,!!a);if(o.fn){var b=o.fn({},{data:{rootControl:R,path:P,parentControl:n,defaultAggregation:o.hash["sap-ui-default-aggregation"]||n.getMetadata().getDefaultAggregationName()}})}if(a){var m=a.getMetadata(),s=A||d,f=m.getAllAggregations()[s],M=f&&f.multiple;if(f){if(M){a.addAggregation(s,n)}else{a.setAggregation(s,n)}}else{throw new Error("Aggregation '"+s+"' does not exist for Control '"+m.getName()+"'.")}return}return new Handlebars.SafeString(r.getHTML(n))},"property":function(c,o){o=o||c;var r=o.data.rootControl,m=r.getMetadata(),P=o.hash.name,g=m.getAllProperties()[P]._sGetter;return r[g]()},"aggregation":function(c,o){o=o||c;var r=o.data.renderManager,R=o.data.rootControl,m=R.getMetadata(),a=o.hash.name,g=m.getAllAggregations()[a]._sGetter,H=[];var C=R[g]();if(C){for(var i=0,l=C.length;i<l;i++){if(o.fn){H.push(o.fn({},{data:{renderManager:r,rootControl:R,control:C[i]}}))}else{H.push(r.getHTML(C[i]))}}}return new Handlebars.SafeString(H.join(""))},"event":function(c,o){o=o||c}};return h}());
sap.ui.core.tmpl.HandlebarsTemplate.prototype.createMetadata=function(){var t=this.getContent(),T=this._fnTemplate=this._fnTemplate||Handlebars.compile(t);var m={},j=sap.ui.core.tmpl.TemplateControl.getMetadata().getJSONKeys(),p=sap.ui.core.tmpl.TemplateControl.getMetadata().getAllPrivateAggregations();var h={"property":function(c,o){o=o||c;var n=o.hash.name;if(n&&n!=="id"&&!j[n]){m.properties=m.properties||{};m.properties[n]=jQuery.extend({},{type:"string"},o.hash)}else{throw new Error("The property name \""+n+"\" is reserved.")}},"aggregation":function(c,o){o=o||c;var n=o.hash.name;if(n&&!j[n]&&!p[n]){o.hash.multiple=o.hash.multiple=="true";m.aggregations=m.aggregations||{};m.aggregations[n]=jQuery.extend({},o.hash)}else{throw new Error("The aggregation name \""+n+"\" is reserved.")}},"event":function(c,o){o=o||c}};jQuery.each(["each","if","unless","with"],function(i,v){h[v]=function(){}});T({},{helpers:h});return m};
sap.ui.core.tmpl.HandlebarsTemplate.prototype.createRenderer=function(){var t=this.getContent(),T=this._fnTemplate=this._fnTemplate||Handlebars.compile(t);var r=function(a,c){var h=T(c.getContext()||{},{data:{renderManager:a,rootControl:c},helpers:sap.ui.core.tmpl.HandlebarsTemplate.RENDER_HELPERS});a.write(h)};return r};
