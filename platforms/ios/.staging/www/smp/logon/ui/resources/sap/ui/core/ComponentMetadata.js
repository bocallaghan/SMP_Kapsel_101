/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.ComponentMetadata");jQuery.sap.require("sap.ui.base.ManagedObjectMetadata");
sap.ui.core.ComponentMetadata=function(c,C){sap.ui.base.ManagedObjectMetadata.apply(this,arguments)};
sap.ui.core.ComponentMetadata.prototype=jQuery.sap.newObject(sap.ui.base.ManagedObjectMetadata.prototype);
sap.ui.core.ComponentMetadata.preprocessClassInfo=function(c){if(c&&typeof c.metadata==="string"){c.metadata={_src:c.metadata}}return c};
sap.ui.core.ComponentMetadata.prototype.applySettings=function(c){var s=c.metadata;sap.ui.base.ManagedObjectMetadata.prototype.applySettings.call(this,c);if(s._src){jQuery.sap.log.warning("The metadata of the component "+this.getName()+" is loaded from file "+s._src+". This is a design time feature and not for productive usage!");var p=this.getName().replace(/\.\w+?$/,"");var u=jQuery.sap.getModulePath(p,"/"+s._src);var r=jQuery.sap.syncGetJSON(u);if(r.success){jQuery.extend(s,r.data)}else{jQuery.sap.log.error("Failed to load component metadata from \""+s._src+"\"! Reason: "+r.error)}}this._mDependencies=s.dependencies||null;this._mIncludes=s.includes||null;this._sVersion=s.version||null};
sap.ui.core.ComponentMetadata.prototype.getDependencies=function(){return this._mDependencies};
sap.ui.core.ComponentMetadata.prototype.getIncludes=function(){return(this._mIncludes&&this._mIncludes.length>0)?this._mIncludes:null};
sap.ui.core.ComponentMetadata.prototype.getUI5Version=function(){return this._mDependencies?this._mDependencies.ui5version:null};
sap.ui.core.ComponentMetadata.prototype.getComponents=function(){var c=null;if(this._mDependencies){if(this._mDependencies.components&&(this._mDependencies.components.length>0)){c=this._mDependencies.components}}return c};
sap.ui.core.ComponentMetadata.prototype.getLibs=function(){var l=null;if(this._mDependencies){if(this._mDependencies.libs&&(this._mDependencies.libs.length>0)){l=this._mDependencies.libs}}return l};
sap.ui.core.ComponentMetadata.prototype.getVersion=function(){return this._sVersion};
