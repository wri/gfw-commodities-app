define([
    "dojo/Deferred"
], function(Deferred) {
    'use strict';

    return {

        getTemplate: function(name) {
            var deferred = new Deferred(),
                path = './app/templates/' + name + '.html?v=2.4.9',
                req;

            req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    deferred.resolve(req.responseText);
                }
            };

            req.open("GET", path, true);
            req.send();
            return deferred.promise;
        },

        loadCSS: function(path) {
            var l = doc.createElement('link'),
                h = doc.getElementsByTagName('head')[0];
            l.rel = "stylesheet";
            l.type = 'text/css';
            l.href = path;
            h.appendChild(l);
        }

    };

});