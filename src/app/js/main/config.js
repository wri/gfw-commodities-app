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
        "html": "Fires occuring in peatland <br> in the last 7 days",
        "eventName": "goToAbout",
        "display": true
    }, {
        "html": "<span>View the latest analysis</span>",
        "eventName": "goToAnalysis",
        "display": false
    }, {
        "html": "<span>View the latest imagery</span>",
        "eventName": "goToData",
        "display": false
    }, {
        "html": "<span class='less-text'>Explore the map</span>",
        "eventName": "goToMap",
        "display": false
    }, {
        "html": "<span class='more-text'>Sign up for SMS & fire alerts</span>",
        "eventName": "subscribeToAlerts",
        "display": false
    }]

});