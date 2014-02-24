/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.GroupHeaderListItemRenderer");jQuery.sap.require("sap.ui.core.Renderer");jQuery.sap.require("sap.m.ListItemBaseRenderer");sap.m.GroupHeaderListItemRenderer=sap.ui.core.Renderer.extend(sap.m.ListItemBaseRenderer);
sap.m.GroupHeaderListItemRenderer.renderLIAttributes=function(r,l){r.addClass("sapMGHLI");if(l.getUpperCase())r.addClass("sapMGHLIUpperCase")};
sap.m.GroupHeaderListItemRenderer.renderLIContent=function(r,l,n){var t=l.getTitle();n&&r.write("<td colspan='"+n+"'>");if(t){r.write("<label for='"+l.getId()+"-value' class='sapMGHLITitle'>");r.writeEscaped(t);var c=l.getCount();if(c!==undefined&&c!==""){r.writeEscaped(" ("+c+")")}r.write("</label>")}n&&r.write("</td>")};
