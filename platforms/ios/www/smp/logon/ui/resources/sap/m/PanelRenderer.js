/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.PanelRenderer");sap.m.PanelRenderer={};
sap.m.PanelRenderer.render=function(r,c){if(!c.getVisible()){return}r.write("<section");r.writeControlData(c);r.addClass("sapMPanel");r.addClass("sapMPanelBG");r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeClasses();r.writeStyles();r.write(">");if(c.getHeaderText()){r.write("<header");r.addClass("sapMPanelHdr");r.writeClasses();r.write("><");r.write(c.getHeaderLevel().toLowerCase());r.write(">");r.writeEscaped(c.getHeaderText());r.write("</");r.write(c.getHeaderLevel().toLowerCase());r.write(">");r.write("</header>")}r.write("<div");r.addClass("sapMPanelContent");r.writeClasses();r.write(">");var C=c.getContent();var l=C.length;for(var i=0;i<l;i++){r.renderControl(C[i])}r.write("</div>");r.write("</section>")};
