define([
  "map/config",
  "map/Symbols",
	"esri/units",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Circle"
], function (MapConfig, Symbols, Units, Graphic, Point, Circle) {

	return {

		preparePointAsPolygon: function (pointFeature) {
			var longitude = pointFeature.attributes.Longitude,
          latitude = pointFeature.attributes.Latitude,
          circle = new Circle(new Point(pointFeature.geometry), {
            "radius": 50,
            "radiusUnit": Units.KILOMETERS
          });

      return new Graphic(circle, Symbols.getPolygonSymbol(), pointFeature.attributes);
		},

    applySelectionSymbolToFeature: function (feature) {
      return new Graphic(feature.geometry, Symbols.getPolygonSymbol(), feature.attributes);
    },

    zoomToFeature: function (feature) {
      if (feature.geometry.x) {
        app.map.centerAndZoom(feature.geometry, 9);
      } else if (feature.geometry.center) {
        app.map.centerAndZoom(feature.geometry.center, 9);
      } else {
        app.map.setExtent(feature.geometry.getExtent(), true);
      }
    },

    /**
    * Return the next highest unique id, using WRI_ID as the unique id field
    */
    nextCustomFeatureId: function () {
      var graphicsLayer = app.map.getLayer(MapConfig.customGraphicsLayer.id),
          graphics = graphicsLayer.graphics,
          length = graphics.length,
          next = 0,
          index,
          temp;

      for (index = 0; index < length; index++) {
        temp = parseInt(graphics[index].attributes.WRI_ID);
        if (!isNaN(temp)) {
          next = Math.max(next, temp);
        }
      }
      return (next + 1);
    },

	};

});