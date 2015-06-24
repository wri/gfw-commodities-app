/* global window, document, location */
// ENV to dev for Development, pro for Production
(function(win, doc) {
  'use strict';

  var src = [
    'http://js.arcgis.com/3.13/'
  ],
  css = [
    'http://js.arcgis.com/3.13/esri/css/esri.css',
    'http://js.arcgis.com/3.13/dijit/themes/tundra/tundra.css',
    '../../css/report.css'
  ],
  URL = location.pathname.replace(/app\/js\/report.*/, '') + 'app',
  dojoConfig = {
    parseOnLoad: false,
    isDebug: false,
    async: true,
    packages: [{
      name: 'libs',
      location: URL + '/libs'
    }, {
      name: 'report',
      location: URL + '/js/report'
    }, {
        name: "map",
        location: URL + "/js/map"
    }, {
        name: "components",
        location: URL + "/js/components"
    }, {
      name: 'utils',
      location: URL + '/js/utils'
    }],
    aliases: [
      ["knockout", "libs/knockout-3.1.0"],
      ["dom-style", "dojo/dom-style"],
      ["dom-class", "dojo/dom-class"],
      ["topic", "dojo/topic"],
      ["dom", "dojo/dom"],
      ["on", "dojo/on"]
    ],
    deps: [ 'dojo/domReady!' ],
    callback: function () { require(['report/reportBundle']); }
  }; // End dojoConfig

  var loadScript = function(src, attrs) {
    var s = doc.createElement('script');
    s.setAttribute('src', src);
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        s.setAttribute(key, attrs[key]);
      }
    }
    doc.getElementsByTagName('body')[0].appendChild(s);    
  };

  var loadStyle = function(src) {
    var l = doc.createElement('link');
    l.setAttribute('rel', 'stylesheet');
    l.setAttribute('type', 'text/css');
    l.setAttribute('href', src);
    doc.getElementsByTagName('head')[0].appendChild(l);
  };

  function loadScriptAsync(src, callback) {
    var s,
        r,
        t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
      //console.log( this.readyState ); //uncomment this line to see which ready states are called.
      if ( !r && (!this.readyState || this.readyState == 'complete') )
      {
        r = true;
        callback();
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }

  function loadDependencies() {
    // Load Esri Dependencies
    win.dojoConfig = dojoConfig;
    for (var i = 0, len = css.length; i < len; i++) {
      loadStyle(css[i]);
    }
    for (var j = 0, size = src.length; j < size; j++) {
      loadScript(src[j]);
    }
  }

  /* Global Helper Functions */
  /*
    takes an array of bounds and returns an array with every value between the bounds
    ex.
      [1,5]._fromBounds -> [1,2,3,4,5]
    @param {array} originalArray
    @return {array}
  */
  win.arrayFromBounds = function (array) {
    var res = [], index = array[0], length = array[1];
    for (index; index <= length; index++) {
      res.push(index);
    }
    return res;
  };
  
  /*
    @param {number} chunkSize size of each chunk of the returned array
    @return {array} an array or arrays with each array's length being the specified chunk size
  */
  win.arrayChunk = function (array, chunkSize) {
    var resultingArrays = [], index = 0;
    for(index; index < array.length; index += chunkSize)
      resultingArrays.push(array.slice(index, index + chunkSize));
    return resultingArrays;
  };

  win.requestAnimationFrame = (function() {
    return win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame;
  })();
  /* Polyfills and/or prototype additions */

  if (doc.readyState === "loaded") {
    loadDependencies();
  } else {
    win.onload = loadDependencies;
  }

})(window, document);
