/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.Popover");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Popover",{metadata:{publicMethods:["close","openBy","isOpen"],library:"sap.m",properties:{"placement":{type:"sap.m.PlacementType",group:"Behavior",defaultValue:sap.m.PlacementType.Right},"showHeader":{type:"boolean",group:"Appearance",defaultValue:true},"title":{type:"string",group:"Appearance",defaultValue:null},"modal":{type:"boolean",group:"Behavior",defaultValue:false},"offsetX":{type:"int",group:"Appearance",defaultValue:0},"offsetY":{type:"int",group:"Appearance",defaultValue:0},"contentWidth":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"contentHeight":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"enableScrolling":{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},"verticalScrolling":{type:"boolean",group:"Misc",defaultValue:true},"horizontalScrolling":{type:"boolean",group:"Misc",defaultValue:true}},defaultAggregation:"content",aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"},"customHeader":{type:"sap.ui.core.Control",multiple:false},"footer":{type:"sap.ui.core.Control",multiple:false},"leftButton":{type:"sap.m.Button",multiple:false},"rightButton":{type:"sap.m.Button",multiple:false},"_internalHeader":{type:"sap.m.Bar",multiple:false,visibility:"hidden"}},associations:{"initialFocus":{type:"sap.ui.core.Control",multiple:false}},events:{"afterOpen":{},"afterClose":{},"beforeOpen":{},"beforeClose":{}}}});sap.m.Popover.M_EVENTS={'afterOpen':'afterOpen','afterClose':'afterClose','beforeOpen':'beforeOpen','beforeClose':'beforeClose'};jQuery.sap.require("sap.ui.core.Popup");jQuery.sap.require("sap.m.Bar");jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");jQuery.sap.require("sap.m.InstanceManager");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.m.Popover._bOneDesign=(sap.ui.core.theming.Parameters.get("sapMPlatformDependent")!=='true');sap.m.Popover._bIE9=(jQuery.browser.msie&&jQuery.browser.fVersion<10);
sap.m.Popover.prototype.init=function(){this._arrowOffsetThreshold=sap.m.Popover._bOneDesign?4:15;this._marginTopInit=false;this._marginTop=(!sap.m.Popover._bOneDesign&&jQuery.os.ios)?44:48;this._marginLeft=10;this._marginRight=10;this._marginBottom=10;this._$window=jQuery(window);this.oPopup=new sap.ui.core.Popup();this.oPopup.setShadow(true);this.oPopup.setAutoClose(true);this.oPopup.setAnimations(this._openAnimation,this._closeAnimation);this._placements=[sap.m.PlacementType.Top,sap.m.PlacementType.Right,sap.m.PlacementType.Bottom,sap.m.PlacementType.Left,sap.m.PlacementType.Vertical,sap.m.PlacementType.Horizontal,sap.m.PlacementType.Auto];this._myPositions=["center bottom","begin center","center top","end center"];this._atPositions=["center top","end center","center bottom","begin center"];this._offsets=["0 -18","18 0","0 18","-18 0"];this._arrowOffset=18;this._scrollContentList=[sap.m.NavContainer,sap.m.Page,sap.m.ScrollContainer];this._fnSetArrowPosition=jQuery.proxy(this._setArrowPosition,this);this._fnOrientationChange=jQuery.proxy(this._onOrientationChange,this);if(jQuery.device.is.desktop){this.oPopup.setFollowOf(jQuery.proxy(function(){this.close()},this))}var t=this;this.oPopup._applyPosition=function(p){if(this.getOpenState()===sap.ui.core.OpenState.CLOSING){return}if(!t._bPosCalced){t._bCalSize=true;t._clearCSSStyles()}var P=jQuery.inArray(t.getPlacement(),t._placements);if(P>3&&!t._bPosCalced){t._calcPlacement(t);return}p.of=(t._oOpenBy instanceof sap.ui.core.Control)?t._oOpenBy.getDomRef():t._oOpenBy;sap.ui.core.Popup.prototype._applyPosition.call(this,p);t._fnSetArrowPosition();t._bCalSize=false;t._bPosCalced=false};this.oPopup.close=function(b){if(!b){t.fireBeforeClose({openBy:t._oOpenBy})}sap.ui.core.Popup.prototype.close.apply(this,Array.prototype.slice.call(arguments,1))}};
sap.m.Popover.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}if(this._hasSingleScrollableContent()){this._forceDisableScrolling=true;jQuery.sap.log.info("VerticalScrolling and horizontalScrolling in sap.m.Popover with ID "+this.getId()+" has been disabled because there's scrollable content inside")}else{this._forceDisableScrolling=false}if(!this._forceDisableScrolling){if(!this._oScroller){this._oScroller=new sap.ui.core.delegate.ScrollEnablement(this,this.getId()+"-scroll",{horizontal:this.getHorizontalScrolling(),vertical:this.getVerticalScrolling(),zynga:false,preventDefault:false,nonTouchScrolling:"scrollbar"})}}};
sap.m.Popover.prototype.onAfterRendering=function(){var $,a,b;if(!this._marginTopInit){this._marginTop=2;if(this._oOpenBy){$=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.$():jQuery(this._oOpenBy);if(!($.closest("header.sapMBar").length>0)){a=$.closest(".sapMPage");if(a.length>0){b=a.children("header.sapMBar");if(b.length>0){this._marginTop+=b.outerHeight()}}}this._marginTopInit=true}}this._restoreFocus()};
sap.m.Popover.prototype.exit=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}this._$window.unbind("resize",this._fnOrientationChange);if(this.oPopup){this.oPopup.destroy();this.oPopup=null}if(this._oScroller){this._oScroller.destroy();this._oScroller=null}if(this._internalHeader){this._internalHeader.destroy();this._internalHeader=null}if(this._headerTitle){this._headerTitle.destroy();this._headerTitle=null}};
sap.m.Popover.prototype.openBy=function(c,s){var p=this.oPopup,e=this.oPopup.getOpenState(),f=this.getInitialFocus()||this.getLeftButton()||this.getRightButton()||this.getId(),P,i;if(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING){if(this._oOpenBy===c){return}else{var a=function(){p.detachEvent("closed",a,this);this.openBy(c)};p.attachEvent("closed",a,this);this.close();return}}if(!c){return}if(jQuery.support.touch){this._$window.bind("resize",this._fnOrientationChange)}if(!this._oOpenBy||c!==this._oOpenBy){this._oOpenBy=c}this.fireBeforeOpen({openBy:this._oOpenBy});p.attachEvent("opened",this._handleOpened,this);p.setInitialFocusId(f);i=jQuery.inArray(this.getPlacement(),this._placements);if(i>-1){P=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.getDomRef():this._oOpenBy;p.setAutoCloseAreas([P]);p.setContent(this);if(i<=3){p.setPosition(this._myPositions[i],this._atPositions[i],P,this._calcOffset(this._offsets[i]),"fit")}var t=this;var C=function(){if(p.getOpenState()===sap.ui.core.OpenState.CLOSING){setTimeout(C,150)}else{p.open();if(!s){sap.m.InstanceManager.addPopoverInstance(t)}}};C()}else{jQuery.sap.log.error(this.getPlacement()+"is not a valid value! It can only be top, right, bottom or left")}return this};
sap.m.Popover.prototype.close=function(){var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.CLOSED||e===sap.ui.core.OpenState.CLOSING)){this.fireBeforeClose({openBy:this._oOpenBy});this.oPopup.close(true)}return this};
sap.m.Popover.prototype.isOpen=function(){return this.oPopup&&this.oPopup.isOpen()};
sap.m.Popover.prototype._clearCSSStyles=function(){var s=this.getDomRef().style,$=jQuery.sap.byId(this.getId()+"-cont"),a=$.children(".sapMPopoverScroll"),c=$[0].style,S=a.css("position")==="absolute",C=this.getContentWidth(),i=this.getContentHeight(),b=jQuery.sap.byId(this.getId()+"-arrow");s.overflow="";c.width=C||S?a.outerWidth(true)+"px":"";c.height=i||S?a.outerHeight(true)+"px":"";c.maxWidth="";s.left="";s.right="";s.top="";s.bottom="";s.width="";s.height="";a[0].style.width="";b.removeClass("sapMPopoverArrRight sapMPopoverArrLeft sapMPopoverArrDown sapMPopoverArrUp sapMPopoverCrossArr sapMPopoverFooterAlignArr sapMPopoverHeaderAlignArr");b.css({left:"",top:""})};
sap.m.Popover.prototype._onOrientationChange=function(){if(this._bCalSize){return}var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING)){return}this.oPopup._applyPosition(this.oPopup._oLastPosition)};
sap.m.Popover.prototype._handleOpened=function(){var t=this;this.oPopup.detachEvent("opened",this._handleOpened,this);this.oPopup.attachEvent("closed",this._handleClosed,this);if(!jQuery.support.touch){setTimeout(function(){t._$window.bind("resize",t._fnOrientationChange)},0)}if(!t._sResizeListenerId){t._sResizeListenerId=sap.ui.core.ResizeHandler.register(jQuery.sap.domById(t.getId()+"-scroll"),t._fnOrientationChange)}this.fireAfterOpen({openBy:this._oOpenBy})};
sap.m.Popover.prototype._handleClosed=function(){this.oPopup.detachEvent("closed",this._handleClosed,this);if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}sap.m.InstanceManager.removePopoverInstance(this);this.fireAfterClose({openBy:this._oOpenBy})};
sap.m.Popover.prototype._hasSingleNavContent=function(){var c=this.getAggregation("content");while(c.length===1&&c[0]instanceof sap.ui.core.mvc.View){c=c[0].getAggregation("content")}if(c.length===1&&c[0]instanceof sap.m.NavContainer){return true}else{return false}};
sap.m.Popover.prototype._hasSinglePageContent=function(){var c=this.getAggregation("content");while(c.length===1&&c[0]instanceof sap.ui.core.mvc.View){c=c[0].getAggregation("content")}if(c.length===1&&c[0]instanceof sap.m.Page){return true}else{return false}};
sap.m.Popover.prototype._hasSingleScrollableContent=function(){var c=this.getAggregation("content"),i;while(c.length===1&&c[0]instanceof sap.ui.core.mvc.View){c=c[0].getAggregation("content")}if(c.length===1){for(i=0;i<this._scrollContentList.length;i++){if(c[0]instanceof this._scrollContentList[i]){return true}}return false}else{return false}};
sap.m.Popover.prototype._calcOffset=function(o){var O=this.getOffsetX(),i=this.getOffsetY();var p=o.split(" ");return(parseInt(p[0],10)+O)+" "+(parseInt(p[1],10)+i)};
sap.m.Popover.prototype._calcPlacement=function(){var p=this.getPlacement();var P=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.getDomRef():this._oOpenBy;switch(p){case sap.m.PlacementType.Auto:this._calcAuto();break;case sap.m.PlacementType.Vertical:this._calcVertical();break;case sap.m.PlacementType.Horizontal:this._calcHorizontal();break}this._bPosCalced=true;var i=jQuery.inArray(this._oCalcedPos,this._placements);this.oPopup.setPosition(this._myPositions[i],this._atPositions[i],P,this._calcOffset(this._offsets[i]),"fit")};
sap.m.Popover.prototype._calcVertical=function(){var $=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.$():jQuery(this._oOpenBy);var t=$.offset().top-this._marginTop+this.getOffsetY();var p=$.offset().top+$.outerHeight();var b=this._$window.height()-p-this._marginBottom-this.getOffsetY();if(t>b){this._oCalcedPos=sap.m.PlacementType.Top}else{this._oCalcedPos=sap.m.PlacementType.Bottom}};
sap.m.Popover.prototype._calcHorizontal=function(){var $=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.$():jQuery(this._oOpenBy);var l=$.offset().left-this._marginLeft+this.getOffsetX();var p=$.offset().left+$.outerWidth();var r=this._$window.width()-p-this._marginRight-this.getOffsetX();if(l>r){this._oCalcedPos=sap.m.PlacementType.Left}else{this._oCalcedPos=sap.m.PlacementType.Right}};
sap.m.Popover.prototype._calcAuto=function(){if(this._$window.width()>this._$window.height()){if(this._checkHorizontal()){this._calcHorizontal()}else if(this._checkVertical()){this._calcVertical()}else{this._calcBestPos()}}else{if(this._checkVertical()){this._calcVertical()}else if(this._checkHorizontal()){this._calcHorizontal()}else{this._calcBestPos()}}};
sap.m.Popover.prototype._checkHorizontal=function(){var $=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.$():jQuery(this._oOpenBy);var l=$.offset().left-this._marginLeft+this.getOffsetX();var p=$.offset().left+$.outerWidth();var r=this._$window.width()-p-this._marginRight-this.getOffsetX();var a=this.$();var w=a.outerWidth()+this._arrowOffset;if((w<=l)||(w<=r)){return true}};
sap.m.Popover.prototype._checkVertical=function(){var $=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.$():jQuery(this._oOpenBy);var t=$.offset().top-this._marginTop+this.getOffsetY();var p=$.offset().top+$.outerHeight();var b=this._$window.height()-p-this._marginBottom-this.getOffsetY();var a=this.$();var h=a.outerHeight()+this._arrowOffset;if((h<=t)||(h<=b)){return true}};
sap.m.Popover.prototype._calcBestPos=function(){var $=this.$();var h=$.outerHeight();var w=$.outerWidth();var a=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.$():jQuery(this._oOpenBy);var t=a.offset().top-this._marginTop+this.getOffsetY();var p=a.offset().top+a.outerHeight();var b=this._$window.height()-p-this._marginBottom-this.getOffsetY();var l=a.offset().left-this._marginLeft+this.getOffsetX();var P=a.offset().left+a.outerWidth();var r=this._$window.width()-P-this._marginRight-this.getOffsetX();var f=h*w;var A;var c;if((this._$window.height()-this._marginTop-this._marginBottom)>=h){A=h}else{A=this._$window.height()-this._marginTop-this._marginBottom}if((this._$window.width()-this._marginLeft-this._marginRight)>=w){c=w}else{c=this._$window.width()-this._marginLeft-this._marginRight}var L=(A*(l))/f;var R=(A*(r))/f;var T=(c*(t))/f;var B=(c*(b))/f;var m=Math.max(L,R);var M=Math.max(T,B);if(m>M){if(m===L){this._oCalcedPos=sap.m.PlacementType.Left}else if(m===R){this._oCalcedPos=sap.m.PlacementType.Right}}else if(M>m){if(M===T){this._oCalcedPos=sap.m.PlacementType.Top}else if(M===B){this._oCalcedPos=sap.m.PlacementType.Bottom}}else if(M===m){if(this._$window.height()>this._$window.width()){if(M===T){this._oCalcedPos=sap.m.PlacementType.Top}else if(M===B){this._oCalcedPos=sap.m.PlacementType.Bottom}}else{if(m===L){this._oCalcedPos=sap.m.PlacementType.Left}else if(m===R){this._oCalcedPos=sap.m.PlacementType.Right}}}};
sap.m.Popover.prototype._setArrowPosition=function(){var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING)){return}var $=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.$():jQuery(this._oOpenBy),a=this.$(),p=window.parseInt(a.css("border-left-width"),10),P=window.parseInt(a.css("border-right-width"),10),i=window.parseInt(a.css("border-top-width"),10),b=window.parseInt(a.css("border-bottom-width"),10),c=window.parseInt(a.css("top"),10),d=window.parseInt(a.css("left"),10),s=this._oCalcedPos,f=jQuery.sap.byId(this.getId()+"-arrow"),A=f.outerHeight(true),g=a.offset(),o=this.getOffsetX(),O=this.getOffsetY(),w=a.outerWidth(),h=a.outerHeight(),j=jQuery.sap.byId(this.getId()+"-cont"),k=j.children(".sapMPopoverScroll"),S=k.css("position")==="absolute",C=window.parseInt(j.css("margin-left"),10),l=window.parseInt(j.css("margin-right"),10),m=a.children(".sapMPopoverHeader"),n=a.children(".sapMPopoverFooter"),M,q,r,F,t,H=0,u=0;if(m.length>0){H=m.outerHeight(true)}if(n.length>0){u=n.outerHeight(true)}var W=this._$window.scrollLeft(),v=this._$window.scrollTop(),x=this._$window.width(),y=this._$window.height();var z=this._marginLeft,B=this._marginRight,D=this._marginTop,E=this._marginBottom;var L,R,T,G;switch(s){case sap.m.PlacementType.Left:B=x-$.offset().left+this._arrowOffset-this.getOffsetX();R=B;break;case sap.m.PlacementType.Right:z=$.offset().left+$.outerWidth()+this._arrowOffset+this.getOffsetX();L=z;break;case sap.m.PlacementType.Top:E=y-$.offset().top+this._arrowOffset-this.getOffsetY();G=E;break;case sap.m.PlacementType.Bottom:D=$.offset().top+$.outerHeight()+this._arrowOffset+this.getOffsetY();T=D;break}var I=(x-W-B-z)<w,J=(y-v-D-E)<h,K=(g.left-W)<z,N=(x-g.left-w)<B,Q=(g.top-v)<D,U=(y-g.top-h)<E;if(I){L=z;R=B}else{if(K){L=z}else if(N){R=B;if(d-B>z){L=d-B}}}if(J){T=D;G=E}else{if(Q){T=D}else if(U){G=E;if(c-E>D){T=c-E}}}a.css({top:T,bottom:G,left:L,right:R});if(s===sap.m.PlacementType.Left){q=a.offset().left+w-this._marginLeft}else{q=x-a.offset().left-this._marginRight}q-=(p+P);if(S){q-=(C+l)}M=a.height()-H-u-parseInt(j.css("margin-top"),10)-parseInt(j.css("margin-bottom"),10);M=Math.max(M,0);j.css({"max-width":q+"px","height":M+"px"});if(k.outerWidth(true)<=j.width()){k.css("width","100%")}w=a.outerWidth();h=a.outerHeight();if(s===sap.m.PlacementType.Left||s===sap.m.PlacementType.Right){t=$.offset().top-a.offset().top-i+O+0.5*($.outerHeight(false)-f.outerHeight(false));t=Math.max(t,this._arrowOffsetThreshold);t=Math.min(t,h-this._arrowOffsetThreshold-f.outerHeight());f.css("top",t)}else if(s===sap.m.PlacementType.Top||s===sap.m.PlacementType.Bottom){t=$.offset().left-a.offset().left-p+o+0.5*($.outerWidth(false)-f.outerWidth(false));t=Math.max(t,this._arrowOffsetThreshold);t=Math.min(t,w-this._arrowOffsetThreshold-f.outerWidth());f.css("left",t)}switch(s){case sap.m.PlacementType.Left:f.addClass("sapMPopoverArrRight");break;case sap.m.PlacementType.Right:f.addClass("sapMPopoverArrLeft");break;case sap.m.PlacementType.Top:f.addClass("sapMPopoverArrDown");break;case sap.m.PlacementType.Bottom:f.addClass("sapMPopoverArrUp");break}r=f.position();F=n.position();if(s===sap.m.PlacementType.Left||s===sap.m.PlacementType.Right){if((r.top+A)<H){f.addClass("sapMPopoverHeaderAlignArr")}else if((r.top<H)||(n.length&&((r.top+A)>F.top)&&(r.top<F.top))){f.addClass("sapMPopoverCrossArr")}else if(n.length&&(r.top>F.top)){f.addClass("sapMPopoverFooterAlignArr")}}a.css("overflow","visible")};
sap.m.Popover.prototype._isPopupElement=function(d){var p=(this._oOpenBy instanceof sap.ui.core.Control)?this._oOpenBy.getDomRef():this._oOpenBy;return!!(jQuery(d).closest(sap.ui.getCore().getStaticAreaRef()).length)||!!(jQuery(d).closest(p).length)};
sap.m.Popover.prototype._getAnyHeader=function(){if(this.getCustomHeader()){return this.getCustomHeader().addStyleClass("sapMHeader-CTX",true)}else{if(this.getShowHeader()){this._createInternalHeader();return this._internalHeader.addStyleClass("sapMHeader-CTX",true)}}};
sap.m.Popover.prototype._createInternalHeader=function(){if(!this._internalHeader){var t=this;this._internalHeader=new sap.m.Bar(this.getId()+"-intHeader");this.setAggregation("_internalHeader",this._internalHeader);this._internalHeader.addEventDelegate({onAfterRendering:function(){t._restoreFocus()}});return true}else{return false}};
sap.m.Popover.prototype._openAnimation=function(r,R,o){if(sap.m.Popover._bIE9||(jQuery.os.android&&jQuery.os.fVersion<2.4)){o()}else{setTimeout(function(){r.addClass("sapMPopoverTransparent");r.css("display","block");setTimeout(function(){r.bind("webkitTransitionEnd transitionend",function(){jQuery(this).unbind("webkitTransitionEnd transitionend");o()});r.removeClass("sapMPopoverTransparent")},0)},0)}};
sap.m.Popover.prototype._closeAnimation=function(r,R,c){if(sap.m.Popover._bIE9||(jQuery.os.android&&jQuery.os.fVersion<2.4)){c()}else{r.bind("webkitTransitionEnd transitionend",function(){jQuery(this).unbind("webkitTransitionEnd transitionend");setTimeout(function(){c();r.removeClass("sapMPopoverTransparent")},0)}).addClass("sapMPopoverTransparent")}};
sap.m.Popover.prototype._restoreFocus=function(){if(this.isOpen()){var f=this.getInitialFocus()||this.getLeftButton()||this.getRightButton()||this.getId();jQuery.sap.focus(jQuery.sap.domById(f))}};
sap.m.Popover.prototype.setPlacement=function(p){this.setProperty("placement",p,true);var P=jQuery.inArray(p,this._placements);if(P<=3){this._oCalcedPos=p}return this};
sap.m.Popover.prototype.setTitle=function(t){if(t){this.setProperty("title",t,true);if(this._headerTitle){this._headerTitle.setText(t)}else{this._headerTitle=new sap.m.Label(this.getId()+"-title",{text:this.getTitle()});this._createInternalHeader();if(jQuery.os.ios||sap.m.Popover._bOneDesign){this._internalHeader.addContentMiddle(this._headerTitle)}else{this._internalHeader.addContentLeft(this._headerTitle)}}}return this};
sap.m.Popover.prototype.setLeftButton=function(b){var o=this.getLeftButton();if(o===b){return this}this._createInternalHeader();this._leftButton=b;if(b){if(sap.m.Popover._bOneDesign){b.setType(sap.m.ButtonType.Transparent)}if(jQuery.os.ios||sap.m.Popover._bOneDesign){if(o){this._internalHeader.removeAggregation("contentLeft",o,true)}this._internalHeader.addAggregation("contentLeft",b,true)}else{if(o){this._internalHeader.removeAggregation("contentRight",o,true)}this._internalHeader.insertAggregation("contentRight",b,0,true)}this._internalHeader.invalidate()}else{if(jQuery.os.ios||sap.m.Popover._bOneDesign){this._internalHeader.removeContentLeft(o)}else{this._internalHeader.removeContentRight(o)}}return this};
sap.m.Popover.prototype.setRightButton=function(b){var o=this.getRightButton();if(o===b){return this}this._createInternalHeader();this._rightButton=b;if(b){if(sap.m.Popover._bOneDesign){b.setType(sap.m.ButtonType.Transparent)}if(o){this._internalHeader.removeAggregation("contentRight",o,true)}this._internalHeader.insertAggregation("contentRight",b,1,true);this._internalHeader.invalidate()}else{this._internalHeader.removeContentRight(o)}return this};
sap.m.Popover.prototype.setShowHeader=function(v){if(v===this.getShowHeader()||this.getCustomHeader()){return this}if(v){if(this._internalHeader){this._internalHeader.$().show()}}else{if(this._internalHeader){this._internalHeader.$().hide()}}this.setProperty("showHeader",v,true);return this};
sap.m.Popover.prototype.setModal=function(m,M){if(m===this.getModal()){return this}this.oPopup.setModal(m,jQuery.trim("sapMPopoverBLayer "+M||""));this.setProperty("modal",m,true);return this};
sap.m.Popover.prototype.setOffsetX=function(v){var e=this.oPopup.getOpenState(),l,p;this.setProperty("offsetX",v,true);if(!(e===sap.ui.core.OpenState.OPEN)){return this}l=this.oPopup._oLastPosition;p=jQuery.inArray(this.getPlacement(),this._placements);if(p>-1){l.offset=this._calcOffset(this._offsets[p]);this.oPopup._applyPosition(l)}return this};
sap.m.Popover.prototype.setOffsetY=function(v){var e=this.oPopup.getOpenState(),l,p;this.setProperty("offsetY",v,true);if(!(e===sap.ui.core.OpenState.OPEN)){return this}l=this.oPopup._oLastPosition;p=jQuery.inArray(this.getPlacement(),this._placements);if(p>-1){l.offset=this._calcOffset(this._offsets[p]);this.oPopup._applyPosition(l)}return this};
sap.m.Popover.prototype.setEnableScrolling=function(v){this.setHorizontalScrolling(v);this.setVerticalScrolling(v);var o=this.getEnableScrolling();if(o===v){return}this.setProperty("enableScrolling",v,true);return this};
sap.m.Popover.prototype.setVerticalScrolling=function(v){var o=this.getVerticalScrolling();if(o===v){return}this.$().toggleClass("sapMPopoverVerScrollDisabled",!v);this.setProperty("verticalScrolling",v,true);if(this._oScroller){this._oScroller.setVertical(v)}return this};
sap.m.Popover.prototype.setHorizontalScrolling=function(v){var o=this.getHorizontalScrolling();if(o===v){return}this.$().toggleClass("sapMPopoverHorScrollDisabled",!v);this.setProperty("horizontalScrolling",v,true);if(this._oScroller){this._oScroller.setHorizontal(v)}return this};
sap.m.Popover.prototype.getScrollDelegate=function(){return this._oScroller};
sap.m.Popover.prototype.setAggregation=function(a,o,s){if(a==="leftButton"||a==="rightButton"){var f="set"+a.charAt(0).toUpperCase()+a.slice(1);return this[f](o)}else{return sap.ui.core.Control.prototype.setAggregation.apply(this,arguments)}};
sap.m.Popover.prototype.getAggregation=function(a,d){if(a==="leftButton"||a==="rightButton"){var b=this["_"+a];return b||d||null}else{return sap.ui.core.Control.prototype.getAggregation.apply(this,arguments)}};
sap.m.Popover.prototype.destroyAggregation=function(a,s){if(a==="leftButton"||a==="rightButton"){var b=this["_"+a];if(b){b.destroy();this["_"+a]=null}return this}else{return sap.ui.core.Control.prototype.destroyAggregation.apply(this,arguments)}};
sap.m.Popover.prototype.forceInvalidate=sap.ui.core.Control.prototype.invalidate;
sap.m.Popover.prototype.invalidate=function(o){if(this.isOpen()){this.forceInvalidate()}};