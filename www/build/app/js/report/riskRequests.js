/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-05-22/ */define(["dojo/Deferred","esri/tasks/QueryTask","esri/tasks/query","esri/tasks/ImageServiceIdentifyTask","esri/tasks/ImageServiceIdentifyParameters","esri/tasks/StatisticDefinition","esri/request"],function(a,b,c,d,e,f,g){var h={},i=function(a,b){for(var c in b)b.hasOwnProperty(c)&&b[c]&&(a[c]=b[c]);return a},j=function(b,c,d){var e=new a;return d=d||"execute",b[d](c,function(a){e.resolve(a)},function(a){e.resolve(a)}),e};return h.loadServiceInfo=function(b){var c=new a,d=esri.request({url:b,content:{f:"json"},handleAs:"json"});return d.then(function(a){console.log("Success: ",a.layers),c.resolve(a)},function(a){console.log("Error: ",a.message),c.resolve(a)}),c},h.queryForStats=function(b,c,d){var e=(new a,d.map(function(a){return i(new f,a)}));return c.outStatistics=e,h.queryEsri(b,c)},h.queryEsri=function(a,d,e){var f=new b(a),g=i(new c,d),h=j(f,g,e);return h},h.computeHistogram=function(a,b){return g({url:a+"/computeHistograms",content:b,handleAs:"json",callbackParamName:"callback",timeout:6e4},{usePost:!0})},h.queryJson=function(){},h});