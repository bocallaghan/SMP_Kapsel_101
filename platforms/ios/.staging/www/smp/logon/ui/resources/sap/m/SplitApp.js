/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.SplitApp");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.m.SplitContainer");sap.m.SplitContainer.extend("sap.m.SplitApp",{metadata:{library:"sap.m",properties:{"homeIcon":{type:"any",group:"Misc",defaultValue:null}},events:{"orientationChange":{}}}});sap.m.SplitApp.M_EVENTS={'orientationChange':'orientationChange'};jQuery.sap.require("sap.m.SplitContainer");
sap.m.SplitApp.prototype.init=function(){sap.m.SplitContainer.prototype.init.apply(this,arguments);this.addStyleClass("sapMSplitApp");jQuery.sap.initMobile({viewport:!this._debugZoomAndScroll,statusBar:"default",hideBrowser:true,preventScroll:!this._debugZoomAndScroll,rootId:this.getId()})};
sap.m.SplitApp.prototype.onBeforeRendering=function(){sap.m.SplitContainer.prototype.onBeforeRendering.apply(this,arguments);jQuery(window).unbind("resize",this._fireOrientationChange);jQuery.sap.initMobile({homeIcon:this.getHomeIcon()})};
sap.m.SplitApp.prototype.onAfterRendering=function(){sap.m.SplitContainer.prototype.onAfterRendering.apply(this,arguments);var r=this.getDomRef().parentNode;if(r&&!r._sapui5_heightFixed){r._sapui5_heightFixed=true;while(r&&r!==document.documentElement){var $=jQuery(r);if($.hasClass("sapMShellContent")){break}if(!r.style.height)r.style.height="100%";r=r.parentNode}}jQuery(window).bind("resize",jQuery.proxy(this._fireOrientationChange,this))};
sap.m.SplitApp.prototype.exit=function(){sap.m.SplitContainer.prototype.exit.apply(this,arguments);jQuery(window).unbind("resize",this._fireOrientationChange)};
sap.m.SplitApp.prototype._fireOrientationChange=function(){var i=jQuery.device.is.landscape;if(this._oldIsLandscape!==i){this.fireOrientationChange({landscape:i})}};
