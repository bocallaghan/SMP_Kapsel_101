/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.Bar");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Bar",{metadata:{library:"sap.m",properties:{"enableFlexBox":{type:"boolean",group:"Misc",defaultValue:false,deprecated:true},"translucent":{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{"contentLeft":{type:"sap.ui.core.Control",multiple:true,singularName:"contentLeft"},"contentMiddle":{type:"sap.ui.core.Control",multiple:true,singularName:"contentMiddle"},"contentRight":{type:"sap.ui.core.Control",multiple:true,singularName:"contentRight"}}}});
sap.m.Bar.prototype.init=function(){};
sap.m.Bar.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}};
sap.m.Bar.prototype.onAfterRendering=function(){this._updatePosition()};
sap.m.Bar.prototype.exit=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}};
sap.m.Bar.prototype._updatePosition=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}var $=this.$();if($.length==0||!$.is(":visible")){return}var b=$.outerWidth(true);var a=jQuery.sap.byId(this.getId()+"-BarLeft");var c=jQuery.sap.byId(this.getId()+"-BarRight");var d=jQuery.sap.byId(this.getId()+"-BarPH");if(a.children().length==0&&c.children().length==0){d.css({'width':'100%'})}else{a.css({'width':'auto'});var l=a.children();var L=0;var e=0;if(sap.ui.Device.browser.webkit){for(var i=0;i<l.length;i++){L+=jQuery(l[i]).outerWidth(true)}e=a.outerWidth(true)}else{var o=null;for(var i=0;i<l.length;i++){o=window.getComputedStyle(l[i]);if(o.width=="auto"){L+=jQuery(l[i]).width()+1}else{L+=parseFloat(o.width)}L+=parseFloat(o.marginLeft);L+=parseFloat(o.marginRight);L+=parseFloat(o.paddingLeft);L+=parseFloat(o.paddingRight)}var f=window.getComputedStyle(jQuery.sap.domById(this.getId()+"-BarLeft"));e+=parseFloat(f.width);e+=parseFloat(f.marginLeft);e+=parseFloat(f.marginRight);e+=parseFloat(f.paddingLeft);e+=parseFloat(f.paddingRight)}if(e<L){e=L;a.css({'width':e})}var g=jQuery.sap.byId(this.getId()+"-BarMiddle");var m=g.outerWidth(true);d.css({'position':'static','width':'auto','visibility':'hidden'});var M=d.outerWidth(true);var h=d.position();c.css({'width':'auto'});var r=c.outerWidth(true);var R=c.position();if(this.getEnableFlexBox()){d.css({'position':'absolute','left':e});d.width(b-e-r-parseInt(d.css('margin-left'),10)-parseInt(d.css('margin-right'),10))}else{if(Math.round(R.left)+r>=b){if(b<(e+r)){if(r>b){c.width(b);a.width(0)}else{a.width(b-r)}}if(h.left<e){d.css({'position':'absolute','left':e});h=d.position()}else{}if((h.left+M)>R.left){if(R.left<h.left){d.width(0)}else{d.width(R.left-h.left)}}if(d.outerWidth()>m){d.width(m)}}}d.css({'visibility':'inherit'})}this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef(),jQuery.proxy(this._updatePosition,this))};
