define({

    "title": "Global Forest Watch Commodities",

    "urls": {
        "gfw": "http://www.globalforestwatch.org/",
        "blog": "http://blog.globalforestwatch.org/"
    },

    "corsEnabledServers": [
        "https://api-ssl.bitly.com",
        "http://globalforestwatch.org",
        "http://firms.modaps.eosdis.nasa.gov",
        "http://gis-potico.wri.org",
        "http://gfw-apis.appspot.com",
        "http://50.18.182.188"
    ],

    "homeModeOptions": [{
        "html": "<span class='less-text'>Explore the map</span>",
        "eventName": "goToMap",
        "display": true,
        "id": 0,
        "tooltip": "Explore the Map"
    }, {
        "html": "<span>View the latest analysis</span>",
        "eventName": "goToAnalysis",
        "display": false,
        "id": 1,
        "tooltip": "Check Out the Analysis Page"
    }, {
        "html": "<span>View the latest imagery</span>",
        "eventName": "goToData",
        "display": false,
        "id": 2,
        "tooltip": "Or try the Data Page"
    }, {
        "html": "Fires occuring in peatland <br> in the last 7 days",
        "eventName": "goToAbout",
        "display": false,
        "id": 3,
        "tooltip": "Go to the About Page!"
    }, {
        "html": "<span class='more-text'>Sign up for SMS & fire alerts</span>",
        "eventName": "subscribeToAlerts",
        "display": false,
        "id": 4,
        "tooltip": "This one won't take you anywhere"
    }]

});