/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.model.Filter");jQuery.sap.require("sap.ui.model.FilterOperator");sap.ui.base.Object.extend("sap.ui.model.Filter",{constructor:function(p,o,v,V){if(typeof p==="object"){var f=p;p=f.path;o=f.operator;v=f.value1;V=f.value2}this.sPath=p;this.sOperator=o;this.oValue1=v;this.oValue2=V}});
