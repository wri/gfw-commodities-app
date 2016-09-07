define([
    'dojo/Deferred',
    'esri/urlUtils',
    'esri/request'
], function(Deferred, urlUtils, esriRequest) {

    return {

        getTemplate: function(name) {
            var deferred = new Deferred(),
                path = './app/templates/' + name + '.html?v=2.4.8',
                req;

            req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    deferred.resolve(req.responseText);
                }
            };

            req.open('GET', path, true);
            req.send();
            return deferred.promise;
        },

        getWRITemplate: function() {
            var path = 'http://54.88.79.102/gfw-sync/metadata';
                // deferred = new Deferred(),
                // req;

            urlUtils.addProxyRule({
              urlPrefix: 'http://54.88.79.102',
              proxyUrl: '/app/php/proxy.php'
            });

            // esri.config.defaults.io.corsEnabledServers.push('54.88.79.102');
            var layersRequest = esriRequest({
                url: path,
                handleAs: 'json',
                callbackParamName: 'callback'
              }, {
                  usePost: true
              });

            return layersRequest;
            // layersRequest.then(
            //   function (response) {
            //     console.log(response);
            //     return response;
            // }, function (error) {
            //     console.log(error);
            //     return false;
            // });

            // req = new XMLHttpRequest();
            // req.onreadystatechange = function() {
            //     if (req.readyState === 4 && req.status === 200) {
            //       debugger
            //         deferred.resolve(req);
            //     }
            // };
            //
            // req.open("GET", path, true);
            // req.send();
            // return deferred.promise;
        },

        loadCSS: function(path) {
            var l = doc.createElement('link'),
                h = doc.getElementsByTagName('head')[0];
            l.rel = 'stylesheet';
            l.type = 'text/css';
            l.href = path;
            h.appendChild(l);
        }

    };

});
