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
    }],
    aliases: [
      ["knockout", "libs/knockout-3.1.0"],
      ["dom-style", "dojo/dom-style"],
      ["dom-class", "dojo/dom-class"],
      ["topic", "dojo/topic"],
      ["dom", "dojo/dom"],
      ["on", "dojo/on"]
    ],
    deps: [
      'report/Generator',
      'dojo/domReady!'
    ],
    callback: function(Generator) {

      var payloadReceived = false;

      loadScriptAsync('http://code.jquery.com/jquery-1.11.0.min.js', function() {
        loadScriptAsync('http://code.highcharts.com/highcharts.js', function() {
          loadScriptAsync('http://code.highcharts.com/modules/exporting.js', function() {

            // localStorage is the preferred mechanism, if not supported, get it from window
            if (localStorage) {
              win.payload = JSON.parse(localStorage.getItem('payload'));
              if (win.payload) { payloadReceived = true; }
            } else if (win.payload) {
              payloadReceived = true;
            }

            // If we have data, lets begin
            if (payloadReceived) {
              Generator.init();
            } else {
              // Emit a special event from the other window telling me the payload is ready
              document.addEventListener('PayloadReady', function () {
                payloadReceived = true;
              });
              // Give it 5 seconds and check again, if no data by now, something went wrong
              // This should take no more then 2 seconds
              setTimeout(function () {
                if (payloadReceived && win.payload) {
                  Generator.init();
                } else {
                  alert("There was an error generating the report at this time.  Please make sure your pop-up blocker is disabled and try again.");
                }
              }, 5000);
            }
          });
        });
      });

    }
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

  /* Polyfills and/or prototype additions */
  /*
    takes an array of bounds and returns an array with every value between the bounds
    ex.
      [1,5]._fromBounds -> [1,2,3,4,5]
    @param {array} originalArray
    @return {array}
  */
  Array.prototype.fromBounds = function () {
    if (this.length !== 2) { return this; }
    var res = [], index = this[0], length = this[1];
    for (index; index <= length; index++) {
      res.push(index);
    }
    return res;
  };
  
  /*
    @param {number} chunkSize size of each chunk of the returned array
    @return {array} an array or arrays with each array's length being the specified chunk size
  */
  Array.prototype.chunk = function (chunkSize) {
    var resultingArrays = [], index = 0;
    for(index; index < this.length; index += chunkSize)
      resultingArrays.push(this.slice(index, index + chunkSize));
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

  if (win.requestAnimationFrame) {
    win.requestAnimationFrame(loadDependencies);
  } else if (doc.readyState === "loaded") {
    loadDependencies();
  } else {
    win.onload = loadDependencies;
  }

})(window, document);