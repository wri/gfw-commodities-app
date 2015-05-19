define([
	"dojo/dom-class",
	"dojo/dom-geometry",
  "analysis/WizardHelper",
  "utils/AlertsHelper",
  "dojo/_base/window",
  "dojo/_base/connect",
  "dojo/_base/fx",
	"dojo/fx"
], function (domClass, domGeom, WizardHelper, AlertsHelper, win, connect, Fx, coreFx) {
	'use strict';

  var _mapContainer,
      _getMapAnimation,
      ANIMATION_DURATION = 500,
      WIZARD_WIDTH = 460,
      self = this;

  _getMapAnimation = function (leftAnimationValue, resize) {
    _mapContainer = _mapContainer || document.getElementById('map-container')
    var originalCenterPoint = app.map.extent.getCenter(),
        resize = resize || true,
        onEnd = resize ? function () { app.map.resize(true); app.map.centerAt(originalCenterPoint) } : function () {},
        animation = {
          node:_mapContainer,
          properties: {
            left: leftAnimationValue
          },
          duration: ANIMATION_DURATION,
          onEnd: onEnd
        };
    return Fx.animateProperty(animation);
  }

  return {
  	enableLayout: function () {
  		var body = win.body(),
  				width = domGeom.position(body).w;

  		if (width < 960) {
  			domClass.add(body, "mobile");
  		}
  	},
    toggleWizard: function () {
      var preAnimation;
      if (AlertsHelper.isOpen() === true) {
        preAnimation = coreFx.combine([AlertsHelper.toggleAlertsForm()].concat([_getMapAnimation(0, false)]));
        connect.connect(preAnimation, 'onEnd', function() {
          coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0))).play();
        });
        preAnimation.play();
      } else {
        coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0))).play();
      }
    },
    toggleAlerts: function () {
      var preAnimation;
      if (WizardHelper.isOpen() === true) {
        preAnimation = coreFx.combine(WizardHelper.toggleWizard().concat([_getMapAnimation(0, false)]));
        connect.connect(preAnimation, 'onEnd', function() {
          coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH)]).play();
        });
        preAnimation.play();
      } else {
        coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH)]).play();
      }
    }
  }
});
