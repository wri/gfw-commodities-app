/* global window, document, location */
(function(win, doc) {
    'use strict';
    var version = "2.5.5",
        URL = location.pathname.replace(/\/[^/]+$/, "") + 'app',
        dojoConfig = {
            parseOnLoad: false,
            isDebug: false,
            async: true,
            cacheBust: "v=" + version,
            packages: [{
                name: "js",
                location: URL + "/js"
            }, {
                name: "php",
                location: URL + "/php"
            }, {
                name: "main",
                location: URL + "/js/main"
            }, {
                name: "models",
                location: URL + "/js/models"
            }, {
                name: "utils",
                location: URL + "/js/utils"
            }, {
                name: "report",
                location: URL + "/js/report"
            }, {
                name: "actions",
                location: URL + "/js/actions"
            }, {
                name: "analysis",
                location: URL + "/js/analysis"
            }, {
                name: "templates",
                location: URL + "/templates"
            }, {
                name: "components",
                location: URL + "/js/components"
            }, {
                name: "controllers",
                location: URL + "/js/controllers"
            }, {
                name: "map",
                location: URL + "/js/map"
            }, {
                name: "libs",
                location: URL + "/libs"
            }],
            aliases: [
                ['knockout', 'libs/knockout-3.1.0/index'],
                ['react', 'libs/react/react.min'],
                // ['react', 'libs/react/react'],
                ['lodash', 'libs/lodash/lodash.min']
            ],
            deps: [
                "dojo/domReady!"
            ],
            callback: function() {
                require(['js/bundle']);
            }
        }, // End dojoConfig
        src = [
            'http://js.arcgis.com/3.13/',
            'app/libs/jquery-1.7.1.min.js',
            'app/libs/jquery-ui-custom.min.js',
            'app/libs/jQAllRangeSliders-min.js'
        ],
        css = [{
            src: 'app/css/app.css',
            cdn: false
        }, {
            src: 'http://js.arcgis.com/3.10/js/esri/css/esri.css',
            cdn: true
        }, {
            src: 'http://js.arcgis.com/3.10/js/dojo/dijit/themes/tundra/tundra.css',
            cdn: true
        }];

    var loadScript = function(src, async) {
        var s = doc.createElement('script'),
            h = doc.getElementsByTagName('head')[0];
        s.src = src;
        s.async = async;
        h.appendChild(s);
    };

    var loadStyle = function(src, isCDN) {
        var l = doc.createElement('link'),
            path = isCDN ? src : src + "?v=" + version,
            h = doc.getElementsByTagName('head')[0];
        l.rel = "stylesheet";
        l.type = 'text/css';
        l.href = path;
        l.media = "only x";
        h.appendChild(l);
        setTimeout(function() {
            l.media = "all";
        });
    };

    var loadDependencies = function() {
        win.dojoConfig = dojoConfig;
        for (var i = 0, length = css.length; i < length; i++) {
            loadStyle(css[i].src, css[i].cdn);
        }
        for (var j = 0, size = src.length; j < size; j++) {
            loadScript(src[j], false);
        }
    };

    win.requestAnimationFrame = (function() {
        return win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            win.oRequestAnimationFrame ||
            win.msRequestAnimationFrame;
    })();

    if (win.requestAnimationFrame) {
        win.requestAnimationFrame(loadDependencies);
    } else if (doc.readyState === "loaded") {
        loadDependencies();
    } else {
        win.onload = loadDependencies;
    }

})(window, document);
