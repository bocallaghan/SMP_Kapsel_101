/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.Select");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Select",{metadata:{library:"sap.m",properties:{"name":{type:"string",group:"Misc",defaultValue:null},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"enabled":{type:"boolean",group:"Behavior",defaultValue:true},"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'auto'},"maxWidth":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"title":{type:"string",group:"Misc",defaultValue:null},"selectedKey":{type:"string",group:"Data",defaultValue:null},"selectedItemId":{type:"string",group:"Misc",defaultValue:null}},defaultAggregation:"items",aggregations:{"items":{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable"},"popover":{type:"sap.m.Popover",multiple:false,visibility:"hidden"},"dialog":{type:"sap.m.Dialog",multiple:false,visibility:"hidden"}},associations:{"selectedItem":{type:"sap.ui.core.Item",multiple:false}},events:{"change":{}}}});sap.m.Select.M_EVENTS={'change':'change'};jQuery.sap.require("sap.ui.core.theming.Parameters");jQuery.sap.require("sap.ui.core.EnabledPropagator");jQuery.sap.require("sap.m.Popover");jQuery.sap.require("sap.m.List");jQuery.sap.require("sap.ui.core.IconPool");sap.ui.core.IconPool.insertFontFaceStyle();sap.ui.core.EnabledPropagator.apply(sap.m.Select.prototype,[true]);
sap.m.Select.prototype.init=function(){if(this._bUseCustomListOfItems){this._initList()}else if(this._bUseCustomSelect){jQuery.sap.require("sap.m.CustomSelect");sap.m.Select.prototype.init=undefined}};
sap.m.Select.prototype.onBeforeRendering=function(){var i=this.getItems(),I=this.getSelectedItem(),k=this.getSelectedKey();this._synchronizeSelectedItemAndKey(i,I,k);if(this._bUseCustomListOfItems){this._updateCustomListOfItems(i)}else{this._unbindBrowserChangeEvent()}if(this._bUseCustomSelect){this._onBeforeRenderingCustom()}};
sap.m.Select.prototype.onAfterRendering=function(){var p;this._cacheDomRefs();if(this._bUseCustomListOfItems){p=this._$SelectCont.closest(".sapMBar-CTX");this._bHasParentBar=!!p.length;this._bHasParentList=!!this._$SelectCont.closest(".sapMLIB-CTX").length;this._sParentCTX="sapMSltWithCustomLIB"+(p.hasClass("sapMHeader-CTX")?"Header-CTX":"Footer-CTX");if(this._oOverlay&&this._oOverlay.getDomRef()){if(this._oOverlay.isOpen()&&!this.getItems().length){this._oOverlay.close()}else{jQuery.sap.delayedCall(0,this._oOverlay,"rerender")}}}else{this._$Select.on("change.sapMSelect",jQuery.proxy(this._handleBrowserChangeEvent,this))}this._$Select[0].style.width="100%";if(this._bUseCustomSelect){this._onAfterRenderingCustom()}};
sap.m.Select.prototype.exit=function(){this._unbindBrowserChangeEvent();if(this._oList){this._oList.destroy();this._oList=null}if(this._oPopover){this._oPopover=null}if(this._oDialog){this._oDialog=null}};
sap.m.Select.prototype.ontouchstart=function(e){e.originalEvent._sapui_handledByControl=true;this._addActiveState();if(!this._bUseCustomListOfItems||!this.getItems().length){return}this._oOverlay=jQuery.device.is.phone&&!this._bHasParentBar?this._getDialog():this._getPopover();if(this._oOverlay.isOpen()){this._oOverlay.close()}};
sap.m.Select.prototype.ontouchmove=function(e){if(this._bUseCustomSelect){this._ontouchmoveCustom(e)}};
sap.m.Select.prototype.ontouchend=function(){if(this._bUseCustomListOfItems){if((this._oOverlay&&!this._oOverlay.isOpen())||!this.getItems().length){this._removeActiveState()}}else{this._removeActiveState()}};
sap.m.Select.prototype.ontap=function(){if(!this._bUseCustomListOfItems){return}if(this._oOverlay&&this._oOverlay.isOpen()){this._oOverlay.close();return}if(this.getItems().length){this._oOverlay.addContent(this._oList);this._open(this._oOverlay)}if(this._oOverlay&&this._oOverlay.isOpen()){this._addActiveState()}};
sap.m.Select.prototype._handleBrowserChangeEvent=function(){var n=this._$SelectOptions.filter(":selected"),o=n[0].id,s=this.getSelectedItem();if(!s||s.getId()===o){return}this._$Select[0].blur();this._updateSelectedOption(n);this._updateSelectedItem(sap.ui.getCore().byId(o))};
sap.m.Select.prototype._handleStandardListItemPressEvent=function(c){var s=c.getSource(),i;i=this._findMappedItem(s);this._oOverlay.close();if(i){this._updateSelectedItem(i);this._updateSelectedOption(i.$())}};
sap.m.Select.prototype._synchronizeSelectedItemAndKey=function(i,I,k){if(i.length){if(k!==(I&&I.getKey())){I=this.getItemByKey(""+k);if(!I){if(k!==""){jQuery.sap.log.warning('Warning: onBeforeRendering() the key "'+k+'" has no corresponding aggregated item on ',this)}else{I=this._findFirstEnabledItem(this.getItems());if(I){this._setSelectedItem(I)}}}else{this.setAssociation("selectedItem",I,true);this.setProperty("selectedItemId",I.getId(),true)}}else if(i.indexOf(I)===-1){jQuery.sap.log.warning('Warning: onBeforeRendering() the sap.ui.core.Item instance or sap.ui.core.Item id is not a valid aggregation on',this)}}else{this.setAssociation("selectedItem",null,true);this.setProperty("selectedItemId","",true);this.setProperty("selectedKey","",true);jQuery.sap.log.info("Info: the select control does not contain any item on",this)}};
sap.m.Select.prototype._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");sap.m.Select.prototype._bUseCustomListOfItems=sap.ui.core.theming.Parameters.get("sapMPlatformDependent")!=="true";sap.m.Select.prototype._bUseCustomSelect=(jQuery.os.android&&jQuery.os.fVersion===2.3)&&sap.ui.core.theming.Parameters.get("sapMPlatformDependent")==="true";sap.m.Select.prototype._sLang=sap.ui.getCore().getConfiguration().getLanguage().split("-")[0];
sap.m.Select.prototype._cacheDomRefs=function(){this._$SelectCont=this.$();this._$Select=this._$SelectCont.children("select");this._$SelectOptions=this._$Select.children("option");this._$SeletedOption=this._$SelectOptions.filter(":selected");this._$SelectLabel=this._$SelectCont.children(".sapMSltLabel")};
sap.m.Select.prototype._unbindBrowserChangeEvent=function(){if(this._$Select){this._$Select.off("change.sapMSelect",this._handleBrowserChangeEvent)}};
sap.m.Select.prototype._findFirstEnabledItem=function(I){for(var i=0;i<I.length;i++){if(I[i].getEnabled()){return I[i]}}};
sap.m.Select.prototype._setSelectedItem=function(i){this.setAssociation("selectedItem",i?i.getId():null,true);this.setProperty("selectedItemId",i?i.getId():"",true);this.setProperty("selectedKey",i?i.getKey():"",true)};
sap.m.Select.prototype._mapItemToStandardListItem=function(i){var s=new sap.m.StandardListItem({title:i.getText(),type:i.getEnabled()?sap.m.ListType.Active:sap.m.ListType.Inactive});s.attachPress(this._handleStandardListItemPressEvent,this);return s};
sap.m.Select.prototype._findMappedItem=function(s){var i=0,I=this.getItems(),o;for(;i<I.length;i++){if(I[i]._oStandardListItem===s){o=I[i];break}}return o||null};
sap.m.Select.prototype._updateSelectedOption=function(n){this._$SeletedOption[0].removeAttribute("selected");n[0].setAttribute("selected","selected");this._$SeletedOption=n};
sap.m.Select.prototype._updateSelectedItem=function(i){var I=i.getId();if(i===this.getSelectedItem()){return}this.setAssociation("selectedItem",I,true);this.setProperty("selectedItemId",I,true);this.setProperty("selectedKey",i.getKey(),true);this._$SelectLabel.text(i.getText());this.fireChange({selectedItem:i})};
sap.m.Select.prototype._open=function(o){if(jQuery.device.is.phone&&this._bHasParentBar&&o instanceof sap.m.Popover){o.setModal(true,this._sParentCTX)}if(o instanceof sap.m.Dialog){o.setTitle(this.getSelectedItem().getText())}o instanceof sap.m.Dialog?o.open():o.openBy(this)};
sap.m.Select.prototype._updateCustomListOfItems=function(I){var i=0,s;this._oList.destroyAggregation("items",true);for(;i<I.length;i++){I[i]._oStandardListItem=s=this._mapItemToStandardListItem(I[i]);this._oList.addAggregation("items",s,true)}};
sap.m.Select.prototype._initList=function(){this._oList=new sap.m.List()};
sap.m.Select.prototype._getPopover=function(){if(this._oPopover){return this._oPopover}this._oPopover=new sap.m.Popover({showHeader:false,placement:sap.m.PlacementType.Vertical,offsetX:0,offsetY:0}).addStyleClass("sapMSltWithCustomLIB").attachBeforeClose(this._handleOverlayBeforeClose,this).addEventDelegate({onAfterRendering:this._onAfterRenderingPopover},this);this.setAggregation("popover",this._oPopover,true);return this._oPopover};
sap.m.Select.prototype._getDialog=function(){if(this._oDialog){return this._oDialog}this._oDialog=new sap.m.Dialog({stretchOnPhone:true,title:this.getSelectedItem().getText()}).addStyleClass("sapMSltWithCustomLIB").attachBeforeClose(this._handleOverlayBeforeClose,this);this._oDialog.getAggregation("_header").attachBrowserEvent("tap",function(){this._oDialog.close()},this);this.setAggregation("dialog",this._oDialog,true);return this._oDialog};
sap.m.Select.prototype._handleOverlayBeforeClose=function(){this._removeActiveState()};
sap.m.Select.prototype._onAfterRenderingPopover=function(){this._adjustList();this._resetPopover();if(!this._bHasParentBar&&!this._bHasParentList){this._oPopover.addStyleClass("sapMSltWithCustomLIBStandalone")}};
sap.m.Select.prototype._resetPopover=function(){this._oPopover._marginTop=0;this._oPopover._marginLeft=0;this._oPopover._marginRight=0;this._oPopover._marginBottom=0;this._oPopover._arrowOffset=0;this._oPopover._offsets=["0 0","0 0","0 0","0 0"];this._oPopover.getDomRef().style.minWidth=this._oList.getWidth()};
sap.m.Select.prototype._adjustList=function(){if(jQuery.device.is.desktop||jQuery.device.is.tablet){this._oList.setWidth((this._$Select.outerWidth()/parseFloat(sap.m.BaseFontSize))+"rem")}};
sap.m.Select.prototype._addActiveState=function(){this._$SelectCont.addClass("sapMSltPressed")};
sap.m.Select.prototype._removeActiveState=function(){this._$SelectCont.removeClass("sapMSltPressed")};
sap.m.Select.prototype.setSelectedItem=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i)}if(!(i instanceof sap.ui.core.Item)&&i!==null){jQuery.sap.log.warning('Warning: setSelectedItem() "vItem" has to be an instance of sap.ui.core.Item, a valid sap.ui.core.Item id, or null on',this);return this}this.setAssociation("selectedItem",i||null);this.setProperty("selectedItemId",i?i.getId():"");this.setProperty("selectedKey",i?i.getKey():"");return this};
sap.m.Select.prototype.setSelectedItemId=function(i){var I=sap.ui.getCore().byId(i);if(!(I instanceof sap.ui.core.Item)&&i!==""&&i!==undefined){jQuery.sap.log.warning('Warning: setSelectedItemId() "sItem" has to be a string id of an sap.ui.core.Item instance, an empty string or undefined on',this);return this}this.setAssociation("selectedItem",I||null);this.setProperty("selectedItemId",i||"");this.setProperty("selectedKey",I?I.getKey():"");return this};
sap.m.Select.prototype.setSelectedKey=function(k){return this.setProperty("selectedKey",k)};
sap.m.Select.prototype.getSelectedItem=function(){var s=this.getAssociation("selectedItem");return(s===null)?null:sap.ui.getCore().byId(s)};
sap.m.Select.prototype.removeItem=function(i){i=this.removeAggregation("items",i);if(i&&i.getId()===this.getAssociation("selectedItem")){this._setSelectedItem(this._findFirstEnabledItem(this.getItems()))}return i};
sap.m.Select.prototype.getItemByKey=function(k){var I=this.getItems(),i=0;for(;i<I.length;i++){if(I[i].getKey()===k){return I[i]}}};