/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-04-08/ */!function(a,b){"use strict";function c(a,b){var c,d,e;d=!1,c=document.createElement("script"),c.type="text/javascript",c.src=a,c.onload=c.onreadystatechange=function(){d||this.readyState&&"complete"!=this.readyState||(d=!0,b())},e=document.getElementsByTagName("script")[0],e.parentNode.insertBefore(c,e)}function d(){a.dojoConfig=h;for(var b=0,c=f.length;c>b;b++)j(f[b]);for(var d=0,g=e.length;g>d;d++)i(e[d])}var e=["http://js.arcgis.com/3.13/"],f=["http://js.arcgis.com/3.13/esri/css/esri.css","http://js.arcgis.com/3.13/dijit/themes/tundra/tundra.css","../../css/report.css"],g=location.pathname.replace(/app\/js\/report.*/,"")+"app",h={parseOnLoad:!1,isDebug:!1,async:!0,packages:[{name:"libs",location:g+"/libs"},{name:"report",location:g+"/js/report"}],aliases:[["knockout","libs/knockout-3.1.0"],["dom-style","dojo/dom-style"],["dom-class","dojo/dom-class"],["topic","dojo/topic"],["dom","dojo/dom"],["on","dojo/on"]],deps:["report/Generator","dojo/domReady!"],callback:function(b){c("http://code.jquery.com/jquery-1.11.0.min.js",function(){c("http://code.highcharts.com/highcharts.js",function(){c("http://code.highcharts.com/modules/exporting.js",function(){if(a.payload)b.init();else{var c=!1;document.addEventListener("PayloadReady",function(){c=!0,b.init()}),setTimeout(function(){c||alert("There was an error generating the report at this time.  Please make sure your pop-up blocker is disabled and try again.")},5e3)}})})})}},i=function(a,c){var d=b.createElement("script");d.setAttribute("src",a);for(var e in c)c.hasOwnProperty(e)&&d.setAttribute(e,c[e]);b.getElementsByTagName("body")[0].appendChild(d)},j=function(a){var c=b.createElement("link");c.setAttribute("rel","stylesheet"),c.setAttribute("type","text/css"),c.setAttribute("href",a),b.getElementsByTagName("head")[0].appendChild(c)};Array.prototype.fromBounds=function(){if(2!==this.length)return this;var a=[],b=this[0],c=this[1];for(b;c>=b;b++)a.push(b);return a},Array.prototype.chunk=function(a){var b=[],c=0;for(c;c<this.length;c+=a)b.push(this.slice(c,c+a));return b},a.requestAnimationFrame=function(){return a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame}(),a.requestAnimationFrame?a.requestAnimationFrame(d):"loaded"===b.readyState?d():a.onload=d}(window,document);