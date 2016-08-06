(function () {

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

  var loadStyle = function(src) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.type = 'text/css';
    l.href = src;
    document.getElementsByTagName('head')[0].appendChild(l);
  };

  // Load Non-Critical CSS Now
  loadStyle('http://js.arcgis.com/3.16/esri/css/esri.css');
  loadStyle('http://js.arcgis.com/3.16/dijit/themes/tundra/tundra.css');
  loadStyle('app/css/report.css');

  /* Global Helper Functions */
  /*
    takes an array of bounds and returns an array with every value between the bounds, ex.
    arrayFromBounds([1,5]) -> [1,2,3,4,5]
    @param {array} originalArray
    @return {array}
  */
  window.arrayFromBounds = function (array) {
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
  window.arrayChunk = function (array, chunkSize) {
    var resultingArrays = [], index = 0;
    for(index; index < array.length; index += chunkSize)
      resultingArrays.push(array.slice(index, index + chunkSize));
    return resultingArrays;
  };

  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  })();

  require(['report/Generator'], function (Generator) {

    var payloadReceived = false;

    loadScriptAsync('http://code.highcharts.com/highcharts.js', function() {
      loadScriptAsync('http://code.highcharts.com/modules/exporting.js', function() {

        // localStorage is the preferred mechanism, if not supported, get it from window
        if (localStorage) {
          window.payload = JSON.parse(localStorage.getItem('payload'));
          if (window.payload) { payloadReceived = true; }
        } else if (window.payload) {
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
            if (payloadReceived && window.payload) {
              Generator.init();
            } else {
              alert("There was an error generating the report at this time.  Please make sure your pop-up blocker is disabled and try again.");
            }
          }, 5000);
        }
      });
    });



  }); // End require

}());
