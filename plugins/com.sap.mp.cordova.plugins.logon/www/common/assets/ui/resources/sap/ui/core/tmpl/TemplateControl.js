/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.tmpl.TemplateControl");jQuery.sap.require("sap.ui.core.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.core.tmpl.TemplateControl",{metadata:{library:"sap.ui.core",properties:{"context":{type:"object",group:"Data",defaultValue:null}},aggregations:{"controls":{type:"sap.ui.core.Control",multiple:true,singularName:"control",visibility:"hidden"}},associations:{"template":{type:"sap.ui.core.tmpl.Template",multiple:false}},events:{"afterRendering":{},"beforeRendering":{}}}});sap.ui.core.tmpl.TemplateControl.M_EVENTS={'afterRendering':'afterRendering','beforeRendering':'beforeRendering'};jQuery.sap.require("sap.ui.core.tmpl.DOMElement");jQuery.sap.require("sap.ui.core.tmpl.DOMAttribute");jQuery.sap.require("sap.ui.core.DeclarativeSupport");
sap.ui.core.tmpl.TemplateControl.prototype.init=function(){this._aBindingInfos=[]};
sap.ui.core.tmpl.TemplateControl.prototype._cleanup=function(){this.destroyAggregation("controls");if(this._aBindingInfos){var t=this;jQuery.each(this._aBindingInfos,function(i,b){t.getModel(b.model).removeBinding(b.binding)});this._aBindingInfos=[]}};
sap.ui.core.tmpl.TemplateControl.prototype._compile=function(){var t=sap.ui.getCore().byId(this.getTemplate()),d=t&&t.getDeclarativeSupport();if(d){var a=this;setTimeout(function(){sap.ui.core.DeclarativeSupport.compile(a.getDomRef())})}};
sap.ui.core.tmpl.TemplateControl.prototype.exit=function(){this._cleanup()};
sap.ui.core.tmpl.TemplateControl.prototype.onBeforeRendering=function(){this.fireBeforeRendering();this._cleanup()};
sap.ui.core.tmpl.TemplateControl.prototype.onAfterRendering=function(){this.fireAfterRendering()};
sap.ui.core.tmpl.TemplateControl.prototype.updateBindings=function(u,m){sap.ui.base.ManagedObject.prototype.updateBindings.apply(this,arguments);if(this.getDomRef()){this.invalidate()}};
sap.ui.core.tmpl.TemplateControl.prototype.bindText=function(p){var P=sap.ui.core.tmpl.Template.parsePath(p),m=this.getModel(P.model),p=P.path,b=m.bindProperty(p),t=this;b.attachChange(function(){jQuery.sap.log.error("property changed for path: "+p);t.invalidate()});this._aBindingInfos.push({binding:b,path:P.path,model:P.model});return b.getExternalValue()};
sap.ui.core.tmpl.TemplateControl.prototype.bindList=function(p){var P=sap.ui.core.tmpl.Template.parsePath(p),m=this.getModel(P.model),p=P.path,b=m.bindList(p),t=this;b.attachChange(function(){jQuery.sap.log.error("each changed for path: "+p);t.invalidate()});this._aBindingInfos.push({binding:b,path:P.path,model:P.model});return m.getProperty(p)};
sap.ui.core.tmpl.TemplateControl.prototype.createDOMElement=function(s,p,d){var e=new sap.ui.core.tmpl.DOMElement(s);if(p){e.bindElement(p)}if(!d){this.addAggregation("controls",e)}return e};
sap.ui.core.tmpl.TemplateControl.prototype.createControl=function(s,p,d){var h={};jQuery.each(s,function(k,v){if(k.indexOf("-")===-1){h["data-"+jQuery.sap.hyphen(k)]=v}else{h["data-"+k]=v}});var $=jQuery("<div/>",h);var c=sap.ui.core.DeclarativeSupport._createControl($.get(0));if(p){c.bindElement(p)}if(!d){this.addAggregation("controls",c)}return c};
