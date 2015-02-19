define([
	"esri/Color",
	"esri/units",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Circle",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol"
], function (Color, Units, Graphic, Point, Circle, SimpleLineSymbol, SimpleFillSymbol) {

  var polySymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                   new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
                   new Color([255, 200, 103, 0.0]));

	return {

		preparePointAsPolygon: function (pointFeature) {
      console.dir(pointFeature);
			var longitude = pointFeature.attributes.Longitude,
          latitude = pointFeature.attributes.Latitude,
          circle = new Circle(new Point(pointFeature.geometry), {
            "radius": 50,
            "radiusUnit": Units.KILOMETERS
          });

      return new Graphic(circle, polySymbol, pointFeature.attributes);
		},

    applySelectionSymbolToFeature: function (feature) {
      return new Graphic(feature.geometry, polySymbol, feature.attributes);
    },

    zoomToFeature: function (feature) {
      if (feature.geometry.center) {
        app.map.centerAndZoom(feature.geometry.center, 9);
      } else {
        app.map.setExtent(feature.geometry.getExtent(), true);
      }
    }

	};

});