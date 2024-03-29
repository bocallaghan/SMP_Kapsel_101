/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.IconTabFilter");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Item");sap.ui.core.Item.extend("sap.m.IconTabFilter",{metadata:{interfaces:["sap.m.IconTab"],library:"sap.m",properties:{"count":{type:"string",group:"Data",defaultValue:''},"showAll":{type:"boolean",group:"Misc",defaultValue:false},"icon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:''},"iconColor":{type:"sap.ui.core.IconColor",group:"Appearance",defaultValue:sap.ui.core.IconColor.Default},"iconDensityAware":{type:"boolean",group:"Appearance",defaultValue:true}},defaultAggregation:"content",aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}}});
sap.m.IconTabFilter.prototype.ontouchstart=function(e){if(this.getEnabled()){this.highlight()}};
sap.m.IconTabFilter.prototype.ontouchend=function(e){if(this.getEnabled()){this.unhighlight();this.getParent().setSelectedItem(this)}};
sap.m.IconTabFilter.prototype.ontouchcancel=function(e){if(this.getEnabled()){this.unhighlight()}};
sap.m.IconTabFilter.prototype.highlight=function(e){this.$().addClass("sapMITHighlight")};
sap.m.IconTabFilter.prototype.unhighlight=function(e){this.$().removeClass("sapMITHighlight")};
sap.m.IconTabFilter.prototype._getImageControl=function(c,p,C){var P={src:this.getIcon(),densityAware:this.getIconDensityAware()};this._oImageControl=sap.m.ImageHelper.getImageControl(null,this._oImageControl,p,P,c,C);return this._oImageControl};
sap.m.IconTabFilter.prototype.exit=function(e){if(this._oImageControl){this._oImageControl.destroy()}if(sap.ui.core.Item.prototype.exit){sap.ui.core.Item.prototype.exit.call(this,e)}};
