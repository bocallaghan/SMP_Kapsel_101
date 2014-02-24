/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.SliderRenderer");sap.m.SliderRenderer={};
sap.m.SliderRenderer.render=function(r,s){var v=s.getValue(),n=s.getName(),e=s.getEnabled(),t=s.getTooltip_AsString();if(!s.getVisible()){return}r.write("<div");r.addClass("sapMSliCont");if(!e){r.addClass("sapMSliContDisabled")}r.addStyle("width",s.getWidth());r.addStyle("visibility","hidden");r.writeClasses();r.writeStyles();r.writeControlData(s);if(t){r.writeAttributeEscaped("title",t)}r.write(">");r.write('<div');r.addClass("sapMSli");if(!e){r.addClass("sapMSliDisabled")}r.writeClasses();r.writeStyles();r.write(">");if(s.getProgress()){r.write('<div class="sapMSliProgress" style="width: '+s._sProgressValue+'"></div>')}this._renderHandle(r,s,v,e);r.write("</div>");if(n){this._renderInput(r,s,v,e,n)}r.write("</div>")};
sap.m.SliderRenderer._renderHandle=function(r,s,v,e){r.write('<span');r.addClass("sapMSliHandle");r.addStyle(sap.m.Slider._bRtl?"right":"left",s._sProgressValue);r.writeAccessibilityState(s,{role:"slider",orientation:"horizontal",valuemin:s.getMin(),valuemax:s.getMax(),valuenow:v,valuetext:v,live:"assertive",disabled:!s.getEnabled()});r.writeClasses();r.writeStyles();r.writeAttribute("title",v);if(e){r.writeAttribute("tabindex","0")}r.write('><span class="sapMSliHandleInner"></span></span>')};
sap.m.SliderRenderer._renderInput=function(r,s,v,e,n){r.write('<input type="text" class="sapMSliInput"');if(!e){r.write("disabled")}r.writeAttributeEscaped("name",n);r.writeAttribute("value",v);r.write("/>")};
