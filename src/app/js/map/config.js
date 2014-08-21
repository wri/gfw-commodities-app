define({

	mapOptions: {
		basemap: 'gray',
		centerX: 0,
		centerY: 0,
		zoom: 3,
		sliderPosition: "top-right"
	},

	// Keys Match list below which builds the Master Layer UI List
	tcc: {
		id: "TreeCoverChange"
	},
	gain: {
		id: "Gain",
		url: "http://50.18.182.188:6080/arcgis/rest/services/ForestGain_2000_2012/ImageServer"
	},
	loss: {
		id: "Loss",
		url: "http://50.18.182.188:6080/arcgis/rest/services/ForestCover_lossyear/ImageServer",
		defaultRange: [1, 13],
		colormap: [[1, 219, 101, 152]]
	},
	forma: {
		id: "FormaAlerts",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/FORMA50/ImageServer",
		defaultRange: [1, 19],
		colormap: [[1, 255, 0, 197]]
	},
	fires: {
		id: "ActiveFires",
		url: "http://gis-potico.wri.org/arcgis/rest/services/Fires/Global_Fires/MapServer",
		defaultLayers: [0, 1, 2, 3]
	},
	tcd: {
		id: "TreeCoverDensity",
		url: "http://50.18.182.188:6080/arcgis/rest/services/TreeCover2000/ImageServer"
	},

	/***** THE FOLLOWING ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER FORESTCOVER *****/
	ifl: {
		id: "ForestCover",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 24
	},
	peat: {
		id: "ForestCover",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 1
	},
	tfcs: {
		id: "ForestCover",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 23
	},
	ldcover: {
		id: "ForestCover",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 22
	},
	legal: {
		id: "ForestCover",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 9
	},
	/***** THE PREVIOUS ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER FORESTCOVER *****/
	/***** THE FOLLOWING ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER FORESTUSE *****/
	oilPerm: {
		id: "ForestUse",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 32
	},
	logPerm: {
		id: "ForestUse",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 10
	},
	minePerm: {
		id: "ForestUse",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 26
	},
	woodPerm: {
		id: "ForestUse",
		url: "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer",
		layerId: 28
	},
	/***** THE PREVIOUS ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER FORESTUSE *****/

	// BELOW IS the data structure that will build the layer list widget
	// The Keys below match the keys above and tie these UI elements to the correct layer config
	// If the layer does nothing or is none, then no key needs to be provided above
	// Required properties are key, title, subtitle, filter, and type

	layersUI: [
		{
      key: "tcc",
      title: "Tree Cover Change",
      subtitle: "(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)",
      filter: "forest-change",
      type: "radio",
      children: [
      	{
          key: "loss",
          title: "Loss",
          subtitle: "",
          filter: "forest-change",
          type: "check"
        },
        {
          key: "gain",
          title: "Gain",
          subtitle: "",
          filter: "forest-change",
          type: "check"
        }
      ]
    },
    {
      key: "forma",
      title: "FORMA Alerts",
      subtitle: "(monthly, 500m, humid tropics)",
      filter: "forest-change",
      type: "radio"
    },
    {
      key: "fires",
      title: "Active Fires",
      subtitle: "(past 7 days, 1km, global; NASA)",
      filter: "forest-change",
      type: "radio"
    },
    {
      key: "none_fc",
      title: "None",
      subtitle: "",
      filter: "forest-change",
      type: "radio"
    },
    {
      key: "tcd",
      title: "Tree Cover Density",
      subtitle: "(year 2000, 30m global)",
      filter: "forest-cover",
      type: "radio"
    },
    {
      key: "ifl",
      title: "Intact Forest Landscapes",
      subtitle: "(year 2000, 30m global)",
      filter: "forest-cover",
      type: "radio"
    },
    {
      key: "peat",
      title: "Peat Lands",
      subtitle: "(year 2002, Indonesia)",
      filter: "forest-cover",
      type: "radio"
    },
    {
      key: "tfcs",
      title: "Tropical Carbon Stocks",
      subtitle: "(early 2000s, 1km, tropics)",
      filter: "forest-cover",
      type: "radio"
    },
    {
      key: "ldcover",
      title: "Land Cover",
      subtitle: "(mid 2000s, global)",
      filter: "forest-cover",
      type: "radio"
    },
    {
      key: "legal",
      title: "Legal Classifications",
      subtitle: "(year 2010, select countries)",
      filter: "forest-cover",
      type: "radio"
    },
    {
      key: "none_fch",
      title: "None",
      subtitle: "",
      filter: "forest-cover",
      type: "radio"
    },
    {
      key: "oilPerm",
      title: "Oil Palm",
      subtitle: "(varies, select countries)",
      filter: "forest-use",
      type: "check"
    },
    {
      key: "logPerm",
      title: "Logging",
      subtitle: "(varies, select countries)",
      filter: "forest-use",
      type: "check"
    },
    {
      key: "minePerm",
      title: "Mining",
      subtitle: "(varies, select countries)",
      filter: "forest-use",
      type: "check"
    },
    {
      key: "woodPerm",
      title: "Wood fiber plantations",
      subtitle: "(varies, select countries)",
      filter: "forest-use",
      type: "check"
    }
	]

});