/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.core.ThemeCheck");jQuery.sap.require("sap.ui.base.Object");jQuery.sap.require("jquery.sap.script");(function(){sap.ui._maxThemeCheckCycles=100;sap.ui.base.Object.extend("sap.ui.core.ThemeCheck",{constructor:function(C){this._oCore=C;this._iCount=0;this._CUSTOMCSSCHECK=".sapUiThemeDesignerCustomCss";this._CUSTOMID="sap-ui-core-customcss"},getInterface:function(){return this},fireThemeChangedEvent:function(o,f){a(this);var u=sap.ui._maxThemeCheckCycles>0;if(u||f){d.apply(this,[true])}else{sap.ui.core.ThemeCheck.themeLoaded=true}if(!o&&!this._sThemeCheckId){this._oCore.fireThemeChanged({theme:this._oCore.getConfiguration().getTheme()})}}});sap.ui.core.ThemeCheck.themeLoaded=false;sap.ui.core.ThemeCheck.checkStyle=function(s,l){if(typeof(s)==="string"){s=jQuery.sap.domById(s)}var S=jQuery(s);try{var r=!s||!!((s.sheet&&s.sheet.cssRules.length>0)||!!(s.styleSheet&&s.styleSheet.cssText.length>0)||!!(s.innerHTML&&s.innerHTML.length>0));var f=S.attr("sap-ui-ready");f=!!(f==="true"||f==="false");if(l){jQuery.sap.log.debug("ThemeCheck: Check styles '"+S.attr("id")+"': "+r+"/"+f+"/"+!!s)}return r||f}catch(e){}if(l){jQuery.sap.log.debug("ThemeCheck: Error during check styles '"+S.attr("id")+"': false/false/"+!!s)}return false};function c(t){var T=t._oCore.getConfiguration().getTheme();var e=null;var r=null;jQuery.each(document.styleSheets,function(i,s){if(s.href){if(!!s.ownerNode&&/sap.ui.core/.test(s.ownerNode.id&&s.cssRules&&s.cssRules.length>0)){r=s.cssRules[0].selectorText;return false}else if(!!s.owningElement&&/sap.ui.core/.test(s.owningElement.id&&s.rules&&s.rules.length>0)){r=s.rules[0].selectorText;return false}}});if(r===t._CUSTOMCSSCHECK){var p=t._oCore._getThemePath("sap.ui.core",T)+"custom.css";jQuery.sap.includeStyleSheet(p,t._CUSTOMID)}else{var f=jQuery("LINK[id='"+t._CUSTOMID+"']");if(f.length>0){f.remove()}}}function a(t){sap.ui.core.ThemeCheck.themeLoaded=false;if(t._sThemeCheckId){jQuery.sap.clearDelayedCall(t._sThemeCheckId);t._sThemeCheckId=null;t._iCount=0}}function b(t){var l=t._oCore.getLoadedLibraries();var r=true;for(var e in l){r=r&&sap.ui.core.ThemeCheck.checkStyle("sap-ui-theme-"+e,true)}if(!r){jQuery.sap.log.warning("ThemeCheck: Theme not yet applied.")}else{c(t)}return r}function d(f){this._iCount++;var e=this._iCount>sap.ui._maxThemeCheckCycles;if(!b(this)&&!e){this._sThemeCheckId=jQuery.sap.delayedCall(2,this,d)}else if(!f){a(this);sap.ui.core.ThemeCheck.themeLoaded=true;this._oCore.fireThemeChanged({theme:this._oCore.getConfiguration().getTheme()});if(e){jQuery.sap.log.warning("ThemeCheck: max. check cycles reached.")}}else{sap.ui.core.ThemeCheck.themeLoaded=true}}})();
