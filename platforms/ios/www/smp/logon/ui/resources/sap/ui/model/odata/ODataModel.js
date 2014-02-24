/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.model.odata.ODataModel");jQuery.sap.require("sap.ui.thirdparty.datajs");jQuery.sap.require("sap.ui.thirdparty.URI");jQuery.sap.require("sap.ui.model.Model");jQuery.sap.require("sap.ui.model.odata.ODataPropertyBinding");jQuery.sap.require("sap.ui.model.odata.ODataListBinding");jQuery.sap.require("sap.ui.model.odata.ODataMetadata");sap.ui.model.Model.extend("sap.ui.model.odata.ODataModel",{constructor:function(s,j,u,p,h,t,w,l){sap.ui.model.Model.apply(this,arguments);if(typeof j==="object"){u=j.user;p=j.password;h=j.headers;t=j.tokenHandling;l=j.loadMetadataAsync;w=j.withCredentials;this.sMaxDataServiceVersion=j.maxDataServiceVersion;this.bUseBatch=j.useBatch;j=j.json}this.sDefaultBindingMode=sap.ui.model.BindingMode.OneWay;this.mSupportedBindingModes={"OneWay":true,"OneTime":true,"TwoWay":true};this.bCountSupported=true;this.bJSON=j;this.bCache=true;this.oRequestQueue={};this.aBatchOperations=[];this.oHandler;this.sETag='';this.bTokenHandling=t!==false;this.bWithCredentials=w===true;this.oHeaders={};this.setHeaders(h);this.oData={};this.oMetadata={};if(s.indexOf("?")==-1){this.sServiceUrl=s}else{var U=s.split("?");this.sServiceUrl=U[0];this.sUrlParams=U[1]}this.sServiceUrl=this.sServiceUrl.replace(/\/$/,"");this.sUser=u;this.sPassword=p;this.oHeaders["Accept-Language"]=sap.ui.getCore().getConfiguration().getLanguage();if(!l===true){l=false}this.oMetadata=new sap.ui.model.odata.ODataMetadata(this,l);if(this.bJSON){if(this.sMaxDataServiceVersion==="3.0"){this.oHeaders["Accept"]="application/json;odata=fullmetadata"}else{this.oHeaders["Accept"]="application/json"}this.oHandler=OData.jsonHandler}else{this.oHeaders["Accept"]="application/atom+xml,application/atomsvc+xml,application/xml";this.oHandler=OData.atomHandler}this.oHeaders["MaxDataServiceVersion"]="2.0";if(this.sMaxDataServiceVersion){this.oHeaders["MaxDataServiceVersion"]=this.sMaxDataServiceVersion}this.oHeaders["DataServiceVersion"]="2.0"},metadata:{publicMethods:["create","remove","update","submitChanges","getServiceMetadata","read","hasPendingChanges","refresh","resetChanges","isCountSupported","setCountSupported","forceNoCache","setProperty","refreshSecurityToken","setHeaders","getHeaders","formatValue, setUseBatch"]}});sap.ui.model.odata.ODataModel.M_EVENTS={RejectChange:"rejectChange",MetadataLoaded:"metadataLoaded"};
sap.ui.model.odata.ODataModel.prototype.fireRejectChange=function(a){this.fireEvent("rejectChange",a);return this};
sap.ui.model.odata.ODataModel.prototype.attachRejectChange=function(d,f,l){this.attachEvent("rejectChange",d,f,l);return this};
sap.ui.model.odata.ODataModel.prototype.detachRejectChange=function(f,l){this.detachEvent("rejectChange",f,l);return this};
sap.ui.model.odata.ODataModel.prototype.fireMetadataLoaded=function(a){this.fireEvent("metadataLoaded",a);return this};
sap.ui.model.odata.ODataModel.prototype.attachMetadataLoaded=function(d,f,l){this.attachEvent("metadataLoaded",d,f,l);return this};
sap.ui.model.odata.ODataModel.prototype.detachMetadataLoaded=function(f,l){this.detachEvent("metadataLoaded",f,l);return this};
sap.ui.model.odata.ODataModel.prototype._createRequest=function(p,u,a,c){var U=this.sServiceUrl;if(p){if(!jQuery.sap.startsWith(p,"/")){U+="/"}U+=p}if(!u){u=[]}if(this.sUrlParams){u.push(this.sUrlParams)}if(u.length>0){U+="?"+u.join("&")}if(c===undefined){c=true}if(c===false){var t=jQuery.now();var r=U.replace(/([?&])_=[^&]*/,"$1_="+t);U=r+((r===U)?(/\?/.test(U)?"&":"?")+"_="+t:"")}var C={};jQuery.extend(C,this.mCustomHeaders,this.oHeaders);return{requestUri:U,headers:C,async:a,user:this.sUser,password:this.sPassword,withCredentials:this.bWithCredentials}};
sap.ui.model.odata.ODataModel.prototype._loadData=function(p,P,s,e,c,C,h){var r,R=this._createRequest(p,P,true,C||this.bCache);var t=this;function _(D,o){var f=D;if(!f){jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: "+o.requestUri)}if(t.bUseBatch){var E=t._getBatchErrors(D);if(E.length>0){a(E[0]);return false}if(f.__batchResponses&&f.__batchResponses.length>0){f=f.__batchResponses[0].data}else{jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: "+o.requestUri)}}d=d.concat(f.results);if(f.__next){var u=new URI(f.__next);R.requestUri=u.absoluteTo(o.requestUri).toString();b(R)}else{jQuery.extend(f.results,d);if(f.results&&!jQuery.isArray(f.results)){f=f.results}t._importData(f);if(s){s(f)}t.sChangeKey=null;t.checkUpdate(c);t.fireRequestCompleted({url:R.requestUri,type:"GET",async:R.async,info:"Accept headers:"+t.oHeaders["Accept"],success:true})}}function a(E){if(e){e()}var m=t._handleError(E);t.sChangeKey=null;t.fireRequestCompleted({url:R.requestUri,type:"GET",async:R.async,info:"Accept headers:"+t.oHeaders["Accept"],success:false,errorobject:m});t.fireRequestFailed(m)}function b(R){if(t.bUseBatch){var f=function(){t.clearBatch();var u=URI.parse(R.requestUri).query;var i=p.replace(/\/$/,"");i+=u?"?"+u:"";var o=t.createBatchOperation(i,"GET");t.addBatchReadOperations([o]);r=t.submitBatch(_,a,R.async)};if(t.bTokenHandling&&!t.bTokenRequested){var g=function(D,o){if(o){R.headers["x-csrf-token"]=o.headers["x-csrf-token"]}f()};t.refreshSecurityToken(g,a,false)}else{f()}}else{r=OData.read(R,_,a,t.oHandler,undefined,t.oMetadata.getServiceMetadata())}if(h){h(r)}}var d=[];this.fireRequestSent({url:R.requestUri,type:"GET",async:R.async,info:"Accept headers:"+this.oHeaders["Accept"]});b(R)};
sap.ui.model.odata.ODataModel.prototype._importData=function(d){var t=this,l,k,r,e;if(d.results){l=[];jQuery.each(d.results,function(i,a){l.push(t._importData(a))});return l}else{k=this._getKey(d);e=this.oData[k];if(!e){e=d;this.oData[k]=e}jQuery.each(d,function(n,p){if(p&&(p.__metadata&&p.__metadata.uri||p.results)&&!p.__deferred){r=t._importData(p);if(jQuery.isArray(r)){e[n]={__list:r}}else{e[n]={__ref:r}}}else{e[n]=p}});return k}};
sap.ui.model.odata.ODataModel.prototype._removeReferences=function(d){var t=this,l;if(d.results){l=[];jQuery.each(d.results,function(i,e){l.push(t._removeReferences(e))});return l}else{jQuery.each(d,function(p,c){if(c){if(c["__ref"]||c["__list"]){delete d[p]}}});return d}};
sap.ui.model.odata.ODataModel.prototype._restoreReferences=function(d){var t=this,c,l,r=[];if(d.results){l=[];jQuery.each(d.results,function(i,e){l.push(t._restoreReferences(e))});return l}else{jQuery.each(d,function(p,c){if(c&&c["__ref"]){var C=t._getObject("/"+c["__ref"]);if(C){delete c["__ref"];d[p]=C;t._restoreReferences(C)}}else if(c&&c["__list"]){jQuery.each(c["__list"],function(j,e){var C=t._getObject("/"+c["__list"][j]);if(C){r.push(C);t._restoreReferences(C)}});delete c["__list"];c.results=r;r=[]}});return d}};
sap.ui.model.odata.ODataModel.prototype.removeData=function(){this.oData={};this.aBindings=[]};
sap.ui.model.odata.ODataModel.prototype.checkUpdate=function(c,f){var b=this.aBindings.slice(0);jQuery.each(b,function(i,B){if((!c||B.getContext()==c)||f){B.checkUpdate(f)}})};
sap.ui.model.odata.ODataModel.prototype.bindProperty=function(p,c,P){var b=new sap.ui.model.odata.ODataPropertyBinding(this,p,c,P);return b};
sap.ui.model.odata.ODataModel.prototype.bindList=function(p,c,s,f,P){var b=new sap.ui.model.odata.ODataListBinding(this,p,c,s,f,P);return b};
sap.ui.model.odata.ODataModel.prototype.createBindingContext=function(p,c,P,C,f){if(typeof c=="function"){C=c;c=null}if(typeof P=="function"){C=P;P=null}var d=this._getObject(p,c),k,n,t=this;if(d&&!f){k=this._getKey(d);n=this.getContext('/'+k);C(n)}else{var i=!jQuery.sap.startsWith(p,"/"),F=this.resolve(p,c);if(F){var a=[],s=this.createCustomParams(P);if(s){a.push(s)}this._loadData(F,a,function(d){k=d?t._getKey(d):undefined;if(k&&c&&i){var b=c.getPath();b=b.substr(1);t.oData[b][p]={__ref:k}}n=t.getContext('/'+k);C(n)},function(){C()})}else{C()}}};
sap.ui.model.odata.ODataModel.prototype.destroyBindingContext=function(c){};
sap.ui.model.odata.ODataModel.prototype.createCustomParams=function(p){var c=[],C,s={expand:true,select:true};for(var n in p){if(n in s){c.push("$"+n+"="+jQuery.sap.encodeURL(p[n]))}if(n=="custom"){C=p[n];for(var n in C){if(n.indexOf("$")==0){jQuery.sap.log.warning("Trying to set OData parameter "+n+" as custom query option!")}else{c.push(n+"="+jQuery.sap.encodeURL(C[n]))}}}}return c.join("&")};
sap.ui.model.odata.ODataModel.prototype.setCountSupported=function(c){this.bCountSupported=c};
sap.ui.model.odata.ODataModel.prototype.isCountSupported=function(){return this.bCountSupported};
sap.ui.model.odata.ODataModel.prototype._getKey=function(e){var u=e.__metadata.uri;return u.substr(u.lastIndexOf("/")+1)};
sap.ui.model.odata.ODataModel.prototype.getProperty=function(p,c,i){var v=this._getObject(p,c);if(i==null||i==undefined){return v}if(!jQuery.isPlainObject(v)){return v}v=jQuery.extend(true,{},v);if(i==true){return this._restoreReferences(v)}else{return this._removeReferences(v)}};
sap.ui.model.odata.ODataModel.prototype._getObject=function(p,c){var n=this.isLegacySyntax()?this.oData:null,k;if(c){k=c.getPath();k=k.substr(1);n=this.oData[k]}if(!p){return n}var P=p.split("/"),i=0;if(!P[0]){n=this.oData;i++}while(n&&P[i]){n=n[P[i]];if(n){if(n.__ref){n=this.oData[n.__ref]}else if(n.__list){n=n.__list}else if(n.__deferred){n=null}}i++}return n};
sap.ui.model.odata.ODataModel.prototype.refreshSecurityToken=function(s,e,a){var t=this;this.oHeaders["x-csrf-token"]="Fetch";if(a==undefined){a=false}var r=this._createRequest("/",null,a);function _(d,R){if(R){t._convertHeaders("x-csrf-token",R.headers);t.oHeaders["x-csrf-token"]=R.headers["x-csrf-token"];t.bTokenRequested=true}if(s){s(d,R)}}function b(E){t._handleError(E);t.bTokenRequested=false;if(e){e(E)}}return OData.read(r,_,b,this.oHandler,null,this.getServiceMetadata())};
sap.ui.model.odata.ODataModel.prototype.refresh=function(){var b=this.aBindings.slice(0);jQuery.each(b,function(i,B){B._refresh()})};
sap.ui.model.odata.ODataModel.prototype._submitChange=function(r,s,e){var t=this;function _(d,R){if(t.bUseBatch){var E=t._getBatchErrors(d);if(E.length>0){a(E[0]);return false}if(d.__batchResponses&&d.__batchResponses.length>0){d=d.__batchResponses[0].data}}if(t.sChangeKey&&r.requestUri===t.sChangeKey){t.sChangeKey=null}var o=r;jQuery.each(t.oRequestQueue,function(n,r){r===o?delete t.oRequestQueue[n]:false;delete t.oData[n];delete t.mContexts["/"+n]});if(t._isDataStored(r)||r.method=="POST"){t.refresh()}if(s){s(d,R)}}function a(E){t._handleError(E);if(t.sChangeKey&&r.requestUri===t.sChangeKey){t.sChangeKey=null;delete t.oRequestQueue[r.requestUri];t.refresh()}if(e){e(E)}}if(this.bTokenHandling&&!this.bTokenRequested){var b=function(d,R){if(R){r.headers["x-csrf-token"]=R.headers["x-csrf-token"]}c()};this.refreshSecurityToken(b,a,false)}else{c()}function c(){if(t.bUseBatch){t.clearBatch();var R=t._getBatchUrl(r.requestUri);if(r.method==="POST"&&r.headers["x-http-method"]==="MERGE"){r.method="MERGE"}var C=t.createBatchOperation(R,r.method,r.data);t.addBatchChangeOperations([C]);return t.submitBatch(_,a,r.async)}else{return OData.request(r,_,a,t.oHandler,undefined,t.getServiceMetadata())}}};
sap.ui.model.odata.ODataModel.prototype._submitBatch=function(r,s,e){var t=this,E=[];function _(d,R){t.aBatchOperations=[];E=t._getBatchErrors(d);if(s){s(d,R,E)}}function a(o){t._handleError(o);t.aBatchOperations=[];if(e){e(o)}}return OData.request(r,_,a,OData.batchHandler,undefined,this.getServiceMetadata())};
sap.ui.model.odata.ODataModel.prototype._getBatchErrors=function(d){var e=[],E;jQuery.each(d.__batchResponses,function(i,o){if(o.message){E="The following problem occurred: "+o.message;if(o.response){E+=o.response.statusCode+","+o.response.statusText+","+o.response.body}e.push(o);jQuery.sap.log.fatal(E)}if(o.__changeResponses){jQuery.each(o.__changeResponses,function(i,c){if(c.message){E="The following problem occurred: "+c.message;if(c.response){E+=c.response.statusCode+","+c.response.statusText+","+c.response.body}e.push(c);jQuery.sap.log.fatal(E)}})}});return e};
sap.ui.model.odata.ODataModel.prototype._handleError=function(e){var p={},h,t=this;var E="The following problem occurred: "+e.message;p.message=e.message;if(e.response){this._convertHeaders("x-csrf-token",e.response.headers);if(e.response.statusCode=='403'&&e.response.headers["x-csrf-token"]){this.oHeaders["x-csrf-token"]=e.response.headers["x-csrf-token"];if(e.response.headers["x-csrf-token"].toLowerCase()==="required"&&!this.bRefreshing){this.bRefreshing=true;h=function(){t.bRefreshing=false};this.refreshSecurityToken(h,h)}}E+=e.response.statusCode+","+e.response.statusText+","+e.response.body;p.statusCode=e.response.statusCode;p.statusText=e.response.statusText;p.responseText=e.response.body}jQuery.sap.log.fatal(E);if(e.response&&e.response.statusCode!='412'){this.refresh()}return p};
sap.ui.model.odata.ODataModel.prototype.getData=function(p,c,i){return this.getProperty(p,c,i)};
sap.ui.model.odata.ODataModel.prototype._getChangeUrl=function(p,c){var u,k;if(c){k=c.getPath();k=k.substr(1)}p=p.replace(/^\/|\/$/g,"");if(c&&p){u=this.sServiceUrl+'/'+k+'/'+p}else if(!c&&p){u=this.sServiceUrl+'/'+p}else{u=this.sServiceUrl+'/'+k}return u};
sap.ui.model.odata.ODataModel.prototype._setCurrentETag=function(p,P,e){var c,E;if(e){c=e}else{if(P&&P.__metadata){c=P.__metadata.etag}else if(p){E=p.replace(this.sServiceUrl+'/','');if(this.oData.hasOwnProperty(E)){c=this.getProperty('/'+E+'/__metadata/etag')}}}this.sETag=c};
sap.ui.model.odata.ODataModel.prototype._createChangeRequest=function(u,p,m,a,e){var c={};jQuery.extend(c,this.mCustomHeaders,this.oHeaders);this._setCurrentETag(u,p,e);if(this.sETag){c["If-Match"]=this.sETag}if(this.bJSON&&m!="DELETE"&&this.sMaxDataServiceVersion==="2.0"){c["Content-Type"]="application/json"}if(m=="MERGE"){c["x-http-method"]="MERGE";m="POST"}return{headers:c,requestUri:u,method:m,data:p,user:this.sUser,password:this.sPassword,withCredentials:this.bWithCredentials,async:a}};
sap.ui.model.odata.ODataModel.prototype._isDataStored=function(r){var p,d;p=r.requestUri.replace(this.sServiceUrl,'');d=this._getObject(p);if(d){return true}return false};
sap.ui.model.odata.ODataModel.prototype.update=function(p,d,P){var s,e,m,r,u,c,E;if(P instanceof sap.ui.model.Context||arguments.length>3){c=P;s=arguments[3];e=arguments[4];m=arguments[5]}else{if(P instanceof Object){c=P.oContext;s=P.fnSuccess;e=P.fnError;m=P.bMerge;E=P.sETag}}u=this._getChangeUrl(p,c);if(m){r=this._createChangeRequest(u,d,"MERGE",false,E)}else{r=this._createChangeRequest(u,d,"PUT",false,E)}this.oRequestQueue[r.requestUri]=r;return this._submitChange(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.create=function(p,d,c,s,e){var r,u;u=this._getChangeUrl(p,c);r=this._createChangeRequest(u,d,"POST",false);this.oRequestQueue[r.requestUri]=r;return this._submitChange(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.remove=function(p,P){var c,s,e,r,u,E;if((P&&P instanceof sap.ui.model.Context)||arguments[2]){c=P;s=arguments[2];e=arguments[3]}else{if(P){c=P.oContext;s=P.fnSuccess;e=P.fnError;E=P.sETag}}u=this._getChangeUrl(p,c);r=this._createChangeRequest(u,null,"DELETE",false,E);this.oRequestQueue[r.requestUri]=r;return this._submitChange(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.callFunction=function(f,m,p,c,s,e){var r,u;var t=this;var U={};var F=this.oMetadata._getFunctionImportMetadata(f,m);if(F){u=this._getChangeUrl(f,c);var a=URI(u);if(F.parameter!=null){jQuery.each(p,function(P,o){var b=jQuery.grep(F.parameter,function(g){return g.name==P&&g.mode=="In"});if(b!=null&&b.length>0){var d=b[0];U[P]=t.formatValue(o,d.type)}else{jQuery.sap.log.warning("Parameter "+P+" is not defined for function call "+f+"!")}})}if(m==="GET"){t.read(f,c,U,true,s,e)}else{jQuery.each(U,function(P,o){a.addQuery(P,o)});r=this._createChangeRequest(a.toString(),null,m,false);this.oRequestQueue.push(r);return this._submitChange(r,s,e)}}};
sap.ui.model.odata.ODataModel.prototype.read=function(p,c,u,a,s,e){var r,U,t=this,b=[];U=this._getChangeUrl(p,c);if(u&&!jQuery.isArray(u)){jQuery.each(u,function(P,d){if(jQuery.type(d)==="string"){d=jQuery.sap.encodeURL(d)}b.push(jQuery.sap.encodeURL(P)+"="+d)})}else{b=u}r=this._createRequest(U.replace(this.sServiceUrl,''),b,a);if(this.bUseBatch){this.clearBatch();var R=this._getBatchUrl(r.requestUri);var o=t.createBatchOperation(R,"GET");t.addBatchReadOperations([o]);var _=function(d,f){var E=t._getBatchErrors(d);if(E.length>0){if(e){e(E[0])}return false}if(d.__batchResponses&&d.__batchResponses.length>0){d=d.__batchResponses[0].data}else{jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: "+f.requestUri)}if(s){s(d,f)}};return t.submitBatch(_,e,r.async)}else{return OData.read(r,s,e,this.oHandler,null,this.getServiceMetadata())}};
sap.ui.model.odata.ODataModel.prototype._getBatchUrl=function(u){var e=u.replace(this.sServiceUrl,'');var r=e.replace(/\/$/,"");return r};
sap.ui.model.odata.ODataModel.prototype.createBatchOperation=function(p,m,d,P){var c={},e;jQuery.extend(c,this.mCustomHeaders,this.oHeaders);if(jQuery.sap.startsWith(p,"/")){p=p.substr(1)}if(P){e=P.sETag}if(m!="GET"){this._setCurrentETag(p,d,e);if(this.sETag){c["If-Match"]=this.sETag}}if(this.bJSON){if(m!="DELETE"&&m!="GET"&&this.sMaxDataServiceVersion==="2.0"){c["Content-Type"]="application/json"}}else{c["Content-Type"]="application/atom+xml"}var r={requestUri:p,method:m.toUpperCase(),headers:c};if(d){r.data=d}return r};
sap.ui.model.odata.ODataModel.prototype.addBatchReadOperations=function(r){if(!jQuery.isArray(r)||r.length<=0){jQuery.sap.log.warning("No array with batch operations provided!");return false}var t=this;jQuery.each(r,function(i,R){if(R.method!="GET"){jQuery.sap.log.warning("Batch operation should be a GET operation!");return false}t.aBatchOperations.push(R)})};
sap.ui.model.odata.ODataModel.prototype.addBatchChangeOperations=function(c){if(!jQuery.isArray(c)||c.length<=0){return false}jQuery.each(c,function(i,C){if(C.method!="POST"&&C.method!="PUT"&&C.method!="MERGE"&&C.method!="DELETE"){jQuery.sap.log.warning("Batch operation should be a POST/PUT/MERGE/DELETE operation!");return false}});this.aBatchOperations.push({__changeRequests:c})};
sap.ui.model.odata.ODataModel.prototype.clearBatch=function(){this.aBatchOperations=[]};
sap.ui.model.odata.ODataModel.prototype.submitBatch=function(s,e,a){var r,u;if(!(typeof(s)=="function")){var o=a;var O=e;a=s;s=O;e=o}if(this.aBatchOperations.length<=0){jQuery.sap.log.warning("No batch operations in batch. No request will be triggered!");return false}u=this.sServiceUrl+"/$batch";var c={};jQuery.extend(c,this.mCustomHeaders,this.oHeaders);delete c["Content-Type"];var p={};p.__batchRequests=this.aBatchOperations;var r={headers:c,requestUri:u,method:"POST",data:p,user:this.sUser,password:this.sPassword,withCredentials:this.bWithCredentials,async:a};return this._submitBatch(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.getServiceMetadata=function(){if(this.oMetadata.getServiceMetadata){return this.oMetadata.getServiceMetadata()}return undefined};
sap.ui.model.odata.ODataModel.prototype.submitChanges=function(s,e,p){var r,P,t=this,a,E;if(this.sChangeKey){a=this.sChangeKey.replace(this.sServiceUrl,'');P=this._getObject(a);if(jQuery.isPlainObject(P)){P=jQuery.extend(true,{},P);jQuery.each(P,function(c,o){if(o&&o.__deferred){delete P[c]}});P=this._removeReferences(P)}if(p){E=p.sETag}r=this._createChangeRequest(this.sChangeKey,P,"MERGE",true,E);this.oRequestQueue[this.sChangeKey]=r}function _(d,R){if(s){s(d,R)}}function b(o){if(e){e(o)}}jQuery.each(this.oRequestQueue,function(k,r){r.data._bCreate?delete r.data._bCreate:false;t._submitChange(r,_,b)});return undefined};
sap.ui.model.odata.ODataModel.prototype.resetChanges=function(s,e){var p;if(this.sChangeKey){p=this.sChangeKey.replace(this.sServiceUrl,'');this._loadData(p,null,s,e)}};
sap.ui.model.odata.ODataModel.prototype.setProperty=function(p,v,c){var P,e={},C=this._getChangeUrl(p,c),o=p.substring(0,p.lastIndexOf("/")),s=false;if(!this.resolve(p,c)){return s}C=C.replace(this.sServiceUrl+'/','');C=C.substring(0,C.indexOf("/")),C=this.sServiceUrl+'/'+C,P=p.substr(p.lastIndexOf("/")+1);e=this._getObject(o,c);if(e._bCreate){e[P]=v;s=true;this.checkUpdate()}else{if(!this.sChangeKey){this.sChangeKey=C}if(this.sChangeKey==C){e[P]=v;s=true;this.checkUpdate()}else{this.fireRejectChange({rejectedValue:v,oldValue:e[P]})}}return s};
sap.ui.model.odata.ODataModel.prototype._isHeaderPrivate=function(h){switch(h.toLowerCase()){case"accept":case"accept-language":case"x-csrf-token":case"maxdataserviceversion":case"dataserviceversion":return true;break;default:return false}};
sap.ui.model.odata.ODataModel.prototype.setHeaders=function(h){var c={},t=this;if(h){jQuery.each(h,function(H,s){if(t._isHeaderPrivate(H)){jQuery.sap.log.warning("Not allowed to modify private header: "+H)}else{c[H]=s}});this.mCustomHeaders=c}else{this.mCustomHeaders={}}};
sap.ui.model.odata.ODataModel.prototype.getHeaders=function(){return jQuery.extend({},this.mCustomHeaders,this.oHeaders)};
sap.ui.model.odata.ODataModel.prototype._convertHeaders=function(c,h){var H,o;for(H in h){if(H!==c&&H.toLowerCase()===c.toLowerCase()){o=h[H];delete h[H];h[c]=o;break}}};
sap.ui.model.odata.ODataModel.prototype.hasPendingChanges=function(){return this.sChangeKey!=null};
sap.ui.model.odata.ODataModel.prototype.updateBindings=function(f){this.checkUpdate(null,f)};
sap.ui.model.odata.ODataModel.prototype.forceNoCache=function(f){this.bCache=!f};
sap.ui.model.odata.ODataModel.prototype.setTokenHandlingEnabled=function(t){this.bTokenHandling=t};
sap.ui.model.odata.ODataModel.prototype.setUseBatch=function(u){this.bUseBatch=u};
sap.ui.model.odata.ODataModel.prototype.formatValue=function(v,t){if(!this.oDateTimeFormat){this.oDateTimeFormat=sap.ui.core.format.DateFormat.getDateInstance({pattern:"'datetime'''yyyy-MM-dd'T'HH:mm:ss''"});this.oDateTimeOffsetFormat=sap.ui.core.format.DateFormat.getDateInstance({pattern:"'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''"});this.oTimeFormat=sap.ui.core.format.DateFormat.getTimeInstance({pattern:"'time'''HH:mm:ss''"})}var V;switch(t){case"Edm.String":V="'"+String(v).replace(/'/g,"''")+"'";break;case"Edm.Time":V="time'"+v+"'";break;case"Edm.DateTime":V=this.oDateTimeFormat.format(new Date(v),true);break;case"Edm.DateTimeOffset":V=this.oDateTimeOffsetFormat.format(new Date(v),true);break;case"Edm.Guid":V="guid'"+v+"'";break;case"Edm.Decimal":V=v+"M";break;case"Edm.Int64":V=v+"L";break;case"Edm.Single":V=v+"f";break;case"Edm.Binary":V="binary'"+v+"'";break;default:V=new String(v);break}return V};
sap.ui.model.odata.ODataModel.prototype.deleteCreatedEntry=function(c){if(c){var p=c.getPath();delete this.mContexts[p];if(jQuery.sap.startsWith(p,"/")){p=p.substr(1)}delete this.oRequestQueue[p];delete this.oData[p]}};
sap.ui.model.odata.ODataModel.prototype.createEntry=function(c,p){var e={};if(typeof p==="object"&&!jQuery.isArray(p)){e=p}else{var E=this.oMetadata._getEntityTypeByPath(c);if(!E){return undefined}for(var i=0;i<E.property.length;i++){var P=E.property[i];var t=P.type.split('.');var b=jQuery.inArray(P.name,p)>-1;if(!p||b){e[P.name]=this._createPropertyValue(t);if(b){p.splice(p.indexOf(P.name),1)}}}if(p){}}e._bCreate=true;var k=c+"('"+jQuery.sap.uid()+"')";this.oData[k]=e;e.__metadata={type:""+this.oMetadata._getEntityTypeName(c)};var C=this._getChangeUrl('/'+c);var r=this._createChangeRequest(C,e,"POST",true);this.oRequestQueue[k]=r;return this.getContext("/"+k)};
sap.ui.model.odata.ODataModel.prototype._createPropertyValue=function(t){var n=t[0];var T=t[1];if(n.toUpperCase()!=='EDM'){var c={};var C=this.oMetadata._getObjectMetadata("complexType",T,n);for(var i=0;i<C.property.length;i++){var p=C.property[i];var t=p.type.split('.');c[p.name]=this._createPropertyValue(t)}return c}else{return this._getDefaultPropertyValue(T,n)}};
sap.ui.model.odata.ODataModel.prototype._getDefaultPropertyValue=function(t,n){return undefined};
