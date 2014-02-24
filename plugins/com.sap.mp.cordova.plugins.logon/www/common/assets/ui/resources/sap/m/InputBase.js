/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.InputBase");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.InputBase",{metadata:{library:"sap.m",properties:{"value":{type:"string",group:"Data",defaultValue:null,bindable:"bindable"},"width":{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},"enabled":{type:"boolean",group:"Behavior",defaultValue:true},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"valueState":{type:"sap.ui.core.ValueState",group:"Data",defaultValue:sap.ui.core.ValueState.None},"name":{type:"string",group:"Misc",defaultValue:null},"placeholder":{type:"string",group:"Misc",defaultValue:null},"editable":{type:"boolean",group:"Misc",defaultValue:true}},events:{"change":{}}}});sap.m.InputBase.M_EVENTS={'change':'change'};jQuery.sap.require("sap.ui.core.EnabledPropagator");sap.ui.core.EnabledPropagator.call(sap.m.InputBase.prototype);jQuery.sap.require("sap.ui.core.IconPool");sap.ui.core.IconPool.insertFontFaceStyle();
sap.m.InputBase.prototype.init=function(){this._curpos=0;this._changeProxy=jQuery.proxy(this._onChange,this)};
sap.m.InputBase.prototype._showLabelAsPlaceholder=(function($){if(!("placeholder"in document.createElement("input"))){return true}var u=$.support.touch;if(u&&(($.os.ios&&$.os.fVersion>=6)||($.os.android&&$.browser.chrome))||($.os.blackberry&&$.os.fVersion>=10)){u=null}return u}(jQuery));
sap.m.InputBase.prototype.onBeforeRendering=function(){if(this.getDomRef()){this._$input.off();this._curpos=this._$input.cursorPos()}};
sap.m.InputBase.prototype.onAfterRendering=function(){this._$input=jQuery.sap.byId(this.getId()+"-inner");this._$input.bind("change",this._changeProxy);if(this._showLabelAsPlaceholder){this._$label=this.$().find('label');this._setLabelVisibility()}};
sap.m.InputBase.prototype.exit=function(){delete this._$input;delete this._$label};
sap.m.InputBase.prototype.getFocusDomRef=function(){return(this.getDomRef()?this._$input[0]:null)};
sap.m.InputBase.prototype.getIdForLabel=function(){return this.getId()+'-inner'};
sap.m.InputBase.prototype.ontouchstart=function(e){e.originalEvent._sapui_handledByControl=true};
sap.m.InputBase.prototype.setValueState=function(v){var o=this.getValueState();if(v==o){return this}if(!this.getDomRef()){return this.setProperty("valueState",v)}var $=this.$();this.setProperty("valueState",v,true);if(o&&o!="None"){$.removeClass("sapMInputBase"+o);this._$input.removeClass("sapMInputBase"+o+"Inner")}if(v&&v!="None"){$.addClass("sapMInputBase"+v);this._$input.addClass("sapMInputBase"+v+"Inner")}return this};
sap.m.InputBase.prototype.setValue=function(v){if(this.getMaxLength&&this.getMaxLength()>0){v=v.toString().substring(0,this.getMaxLength())}this.setProperty("value",v,true);if(this.getDomRef()){this._$input.val(v)}return this};
sap.m.InputBase.prototype.setWidth=function(w){this.setProperty("width",w,true);if(this.getDomRef()){this.$().width(w)}return this};
sap.m.InputBase.prototype.setPlaceholder=function(p){this.setProperty("placeholder",p,true);if(this.getDomRef()){p=jQuery.sap.escapeHTML(p);if(this._$label){this._$label.html(p)}else{this._$input.attr("placeholder",p)}}return this};
sap.m.InputBase.prototype.setMaxLength=function(m){if(m<0){return this}this.setProperty("maxLength",m,true);if(this.getDomRef()){if(m==0){this._$input.removeAttr("maxlength")}else{this._$input.val(this._$input.val().substring(0,m));this._$input.attr("maxlength",m)}}return this};
sap.m.InputBase.prototype._onChange=function(e){var v=this._$input.val();this.setProperty("value",v,true);this._curpos=this._$input.cursorPos();this._setLabelVisibility();this.fireChange({newValue:v})};
sap.m.InputBase.prototype._setLabelVisibility=function(){if(this.getDomRef()&&this._$label){this._$label.css("display",this.getValue()?"none":"inline")}};
sap.m.InputBase.prototype.getFocusInfo=function(){return{id:this.getId(),cursorPos:this._curpos}};
sap.m.InputBase.prototype.applyFocusInfo=function(f){if(this.getDomRef()){sap.ui.core.Element.prototype.applyFocusInfo.call(this,f);this._$input.cursorPos(this._curpos)}return this};
