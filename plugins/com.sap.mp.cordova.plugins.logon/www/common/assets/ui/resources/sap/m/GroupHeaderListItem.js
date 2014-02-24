/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.GroupHeaderListItem");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.m.ListItemBase");sap.m.ListItemBase.extend("sap.m.GroupHeaderListItem",{metadata:{library:"sap.m",properties:{"title":{type:"string",group:"Data",defaultValue:null},"count":{type:"string",group:"Data",defaultValue:null},"upperCase":{type:"boolean",group:"Appearance",defaultValue:true}}}});
sap.m.GroupHeaderListItem.prototype.getSelected=function(){return false};
sap.m.GroupHeaderListItem.prototype.ontap=function(e){return};
sap.m.GroupHeaderListItem.prototype.ontouchstart=function(e){e.originalEvent._sapui_handledByControl=true};
