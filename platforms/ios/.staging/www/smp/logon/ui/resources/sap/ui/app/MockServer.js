/*
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.app.MockServer");jQuery.sap.require("sap.ui.base.ManagedObject");jQuery.sap.require("sap.ui.thirdparty.sinon");if(jQuery.browser.msie){jQuery.sap.require("sap.ui.thirdparty.sinon-ie")}(function(){sap.ui.base.ManagedObject.extend("sap.ui.app.MockServer",{constructor:function(i,s,S){sap.ui.base.ManagedObject.apply(this,arguments);sap.ui.app.MockServer._aServers.push(this)},metadata:{properties:{rootUri:"string",requests:{type:"object[]",defaultValue:[]}}},_oServer:null,_aFilter:null});sap.ui.app.MockServer.prototype.start=function(){this._oServer=sap.ui.app.MockServer._getInstance();this._aFilters=[];var r=this.getRequests();var l=r.length;for(var i=0;i<l;i++){var R=r[i];this._addRequestHandler(R.method,R.path,R.response)}};sap.ui.app.MockServer.prototype.stop=function(){if(this.isStarted()){this._removeAllRequestHandlers();this._removeAllFilters();this._oServer=null}};sap.ui.app.MockServer.prototype.isStarted=function(){return!!this._oServer};sap.ui.app.MockServer.prototype._loadMetadata=function(m){var M=jQuery.sap.sjax({url:m,dataType:"xml"}).data;return M};sap.ui.app.MockServer.prototype._findEntitySets=function(m){var e={};jQuery(m).find("EntitySet").each(function(i,E){var $=jQuery(E);var a=/((.*)\.)?(.*)/.exec($.attr("EntityType"));e[$.attr("Name")]={"name":$.attr("Name"),"schema":a[2],"type":a[3],"keys":[],"navprops":{}}});var r=function(R,f){var E=jQuery(jQuery(m).find("End[Role="+R+"][EntitySet]")).attr("EntitySet");var p=[];jQuery(m).find("[Role="+R+"]").find("PropertyRef").each(function(i,P){p.push(jQuery(P).attr("Name"))});return{"role":R,"entitySet":E,"propRef":p}};jQuery.each(e,function(E,o){var k=jQuery(m).find("EntityType[Name="+o.type+"] PropertyRef");jQuery.each(k,function(i,p){o.keys.push(jQuery(p).attr("Name"))});var n=jQuery(m).find("EntityType[Name="+o.type+"] NavigationProperty");jQuery.each(n,function(i,N){var $=jQuery(N);o.navprops[$.attr("Name")]={"name":$.attr("Name"),"from":r($.attr("FromRole")),"to":r($.attr("ToRole"))}})});return e};sap.ui.app.MockServer.prototype._findEntityTypes=function(m){var e={};jQuery(m).find("EntityType").each(function(i,E){var $=jQuery(E);e[$.attr("Name")]={"name":$.attr("Name"),"properties":[],"keys":[]};$.find("Property").each(function(i,p){var P=jQuery(p);var a=P.attr("Type").split(".");e[$.attr("Name")].properties.push({"schema":a[0],"type":a[1],"name":P.attr("Name"),"precision":P.attr("Precision"),"scale":P.attr("Scale")})});$.find("PropertyRef").each(function(i,k){var K=jQuery(k);var p=K.attr("Name");e[$.attr("Name")].keys.push(p)})});return e};sap.ui.app.MockServer.prototype._findComplexTypes=function(m){var c={};jQuery(m).find("ComplexType").each(function(i,C){var $=jQuery(C);c[$.attr("Name")]={"name":$.attr("Name"),"properties":[]};$.find("Property").each(function(i,p){var P=jQuery(p);var a=P.attr("Type").split(".");c[$.attr("Name")].properties.push({"schema":a[0],"type":a[1],"name":P.attr("Name"),"precision":P.attr("Precision"),"scale":P.attr("Scale")})})});return c};sap.ui.app.MockServer.prototype._createKeysString=function(k,e){var K="";jQuery.each(k,function(i,s){if(K){K+=","}K+=s+"='"+e[s]+"'"});return K};sap.ui.app.MockServer.prototype._loadMockdata=function(e,b){var t=this,E={},m={};if(jQuery.sap.endsWith(b,".json")){var r=jQuery.sap.sjax({url:b,dataType:"json"});if(r.success){E=r.data}else{jQuery.sap.log.error("The mockdata for all the entity types could not be found at \""+b+"\"!")}}else{jQuery.each(e,function(s,o){if(!E[o.type]){var a=b+o.type+".json";var r=jQuery.sap.sjax({url:a,dataType:"json"});if(r.success){E[o.type]=r.data}else{jQuery.sap.log.error("The mockdata for entity type \""+o.type+"\" could not be found at \""+b+"\"!")}}})}jQuery.each(e,function(s,o){m[s]=[];if(E[o.type]){jQuery.each(E[o.type],function(i,a){m[s].push(jQuery.extend(true,{},a))})}if(m[s].length>0){t._enhanceWithMetadata(o,m[s])}});return m};sap.ui.app.MockServer.prototype._enhanceWithMetadata=function(e,m){if(m){var t=this,r=this.getRootUri(),E=e&&e.name;jQuery.each(m,function(i,o){o.__metadata={uri:r+E+"("+t._createKeysString(e.keys,o)+")"};jQuery.each(e.navprops,function(k,n){o[k]={__deferred:{uri:r+E+"("+t._createKeysString(e.keys,o)+")/"+k}}})})}};sap.ui.app.MockServer.prototype._generateDataFromEntity=function(e,I,c){var E={};for(var i=0;i<e.properties.length;i++){var p=e.properties[i];var P="";if(p.schema=="Edm"){if(p.type=="String"){P=e.name+"_"+I+"_"+p.name}else if(p.type=="DateTime"){var d=new Date();d.setFullYear(2000+Math.floor(Math.random()*20));d.setDate(Math.floor(Math.random()*30));d.setMonth(Math.floor(Math.random()*12));P="/Date("+d.getTime()+")/"}else if(p.type=="Int32"){P=Math.floor(Math.random()*10000)}else if(p.type=="Decimal"){P=Math.floor(Math.random()*1000000)/100}}else{P=this._generateDataFromEntity(c[p.type],I)}E[p.name]=P}return E};sap.ui.app.MockServer.prototype._generateDataFromEntitySet=function(e,E,c){var o=E[e.type];var m=[];for(var i=0;i<100;i++){m.push(this._generateDataFromEntity(o,i,c))}return m};sap.ui.app.MockServer.prototype._generateMockdata=function(e,m){var t=this,r=this.getRootUri(),M={};var E=this._findEntityTypes(m);var c=this._findComplexTypes(m);jQuery.each(e,function(s,o){M[s]=t._generateDataFromEntitySet(o,E,c);jQuery.each(M[s],function(i,a){a.__metadata={uri:r+s+"("+t._createKeysString(o.keys,a)+")",type:o.schema+"."+o.type};jQuery.each(o.navprops,function(k,n){a[k]={__deferred:{uri:r+s+"("+t._createKeysString(o.keys,a)+")/"+k}}})})});return M};sap.ui.app.MockServer.prototype.simulate=function(m,M){var t=this;var o=this._loadMetadata(m);var e=this._findEntitySets(o);var a;if(M==null){a=this._generateMockdata(e,o)}else{if(!jQuery.sap.endsWith(M,"/")&&!jQuery.sap.endsWith(M,".json")){M+="/"}a=this._loadMockdata(e,M)}var G=function(E,k){var f;jQuery.each(a[E],function(i,b){if(k==="("+t._createKeysString(e[E].keys,b)+")"){f=b;return false}});return f};var r=function(E,f,n){var N=e[E].navprops[n];if(N&&N.to){var b=[];jQuery.each(a[N.to.entitySet],function(I,T){var c=true;for(var i=0,l=N.from.propRef.length;i<l;i++){if(f[N.from.propRef[i]]!=T[N.to.propRef[i]]){c=false;break}}if(c){b.push(T)}});return b}};var R=[];R.push({method:"GET",path:"\\$metadata",response:function(x){x.respondFile(200,null,m)}});jQuery.each(e,function(E,b){jQuery.each(b.navprops,function(k,n){R.push({method:"GET",path:"("+E+")(\\([^/\\?#]+\\))/("+k+")/\\$count/?(.*)?",response:function(x,E,K,N,u){var c=G(E,K);if(c){var d=r(E,c,N);x.respond(200,{"Content-Type":"text/plain;charset=utf-8"},""+d.length)}else{x.respond(404)}}});R.push({method:"GET",path:"("+E+")(\\([^/\\?#]+\\))/("+k+")/?(.*)?",response:function(x,E,K,N,u){var c=G(E,K);if(c){var d=r(E,c,N);x.respond(200,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify({d:{results:d}}))}else{x.respond(404)}}})});R.push({method:"GET",path:"("+E+")/\\$count/?(.*)?",response:function(x,E,u){x.respond(200,{"Content-Type":"text/plain;charset=utf-8"},""+a[E].length)}});R.push({method:"GET",path:"("+E+")(\\([^/\\?#]+\\))/?(.*)?",response:function(x,E,k,u){var c=G(E,k);if(c){x.respond(200,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify({d:c}))}else{x.respond(404)}}});R.push({method:"GET",path:"("+E+")/?(.*)?",response:function(x,E,u){u=u&&u.replace("?","&");var p=URI.parseQuery(u),c=a[E],f=c;if(p.hasOwnProperty("$filter")){var O=p["$filter"],s=O.split("(")[0],d,P,v;switch(s){case"substringof":d=O.split("(")[1].split(")")[0].split(",");v=d[0].substr(1,d[0].length-2);P=d[1];f=jQuery.grep(c,function(a){return(a[P].indexOf(v)!=-1)});break;case"startswith":d=O.split("(")[1].split(")")[0].split(",");v=d[1].substr(1,d[0].length-2);P=d[0];f=jQuery.grep(c,function(a){return(a[P].indexOf(v)==0)});break;case"endswith":d=O.split("(")[1].split(")")[0].split(",");v=d[1].substr(1,d[0].length-2);P=d[0];f=jQuery.grep(c,function(a){var h=a[P];return(a[P].indexOf(v)==(h.length-v.length))});break}}if(p.hasOwnProperty("$count")){x.respond(200,{"Content-Type":"text/plain;charset=utf-8"},""+f.length)}else{x.respond(200,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify({d:{results:f}}))}}})});this.setRequests(R)};sap.ui.app.MockServer.prototype._removeAllRequestHandlers=function(){var r=this.getRequests();var l=r.length;for(var i=0;i<l;i++){sap.ui.app.MockServer._removeResponse(r[i].response)}};sap.ui.app.MockServer.prototype._removeAllFilters=function(){for(var i=0;i<this._aFilters.length;i++){sap.ui.app.MockServer._removeFilter(this._aFilters[i])}this._aFilters=null};sap.ui.app.MockServer.prototype._addRequestHandler=function(m,p,r){m=m?m.toUpperCase():m;if(typeof m!=="string"){throw new Error("Error in request configuration: value of 'method' has to be a string")}if(typeof p!=="string"){throw new Error("Error in request configuration: value of 'path' has to be a string")}if(typeof r!=="function"){throw new Error("Error in request configuration: value of 'response' has to be a function")}var u=this.getRootUri();p=this._createRegExpPattern(p);var P=u?(u+p):p;var R=this._createRegExp(P);this._addFilter(this._createFilter(m,R));this._oServer.respondWith(m,R,r)};sap.ui.app.MockServer.prototype._createRegExp=function(p){return new RegExp("^"+p+"$")};sap.ui.app.MockServer.prototype._createRegExpPattern=function(p){return p.replace(/:([\w\d]+)/g,"([^\/]+)")};sap.ui.app.MockServer.prototype._addFilter=function(f){this._aFilters.push(f);sap.ui.app.MockServer._addFilter(f)};sap.ui.app.MockServer.prototype._createFilter=function(r,R){return function(m,u,a,U,p){return r===m&&R.test(u)}};sap.ui.app.MockServer.prototype.destroy=function(s){sap.ui.base.ManagedObject.prototype.destroy.apply(this,arguments);this.stop();var S=sap.ui.app.MockServer._aServers;var i=jQuery.inArray(this,S);S.splice(i,1)};sap.ui.app.MockServer._aFilters=[];sap.ui.app.MockServer._oServer=null;sap.ui.app.MockServer._aServers=[];sap.ui.app.MockServer._getInstance=function(){if(!this._oServer){this._oServer=window.sinon.fakeServer.create();this._oServer.autoRespond=true}return this._oServer};sap.ui.app.MockServer.config=function(c){var s=this._getInstance();s.autoRespond=c.autoRespond===false?false:true;s.autoRespondAfter=c.autoRespondAfter||0;s.fakeHTTPMethods=c.fakeHTTPMethods||false};sap.ui.app.MockServer.respond=function(){this._getInstance().respond()};sap.ui.app.MockServer.startAll=function(){for(var i=0;i<this._aServers.length;i++){this._aServers[i].start()}};sap.ui.app.MockServer.stopAll=function(){for(var i=0;i<this._aServers.length;i++){this._aServers[i].stop()}this._getInstance().restore();this._oServer=null};sap.ui.app.MockServer.destroyAll=function(){this.stopAll();for(var i=0;i<this._aServers.length;i++){this._aServers[i].destroy()}};sap.ui.app.MockServer._addFilter=function(f){this._aFilters.push(f)};sap.ui.app.MockServer._removeFilter=function(f){var i=jQuery.inArray(f,this._aFilters);if(i!==-1){this._aFilters.splice(i,1)}return i!==-1};sap.ui.app.MockServer._removeResponse=function(r){var R=this._oServer.responses;var l=R.length;for(var i=0;i<l;i++){if(R[i].response===r){R.splice(i,1);return true}}return false};window.sinon.FakeXMLHttpRequest.useFilters=true;window.sinon.FakeXMLHttpRequest.addFilter(function(m,u,a,U,p){var f=sap.ui.app.MockServer._aFilters;for(var i=0;i<f.length;i++){var F=f[i];if(F(m,u,a,U,p)){return false}}return true});var g=function(f){if(/.*\.json$/.test(f)){return"JSON"}if(/.*\.xml$/.test(f)){return"XML"}if(/.*metadata$/.test(f)){return"XML"}return null};window.sinon.FakeXMLHttpRequest.prototype.respondFile=function(s,h,f){var r=jQuery.sap.sjax({url:f,dataType:"text"});if(!r.success)throw new Error("Could not load file from: "+f);var d=r.data;var m=g(f);if(this["respond"+m]){this["respond"+m](s,h,d)}else{this.respond(s,h,d)}};window.sinon.FakeXMLHttpRequest.prototype.respondJSON=function(s,h,j){h=h||{};h["Content-Type"]=h["Content-Type"]||"application/json";this.respond(s,h,typeof j==="string"?j:JSON.stringify(j))};window.sinon.FakeXMLHttpRequest.prototype.respondXML=function(s,h,x){h=h||{};h["Content-Type"]=h["Content-Type"]||"application/xml";this.respond(s,h,x)}})();
