/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.CheckBoxRenderer");jQuery.sap.require("sap.ui.core.ValueStateSupport");sap.m.CheckBoxRenderer={};
sap.m.CheckBoxRenderer.render=function(r,c){if(!c.getVisible()){return}var e=c.getEnabled();var m=0;r.write("<div");r.addClass("sapMCb");if(e){r.addClass("sapMPointer")}r.writeControlData(c);r.writeClasses();var t=sap.ui.core.ValueStateSupport.enrichTooltip(c,c.getTooltip_AsString());if(t){r.writeAttributeEscaped("title",t)}r.write(">");r.write("<div id='");r.write(c.getId()+"-CbBg'");r.addClass("sapMCbBg");if(!e){r.addClass("sapMCbBgDis");m=-1}if(!c.getActiveHandling()){r.addClass("sapMCbActiveStateOff")}r.writeAttribute("tabIndex",m);r.addClass("sapMCbMark");if(c.getSelected()){r.addClass("sapMCbMarkChecked")}r.writeClasses();r.write(">");r.write("<input type='CheckBox' tabindex='-1' id='");r.write(c.getId()+"-CB'");if(c.getSelected()){r.writeAttribute("checked","checked")}if(c.getName()){r.writeAttributeEscaped('name',c.getName())}if(!e){r.write(" disabled='disabled'")}r.write(" /></div>");r.renderControl(c._oLabel);r.write("</div>")};
