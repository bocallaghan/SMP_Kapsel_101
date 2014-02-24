/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.ObjectListItem");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.m.ListItemBase");sap.m.ListItemBase.extend("sap.m.ObjectListItem",{metadata:{library:"sap.m",properties:{"title":{type:"string",group:"Misc",defaultValue:null},"number":{type:"string",group:"Misc",defaultValue:null},"numberUnit":{type:"string",group:"Misc",defaultValue:null},"intro":{type:"string",group:"Misc",defaultValue:null},"icon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"activeIcon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"iconDensityAware":{type:"boolean",group:"Misc",defaultValue:true}},defaultAggregation:"attributes",aggregations:{"attributes":{type:"sap.m.ObjectAttribute",multiple:true,singularName:"attribute"},"firstStatus":{type:"sap.m.ObjectStatus",multiple:false},"secondStatus":{type:"sap.m.ObjectStatus",multiple:false}}}});
sap.m.ObjectListItem.prototype.exit=function(e){if(this._oImageControl){this._oImageControl.destroy()}sap.m.ListItemBase.prototype.exit.apply(this)};
sap.m.ObjectListItem.prototype._hasAttributes=function(){var a=this.getAttributes();if(a.length>0){for(var i=0;i<a.length;i++){if(!a[i]._isEmpty()){return true}}}return false};
sap.m.ObjectListItem.prototype._hasStatus=function(){return((this.getFirstStatus()&&!this.getFirstStatus()._isEmpty())||(this.getSecondStatus()&&!this.getSecondStatus()._isEmpty()))};
sap.m.ObjectListItem.prototype._hasBottomContent=function(){return(this._hasAttributes()||this._hasStatus())};
sap.m.ObjectListItem.prototype._getImageControl=function(){var i=this.getId()+'-img';var s="3rem";var p={src:this.getIcon(),height:s,width:s,size:s,densityAware:this.getIconDensityAware()};var c=['sapMObjLIcon'];this._oImageControl=sap.m.ImageHelper.getImageControl(i,this._oImageControl,this,p,c);return this._oImageControl};
sap.m.ObjectListItem.prototype._activeHandlingInheritor=function(){var a=this.getActiveIcon();if(!!this._oImageControl&&!!a){this._oImageControl.setSrc(a)}};
sap.m.ObjectListItem.prototype._inactiveHandlingInheritor=function(){var s=this.getIcon();if(!!this._oImageControl){this._oImageControl.setSrc(s)}};
