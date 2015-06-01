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

  require(['report/Generator'], function (Generator) {

    var payloadReceived = false;

    loadScriptAsync('http://code.jquery.com/jquery-1.11.0.min.js', function() {
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
    });

  

  }); // End require

}());
