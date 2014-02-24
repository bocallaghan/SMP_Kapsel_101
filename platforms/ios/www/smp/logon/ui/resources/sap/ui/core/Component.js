/*
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.Component");jQuery.sap.require("sap.ui.base.ManagedObject");jQuery.sap.require("sap.ui.core.ComponentMetadata");jQuery.sap.require("sap.ui.core.Core");sap.ui.base.ManagedObject.extend("sap.ui.core.Component",{constructor:function(i,s){sap.ui.base.ManagedObject.apply(this,arguments)},metadata:{stereotype:"component","abstract":true,version:"0.0",includes:[],dependencies:{libs:[],components:[],ui5version:""},publicMethods:[],aggregations:{},library:"sap.ui.core"}},sap.ui.core.ComponentMetadata);
sap.ui.core.Component.prototype.init=function(){this.loadIncludes();this.loadDependencies()};
sap.ui.core.Component.prototype.loadIncludes=function(){var I=this.getMetadata().getIncludes();if(I&&I.length>0){var t=this;var l=t.getMetadata().getLibraryName();jQuery.each(I,function(i,f){var F=f.toLowerCase();if(F.match(/.css$/)){var c=sap.ui.resource(l,f);jQuery.sap.log.info("Loading CSS from: "+c);jQuery.sap.includeStyleSheet(c)}else{var m=F.match(/.js$/);if(m){f=f.substring(0,m.index);if(f.substring(0,1)!=='/'){f='/'+f}jQuery.sap.require(l+f)}}})}};
sap.ui.core.Component.prototype.loadDependencies=function(){var d=this.getMetadata().getDependencies();if(d){this.loadLibs(d);this.loadComponents(d)}};
sap.ui.core.Component.prototype.loadLibs=function(d){var l=d.libs;if(l&&l.length>0){jQuery.each(l,function(i,L){jQuery.sap.log.info("Loading Library: "+L);sap.ui.getCore().loadLibrary(L)})}};
sap.ui.core.Component.prototype.loadComponents=function(d){var c=d.components;if(c){jQuery.each(c,function(i,n){jQuery.sap.log.info(n);jQuery.sap.require(n+".Component")})}};
sap.ui.core.Component.prototype.exit=function(){};
