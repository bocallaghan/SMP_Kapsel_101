/*
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.UIComponent");jQuery.sap.require("sap.ui.core.Component");sap.ui.core.Component.extend("sap.ui.core.UIComponent",{constructor:function(i,s){sap.ui.core.Component.apply(this,arguments)},metadata:{"abstract":true,version:"0.0",includes:[],dependencies:{libs:[],components:[],ui5version:""},publicMethods:["render"],aggregations:{"rootControl":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},library:"sap.ui.core",autoDestroy:false,initOnBeforeRender:true}},sap.ui.core.ComponentMetadata);
sap.ui.core.UIComponent.prototype.init=function(){sap.ui.core.Component.prototype.init.apply(this);var t=this;sap.ui.base.ManagedObject.runWithPreprocessors(function(){t.setAggregation("rootControl",t.createContent())},{id:function(i){return t.createId(i)},settings:function(s){if(s.component){if(typeof s.component=="string"){s.component=t.createId(s.component)}}return s}})};
sap.ui.core.UIComponent.prototype.byId=function(i){return sap.ui.getCore().byId(this.createId(i))};
sap.ui.core.UIComponent.prototype.createId=function(i){return this.getId()+"--"+i};
sap.ui.core.UIComponent.prototype.createContent=function(){return null};
sap.ui.core.UIComponent.prototype.render=function(r){var c=this.getAggregation("rootControl");if(c){r.renderControl(c)}};
sap.ui.core.UIComponent.prototype.getUIArea=function(){return(this.oContainer?this.oContainer.getUIArea():null)};
sap.ui.core.UIComponent.prototype.setContainer=function(c){this.oContainer=c};
sap.ui.core.UIComponent.prototype.onBeforeRendering=function(){};
sap.ui.core.UIComponent.prototype.onAfterRendering=function(){};
