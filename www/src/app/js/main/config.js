define({

  "title": "Global Forest Watch Commodities",

  "urls": {
    "gfw": "http://commodities.globalforestwatch.org/#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2ChansenLoss&wiz=open",
    "blog": "http://commodities.globalforestwatch.org/#v=map&x=114.37&y=2.08&l=5&lyrs=tcc%2ChansenLoss",
    "fires": "http://fires.globalforestwatch.org/map/#activeLayers=activeFires&activeBasemap=topo&x=115&y=0&z=5",
    "partnership": "http://blog.globalforestwatch.org/supplychain/partnership-launches-to-increase-transparency-and-traceability-across-supply-chains-and-meet-zero-deforestation-commitments.html",
    "supplierMonitoring": "http://commodities.globalforestwatch.org/#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2ChansenLoss&wiz=open",
    "SPOTT": "#"


  },

  "corsEnabledServers": [
    "https://api-ssl.bitly.com",
    "http://globalforestwatch.org",
    "http://firms.modaps.eosdis.nasa.gov",
    "http://gis-potico.wri.org",
    "http://gfw-apis.appspot.com",
    "https://storage.googleapis.com",
    "https://production-api.globalforestwatch.org"
  ],

  "homeModeOptions": [{
    "html": '<div class="home-slider-container">\n<h3>INITIATIVE LAUNCHED</h3>\n<h4><span>20 PARTNERS TO BUILD GLOBAL DECISION-SUPPORT TOOL</span>\n</h4>\n<div><a href="#">More Info</a></div>\n</div>',
    "eventName": "goToPartnership",
    "display": true,
    "id": 0,
    "tooltip": "Partnership",
    "imageBg": "./app/css/images/Slide-Picture7.jpg"
  }, {
    'html': '<div class="home-slider-container">\n<h3>PALM OIL RISK TOOL</h3>\n<h4><span>NEW GFW COMMODITIES TOOL MEASURES</span>\n<span>DEFORESTATION RISK AROUND PALM OIL MILLS</span></h4>\n<div><a href="./#v=map&x=-17.62&y=-0.89&l=3&lyrs=tcc%2ChansenLoss&wiz=open">More Info</a></div>\n</div>',
    'eventName': "goToWizard",
    'display': false,
    'id': 1,
    'tooltip': "Palm Oil Risk Tool",
    'imageBg': "./app/css/images/Slide-Picture6.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>COMMODITIES MAP</h3>\n<h4><span>EXPLORE THE</span>\n<span>COMMODITIES MAP</span></h4>\n<div><a href="./#v=map&x=114.37&y=1.99&l=5&lyrs=tcc%2ChansenLoss">More Info</a></div>\n</div>',
    "eventName": "goToMap",
    "display": false,
    "id": 2,
    "tooltip": "Commodities Map",
    "imageBg": "./app/css/images/Slide-Picture2.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>ANALYSIS</h3>\n<h4><span>ANALYZE FOREST COVER</span>\n<span>CHANGE IN A CONCESSION</span>\n<span>OR CUSTOM AREA</span></h4>\n<div><a href="./#v=map&x=104.27&y=1.99&l=5&lyrs=tcc%2ChansenLoss&wiz=open">More Info</a></div>\n</div>',
    "eventName": "goToAnalysis",
    "display": true,
    "id": 3,
    "tooltip": "Analysis",
    "imageBg": "./app/css/images/Slide-Picture1.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>SUPPLIER MONITORING</h3>\n<h4><span>MONITOR THE</span>\n<span>ACTIVITY NEAR</span>\n<span>PALM OIL MILLS</span></h4>\n<div><a href="./#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2ChansenLoss&wiz=open">More Info</a></div>\n</div>',
    "eventName": "goToSupplier",
    "display": false,
    "id": 4,
    "tooltip": "Supplier Monitoring",
    "imageBg": "./app/css/images/Slide-Picture4.jpg"
  // }, {
  //   "html": '<div class="home-slider-container">\n<h3>ALERTS</h3>\n<h4><span>SIGN UP FOR TREE</span>\n<span>CLEARANCE AND FIRE</span>\n<span>ALERTS FORS AREAS IN</span>\n<span>YOUR SUPPLY CHAIN</span></h4>\n<div><a href="#">More Info</a></div>\n</div>',
  //   "eventName": "goToFires",
  //   "display": false,
  //   "id": 4,
  //   "tooltip": "Alerts",
  //   "imageBg": "./app/css/images/Slide-Picture3.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>COMMODITIES</h3>\n<h4><span>ANALYZE LAND USE</span>\n<span>CHANGE WITHIN RSPO</span>\n<span>CERTIFIED AREAS</span></h4>\n<div><a href="#">More Info</a></div>\n</div>',
    "eventName": "goToPalm",
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
