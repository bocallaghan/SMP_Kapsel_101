/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.model.Sorter");sap.ui.base.Object.extend("sap.ui.model.Sorter",{constructor:function(p,d,g){if(typeof p==="object"){var s=p;p=s.path;d=s.descending}this.sPath=p;this.bDescending=d;this.vGroup=g;if(typeof g=="boolean"&&g){this.fnGroup=function(c){jQuery.sap.log.warning(this.sPath);return c.getProperty(this.sPath)}}if(typeof g=="function"){this.fnGroup=g}}});
