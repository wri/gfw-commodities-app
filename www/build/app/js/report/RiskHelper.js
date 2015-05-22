/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-05-22/ */define(["report/config","dojo/Deferred","dojo/_base/lang","dojo/promise/all","dojo/_base/array","esri/tasks/query","esri/tasks/QueryTask","report/riskController","esri/geometry/geometryEngine"],function(a,b,c,d,e,f,g,h,i){"use strict";var j={id:"",deforestation:{umd_loss_primary:{concession:{},radius:{}},forma_primary:{concession:{},radius:{}},umd_loss:{concession:{},radius:{}},carbon:{concession:{},radius:{}},forma:{concession:{},radius:{}},area_primary:{concession:{},radius:{}}},legal:{concession:{},radius:{}},fire:{concession:{},radius:{}},peat:{concession:{},radius:{},clearance:{concession:{},radius:{}},presence:{concession:{},radius:{}}},rspo:{},priority_level_concession:"",priority_level_radius:"",total_mill_priority_level:""},k={prepareFeatures:function(a){var c=new b,f=[],g=this;return e.forEach(a,function(a){var c=new b;g.getAreaAndIndoIntersect(a).then(function(a){c.resolve({feature:a.feature,area:a.area,inIndonesia:a.inIndonesia})}),f.push(c.promise)}),d(f).then(function(a){g.performAnalysis(a).then(function(a){c.resolve(a)})}),c.promise},getAreaAndIndoIntersect:function(a){var c=new b,d=this.getArea(a.geometry);return this.getIntersectionStatus(a).then(function(b){c.resolve({feature:a,area:d,inIndonesia:b})}),c.promise},getArea:function(a){var b=i.simplify(a);return i.planarArea(b)},getIntersectionStatus:function(c){var d,e,h=new b;return e=new g(a.boundariesUrl),d=new f,d.returnGeometry=!0,d.outFields=["OBJECTID"],d.where="ISO3 = 'IDN'",d.geometryPrecision=1,e.execute(d,function(a){var b=a.features[0]&&a.features[0].geometry;h.resolve(i.contains(b,c.geometry))},function(a){h.resolve(!1)}),h.promise},performAnalysis:function(a){var c,f,g,i,j=new b,k=this,l=[];return e.forEach(a,function(a){var e=new b;i=a.feature.isRSPO||!1,f=a.feature.geometry,c=a.inIndonesia,g=a.area,d([h(f,g,"concession",i,c),h(f,g,"radius",i,c)]).then(function(b){e.resolve({feature:a.feature,results:b})}),l.push(e)}),d(l).then(function(a){var b=k.formatData(a);j.resolve(b)}),j.promise},formatData:function(a){function b(a,b){var c;switch(a.label){case"Legality":g.legal[b]={risk:i[a.risk]};break;case"RSPO":break;case"Fires":g.fire[b]={risk:i[a.risk]};break;case"Carbon":e.forEach(a.categories,function(a){"loss_carbon"===a.key&&(g.deforestation.carbon[b]={risk:i[a.risk]})});break;case"Peat":c="concession"===b?"peat_concession":"peat_radius",g.peat[c]=i[a.risk],e.forEach(a.categories,function(a){g.peat[a.key]&&(g.peat[a.key][b]={risk:i[a.risk]})});break;case"Deforestation":c="concession"===b?"deforestation_concession":"deforestation_radius",g.deforestation[c]=i[a.risk],e.forEach(a.categories,function(a){g.deforestation[a.key][b]={risk:i[a.risk]}})}}var d,f,g,h=[],i={1:"low",2:"medium",3:"high"};return e.forEach(a,function(a){d=a.results[0],f=a.results[1],g=c.clone(j),g.id=a.feature.millId,g.rspo.risk=a.feature.isRSPO,e.forEach(d,function(a){b(a,"concession")}),e.forEach(f,function(a){b(a,"radius")}),h.push(g)}),h}};return k});