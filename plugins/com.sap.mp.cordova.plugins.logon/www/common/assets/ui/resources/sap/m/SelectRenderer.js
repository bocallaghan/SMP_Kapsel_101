/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.SelectRenderer");jQuery.sap.require("sap.ui.core.ValueStateSupport");sap.m.SelectRenderer={};
sap.m.SelectRenderer.render=function(r,s){var S=s.getSelectedItem(),a=S?S.getText():"",t=sap.ui.core.ValueStateSupport.enrichTooltip(s,s.getTooltip_AsString()),i=s.getId()+"-nat";if(!s.getVisible()){return}r.write("<div");r.addClass("sapMSlt");if(!s.getEnabled()){r.addClass("sapMSltDisabled")}r.addStyle("width",s.getWidth());r.addStyle("max-width",s.getMaxWidth());r.writeControlData(s);r.writeStyles();r.writeClasses();if(t){r.writeAttributeEscaped("title",t)}r.writeAttribute("tabindex","0");r.write(">");this._renderLabel(i,r,a);this._renderIcon(r);this._renderSelectElement(i,r,s,a);r.write("</div>")};
sap.m.SelectRenderer._renderLabel=function(i,r,s){r.write('<label class="sapMSltLabel"');r.writeAttribute("for",i);r.write(">");r.writeEscaped(s);r.write('</label>')};
sap.m.SelectRenderer._renderIcon=function(r){r.write('<span class="sapMSltIcon"></span>')};
sap.m.SelectRenderer._renderSelectElement=function(i,r,s,S){var n=s.getName(),t=s.getTitle();r.write("<select");r.writeAttribute("id",i);if(n){r.writeAttributeEscaped("name",n)}if(t){r.writeAttributeEscaped("title",t)}if(!s.getEnabled()){r.write(" disabled")}r.writeAttribute("tabindex","-1");r.write(">");this._renderOptions(r,s,S);r.write("</select>")};
sap.m.SelectRenderer._renderOptions=function(r,s,S){var I=s.getItems(),a=I.length,b=s.getAssociation("selectedItem"),i=0;for(;i<a;i++){r.write("<option");r.writeAttribute("id",I[i].getId());r.writeAttributeEscaped("value",(I[i].getKey()!=="")?I[i].getKey():I[i].getId());if(I[i].getId()===b){r.write(" selected")}if(!I[i].getEnabled()){r.write(" disabled")}r.write(">");r.writeEscaped(I[i].getText());r.write("</option>")}if(a===0){r.write("<option>"+S+"</option>")}};
