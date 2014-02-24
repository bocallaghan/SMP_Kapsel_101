/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.GrowingListRenderer");jQuery.sap.require("sap.ui.core.Renderer");jQuery.sap.require("sap.m.ListRenderer");sap.m.GrowingListRenderer=sap.ui.core.Renderer.extend(sap.m.ListRenderer);
sap.m.GrowingListRenderer.renderGrowingListContent=function(r,c){r.write("<ul id='"+c.getId()+"-triggerList'");if(c.getScrollToLoad()){r.addStyle("display","none");r.writeStyles()}r.addClass("sapMListUl");r.addClass("sapMGrowingList");if(c.getInset()){r.addClass("sapMListInset");if(c.getHeaderText()){r.addClass("sapMListInsetHdr")}if(c.getFooterText()){r.addClass("sapMListInsetFtr")}}r.writeClasses();r.write(">");var a;if(c.getScrollToLoad()){a=c._getLoading(c.getId()+"-loading")}else{a=c._getTrigger(c.getId()+"-trigger")}a._renderInList=true;r.renderControl(a);r.write("</ul>")};
