/*! Global-Forest-Watch-Commodities - v2.4.13 - 2017-06-19/ */!function(a,b){var c="2.4.80",d=location.pathname.replace(/\/[^\/]+$/,"")+"app",e={parseOnLoad:!1,isDebug:!1,async:!0,cacheBust:"v="+c,packages:[{name:"js",location:d+"/js"},{name:"main",location:d+"/js/main"},{name:"models",location:d+"/js/models"},{name:"utils",location:d+"/js/utils"},{name:"report",location:d+"/js/report"},{name:"actions",location:d+"/js/actions"},{name:"analysis",location:d+"/js/analysis"},{name:"templates",location:d+"/templates"},{name:"components",location:d+"/js/components"},{name:"controllers",location:d+"/js/controllers"},{name:"layers",location:d+"/js/layers"},{name:"map",location:d+"/js/map"},{name:"libs",location:d+"/libs"}],aliases:[["knockout","libs/knockout-3.1.0/index"],["react","libs/react/react.min"],["lodash","libs/lodash/lodash.min"]],deps:["dojo/domReady!"],callback:function(){require(["js/bundle"])}},f=["//js.arcgis.com/3.20/","app/libs/jquery-1.7.1.min.js","app/libs/kalendae/build/kalendae.standalone.js","app/libs/jquery-ui-custom.min.js","app/libs/jQAllRangeSliders-min.js"],g=[{src:"app/libs/kalendae/build/kalendae.css",cdn:!1},{src:"app/css/app.css",cdn:!1},{src:"//js.arcgis.com/3.20/esri/css/esri.css",cdn:!0},{src:"//js.arcgis.com/3.20/dijit/themes/tundra/tundra.css",cdn:!0}],h=function(a,c){var d=b.createElement("script"),e=b.getElementsByTagName("head")[0];d.src=a,d.async=c,e.appendChild(d)},i=function(a,d){var e=b.createElement("link"),f=d?a:a+"?v="+c,g=b.getElementsByTagName("head")[0];e.rel="stylesheet",e.type="text/css",e.href=f,e.media="only x",g.appendChild(e),setTimeout(function(){e.media="all"})},j=function(){a.dojoConfig=e;for(var b=0,c=g.length;b<c;b++)i(g[b].src,g[b].cdn);for(var d=0,j=f.length;d<j;d++)h(f[d],!1)};a.requestAnimationFrame=function(){return a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame}(),a.requestAnimationFrame?a.requestAnimationFrame(j):"loaded"===b.readyState?j():a.onload=j}(window,document);