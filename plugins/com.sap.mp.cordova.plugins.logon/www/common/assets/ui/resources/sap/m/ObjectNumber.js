/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.ObjectNumber");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.ObjectNumber",{metadata:{library:"sap.m",properties:{"number":{type:"string",group:"Misc",defaultValue:null},"numberUnit":{type:"string",group:"Misc",defaultValue:null},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"emphasized":{type:"boolean",group:"Appearance",defaultValue:true},"state":{type:"sap.ui.core.ValueState",group:"Misc",defaultValue:sap.ui.core.ValueState.None}}}});sap.m.ObjectNumber.prototype._sCSSPrefixObjNumberStatus='sapMObjectNumberStatus';
sap.m.ObjectNumber.prototype.setState=function(s){this.$().removeClass(this._sCSSPrefixObjNumberStatus+this.getState());this.setProperty("state",s,true);this.$().addClass(this._sCSSPrefixObjNumberStatus+this.getState());return this};
