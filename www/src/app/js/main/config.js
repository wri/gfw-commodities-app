define({

  "title": "Global Forest Watch Commodities",

  "urls": {
    "gfw": "http://commodities.globalforestwatch.org/#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2Closs&wiz=open",
    "blog": "http://commodities.globalforestwatch.org/#v=map&x=114.37&y=2.08&l=5&lyrs=tcc%2Closs",
    "fires": "http://fires.globalforestwatch.org/#v=home",
    "supplierMonitoring": "http://commodities.globalforestwatch.org/#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2Closs&wiz=open",
    "SPOTT": "#"


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
    'html': '<div class="home-slider-container">\n<h3>PALM OIL RISK TOOL</h3>\n<h4><span>NEW GFW COMMODITIES TOOL MEASURES</span>\n<span>DEFORESTATION RISK AROUND PALM OIL MILLS</span></h4>\n<div><a href="./#v=map&x=-17.62&y=-0.89&l=3&lyrs=tcc%2Closs&wiz=open">More Info</a></div>\n</div>',
    'eventName': "goToMills",
    'display': false,
    'id': 0,
    'tooltip': "Palm Oil Risk Tool",
    'imageBg': "./app/css/images/Slide-Picture6.jpg"
  },{
    "html": '<div class="home-slider-container">\n<h3>COMMODITIES MAP</h3>\n<h4><span>EXPLORE THE</span>\n<span>COMMODITIES MAP</span></h4>\n<div><a href="./#v=map&x=114.37&y=1.99&l=5&lyrs=tcc%2Closs">More Info</a></div>\n</div>',
    "eventName": "goToFires",
    "display": false,
    "id": 1,
    "tooltip": "Commodities Map",
    "imageBg": "./app/css/images/Slide-Picture2.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>ANALYSIS</h3>\n<h4><span>ANALYZE FOREST COVER</span>\n<span>CHANGE IN A CONCESSION</span>\n<span>OR CUSTOM AREA</span></h4>\n<div><a href="./#v=map&x=104.27&y=1.99&l=5&lyrs=tcc%2Closs&wiz=open">More Info</a></div>\n</div>',
    "eventName": "goToMap",
    "display": true,
    "id": 2,
    "tooltip": "Analysis",
    "imageBg": "./app/css/images/Slide-Picture1.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>SUPPLIER MONITORING</h3>\n<h4><span>MONITOR THE</span>\n<span>ACTIVITY NEAR</span>\n<span>PALM OIL MILLS</span></h4>\n<div><a href="./#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2Closs&wiz=open">More Info</a></div>\n</div>',
    "eventName": "goToZSL",
    "display": false,
    "id": 3,
    "tooltip": "Supplier Monitoring",
    "imageBg": "./app/css/images/Slide-Picture4.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>ALERTS</h3>\n<h4><span>SIGN UP FOR TREE</span>\n<span>CLEARANCE AND FIRE</span>\n<span>ALERTS FORS AREAS IN</span>\n<span>YOUR SUPPLY CHAIN</span></h4>\n<div><a href="#">More Info</a></div>\n</div>',
    "eventName": "goToBlogs",
    "display": false,
    "id": 4,
    "tooltip": "Alerts",
    "imageBg": "./app/css/images/Slide-Picture3.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>COMMODITIES</h3>\n<h4><span>ANALYZE LAND USE</span>\n<span>CHANGE WITHIN RSPO</span>\n<span>CERTIFIED AREAS</span></h4>\n<div><a href="#">More Info</a></div>\n</div>',
    "eventName": "goToZSL",
    "display": false,
    "id": 5,
    "tooltip": "Explore Commodities",
    "imageBg": "./app/css/images/Slide-Picture5.jpg"
  }],

  "homeDialog": {
    "html": "<p>GFW Commodities is constantly undergoing site enhancements including interface redesigns based on user feedback and the incorporation of new datasets and new tools you asked for.</p>" +
    "<p>If you'd like to be kept informed of these kinds of updates, please <a href='http://www.wri.org/global-forest-watch-updates-and-newsletter' target='_blank'>join our mailing list</a>.</p>" +
    "<p>We will <strong>NEVER</strong> sell your email address to anyone, ever. We will only use your email address to send you useful newsletters about updates to the site or request your user feedback. You can unsubscribe at any time.</p>"
  }

});
