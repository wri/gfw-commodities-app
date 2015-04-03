/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-04-03/ */define(["dojo/on","dojo/dom","dojo/query","esri/config","dojo/request/xhr","dojo/Deferred","dojo/dom-class","dojo/dom-style","dojo/promise/all","dojo/_base/array","dijit/Dialog","dojox/validate/web","esri/geometry/Point","esri/geometry/Polygon","esri/SpatialReference","esri/tasks/GeometryService","esri/geometry/webMercatorUtils","report/config","report/Fetcher"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s){"use strict";return window.report={},{init:function(){window.payload&&(this.applyConfigurations(),this.prepareForAnalysis(),this.addSubscriptionDialog(),this.setupHeader())},applyConfigurations:function(){j.forEach(r.corsEnabledServers,function(a){d.defaults.io.corsEnabledServers.push(a)}),Highcharts.setOptions({chart:{style:{fontFamily:"Arial"}}})},setupHeader:function(){var c=b.byId("total-area-info-icon");a(c,"click",function(){h.set("total-area-info-popup","visibility","visible")}),c=b.byId("total-area-close-info-icon"),a(c,"click",function(){h.set("total-area-info-popup","visibility","hidden")})},prepareForAnalysis:function(){var a,b,c=this,d=new p(r.geometryServiceUrl),e=new o(102100);report.geometry=JSON.parse(window.payload.geometry),this.setTitleAndShowReport(window.payload.title),report.suitable=window.payload.suitability,report.datasets=window.payload.datasets,"[object Array]"===Object.prototype.toString.call(report.geometry)?(report.mills=report.geometry,a=[],j.forEach(report.geometry,function(c){b=new n(e),b.addRing(c.geometry.rings[c.geometry.rings.length-1]),a.push(b)}),d.union(a,function(a){b=new n(a),report.geometry=b,c.beginAnalysis()})):report.geometry.radius?(b=new n(e),b.addRing(report.geometry.rings[report.geometry.rings.length-1]),report.geometry=b,this.beginAnalysis()):this.beginAnalysis()},setTitleAndShowReport:function(a){document.getElementById("title").innerHTML=a,g.remove("report","hidden")},beginAnalysis:function(){function a(){c.length>0?(b=c.shift(),i(d._getDeferredsForItems(b)).then(a)):d.getFiresAnalysis()}var b,c=this._getArrayOfRequests(),d=this;report.areaPromise=s.getAreaFromGeometry(report.geometry),s.makePrintRequest(),i([s._getClearanceBounds()]).then(function(){c.length<3?i(d._getDeferredsForItems(c)).then(d.getFiresAnalysis.bind(d)):(c=c.chunk(3),a())})},getFiresAnalysis:function(){var a=this;i([s._getFireAlertAnalysis()]).then(a.analysisComplete)},analysisComplete:function(){g.remove("print","disabled"),a(b.byId("print"),"click",function(){h.set("total-area-info-popup","visibility","hidden"),window.print()}),c(".loader-wheel").forEach(function(a){"total-area"!==a.parentNode.id&&"print-map"!==a.parentNode.id&&(a.parentNode.innerHTML="There was an error getting these results at this time.")})},_getArrayOfRequests:function(){var a=[];for(var b in report.datasets)report.datasets[b]&&a.push(b);return a},_getDeferredsForItems:function(a){var b=[];return j.forEach(a,function(a){switch(a){case"suit":b.push(s._getSuitabilityAnalysis());break;case"mill":b.push(s._getMillPointAnalysis());break;case"carbon":b.push(s.getCarbonStocksResults());break;case"intact":b.push(s.getIntactForestResults());break;case"landCoverGlob":b.push(s.getLandCoverGlobalResults());break;case"landCoverAsia":b.push(s.getLandCoverAsiaResults());break;case"landCoverIndo":b.push(s.getLandCoverIndonesiaResults());break;case"legal":b.push(s.getLegalClassResults());break;case"peat":b.push(s.getPeatLandsResults());break;case"primForest":b.push(s.getPrimaryForestResults());break;case"protected":b.push(s.getProtectedAreaResults());break;case"rspo":b.push(s.getRSPOResults());break;case"treeDensity":b.push(s.getTreeCoverResults());break;case"treeCoverLoss":b.push(s.getTreeCoverLossResults())}}),b},addSubscriptionDialog:function(){var c=new k({title:"Subscribe to Alerts!",style:"width: 300px;"}),d=this,e="<div class='subscription-content'><div class='checkbox-container'><label><input id='forma_check' type='checkbox' value='clearance' />Monthly Clearance Alerts</label></div><div class='checkbox-container'><label><input id='fires_check' type='checkbox' value='fires' />Fire Alerts</label></div><div class='email-container'><input id='user-email' type='text' placeholder='something@gmail.com'/></div><div class='submit-container'><button id='subscribe-now'>Subscribe</button></div><div id='form-response' class='message-container'></div></div>";c.setContent(e),a(b.byId("subscribeToAlerts"),"click",function(){c.show()}),a(b.byId("subscribe-now"),"click",function(){b.byId("form-response").innerHTML="<div class='loader-wheel subscribe'>subscribing</div>",d.subscribeToAlerts()})},subscribeToAlerts:function(){var a=this.convertGeometryToGeometric(report.geometry),c=b.byId("user-email").value,d=b.byId("forma_check").checked,e=b.byId("fires_check").checked,f=[],g={};if(g.invalidEmail="You must provide a valid email in the form.",g.noSelection="You must select at least one checkbox from the form.",g.formaSuccess="Thank you for subscribing to Forma Alerts.  You should receive a confirmation email soon.",g.formaFail="There was an error with your request to subscribe to Forma alerts.  Please try again later.",g.fireSuccess="Thank you for subscribing to Fires Alerts.  You should receive a confirmation email soon.",g.fireFail="There was an error with your request to subscribe to Fires alerts.  Please try again later.",l.isEmailAddress(c)||f.push(g.invalidEmail),d||e||f.push(g.noSelection),f.length>0)alert("Please fill in the following:\n"+f.join("\n"));else if(d&&e){var h=[];i([this.subscribeToForma(a,c),this.subscribeToFires(report.geometry,c)]).then(function(a){h.push(a[0]?g.formaSuccess:g.formaFail),h.push(a[1]?g.fireSuccess:g.fireFail),b.byId("form-response").innerHTML=h.join("<br />")})}else d?this.subscribeToForma(a,c).then(function(a){b.byId("form-response").innerHTML=a?g.formaSuccess:g.formaFail}):e&&this.subscribeToFires(report.geometry,c).then(function(a){b.byId("form-response").innerHTML=a?g.fireSuccess:g.fireFail})},subscribeToForma:function(a,b){var c,d=r.alertUrl.forma,e=new f,g=new XMLHttpRequest,h=JSON.stringify({topic:"updates/forma",geom:'{"type": "'+a.type+'", "coordinates":['+JSON.stringify(a.geom)+"]}",email:b});return g.open("POST",d,!0),g.onreadystatechange=function(){4===g.readyState&&(c=JSON.parse(g.response),e.resolve(c.subscribe))},g.addEventListener("error",function(){e.resolve(!1)},!1),g.setRequestHeader("Content-type","application/x-www-form-urlencoded"),g.send(h),e.promise},subscribeToFires:function(a,b){var c=r.alertUrl.fires,d=new f,g={features:JSON.stringify({rings:a.rings,spatialReference:a.spatialReference}),msg_addr:b,msg_type:"email",area_name:payload.title};return e(c,{handleAs:"json",method:"POST",data:g}).then(function(){d.resolve(!0)},function(){d.resolve(!1)}),d.promise},convertGeometryToGeometric:function(a){function b(a,b){var c=!1;return j.forEach(a,function(a){a[0]===b[0]&&a[1]===b[1]&&(c=!0)}),c}var c,d,e=new o({wkid:102100}),f=[],g=[];return j.forEach(a.rings,function(a){j.forEach(a,function(a){d=new m(a,e),c=q.xyToLngLat(d.x,d.y),b(g,c)?(g.push(c),f.push(g),g=[]):g.push(c)})}),{geom:f.length>1?f:f[0],type:f.length>1?"MultiPolygon":"Polygon"}}}});