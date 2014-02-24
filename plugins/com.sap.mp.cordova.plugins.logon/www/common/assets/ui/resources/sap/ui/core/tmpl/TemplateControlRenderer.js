/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.tmpl.TemplateControlRenderer");sap.ui.core.tmpl.TemplateControlRenderer={};
sap.ui.core.tmpl.TemplateControlRenderer.render=function(r,c){r.write("<div");r.writeControlData(c);r.writeStyles();r.writeClasses();r.write(">");var R=this.renderTemplate||c._renderTemplate;if(R){R.apply(this,arguments)}r.write("</div>")};
