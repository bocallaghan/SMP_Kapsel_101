/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.Panel");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Panel",{metadata:{library:"sap.m",properties:{"visible":{type:"boolean",group:"Appearance",defaultValue:true},"headerText":{type:"string",group:"Data",defaultValue:'Start'},"headerLevel":{type:"sap.m.HeaderLevel",group:"Appearance",defaultValue:sap.m.HeaderLevel.H4},"width":{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'100%'},"height":{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'auto'}},defaultAggregation:"content",aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}}});
sap.m.Panel.prototype.init=function(){};
sap.m.Panel.prototype.setWidth=function(w){this.setProperty("width",w,true);var d=this.getDomRef();if(d){d.style.width=w}return this};
sap.m.Panel.prototype.setHeight=function(h){this.setProperty("height",h,true);var d=this.getDomRef();if(d){d.style.height=h}return this};
sap.m.Panel.prototype.setHeaderText=function(h){this.setProperty("headerText",h,false);return this};
sap.m.Panel.prototype.setHeaderLevel=function(h){this.setProperty("headerLevel",h,false);return this};
