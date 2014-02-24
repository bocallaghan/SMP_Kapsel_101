/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.ComponentContainer");jQuery.sap.require("sap.ui.core.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.core.ComponentContainer",{metadata:{library:"sap.ui.core",properties:{"name":{type:"string",group:"",defaultValue:null},"url":{type:"sap.ui.core.URI",group:"",defaultValue:null},"settings":{type:"object",group:"",defaultValue:null},"propagateModel":{type:"boolean",group:"",defaultValue:false}},associations:{"component":{type:"sap.ui.core.UIComponent",multiple:false}}}});
/*!
 * @copyright@
 */

sap.ui.core.ComponentContainer.prototype.init=function(){};
sap.ui.core.ComponentContainer.prototype.onBeforeRendering=function(){if(!this.oComponent){var n=this.getName(),u=this.getUrl(),s=this.getSettings();if(n){this.oComponent=sap.ui.getCore().createComponent(n,u,s)}if(!this.oComponent){this.oComponent=this.getComponentInstance()}if(this.oComponent){this.oComponent.setContainer(this);this.setComponent(this.oComponent);this.propagateProperties()}}if(this.oComponent){this.oComponent.onBeforeRendering()}};
sap.ui.core.ComponentContainer.prototype.onAfterRendering=function(){if(this.oComponent){this.oComponent.onAfterRendering()}};
sap.ui.core.ComponentContainer.prototype.exit=function(){if(this.oComponent){this.oComponent.destroy()}};
sap.ui.core.ComponentContainer.prototype.getComponentInstance=function(){var c=this.getComponent();return sap.ui.getCore().getComponent(c)};
sap.ui.core.ComponentContainer.prototype.propagateProperties=function(n){if(this.oComponent&&this.getPropagateModel()){this._propagateProperties(n,this.oComponent);sap.ui.core.Control.prototype.propagateProperties.apply(this,arguments)}};
