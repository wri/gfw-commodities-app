define([
	"dojo/dom-class",
	"dojo/dom-geometry",
  "analysis/WizardHelper",
  "utils/AlertsHelper",
  "dojo/_base/window",
  "dojo/_base/connect",
  "dojo/_base/fx",
  "dojo/fx",
	"dojo/on"
], function (domClass, domGeom, WizardHelper, AlertsHelper, win, connect, Fx, coreFx, on) {
	'use strict';

  var _mapContainer,
      _getMapAnimation,
      ANIMATION_DURATION = 500,
      WIZARD_WIDTH = 510,
      self = this;

  _getMapAnimation = function (leftAnimationValue, resize, originalCenterPoint) {
    _mapContainer = _mapContainer || document.getElementById('map-container')
    // var originalCenterPoint = app.map.extent.getCenter(),
    var resize = resize || true,
        beforeBegin = function () {
          if (resize === true) {
            on.once(app.map, 'resize', function () {
              app.map.centerAt(originalCenterPoint);
            });
          }
        },
        onEnd = function () {
          if (resize === true) {
            app.map.resize(true);
          }
        },
        animation = {
          node:_mapContainer,
          properties: {
            left: leftAnimationValue
          },
          duration: ANIMATION_DURATION,
          beforeBegin: beforeBegin,
          onEnd: onEnd
        };
    return Fx.animateProperty(animation);
  };

  return {
  	enableLayout: function () {
  		var body = win.body(),
  				width = domGeom.position(body).w;

  		if (width < 960) {
  			domClass.add(body, "mobile");
  		}
  	},
    toggleWizard: function () {
      var preAnimation,
          originalCenterPoint = app.map.extent.getCenter();
      if (AlertsHelper.isOpen() === true) {
        preAnimation = coreFx.combine([AlertsHelper.toggleAlertsForm()].concat([_getMapAnimation(0, false)]));
        connect.connect(preAnimation, 'onEnd', function() {
          coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0, true, originalCenterPoint))).play();
        });
        preAnimation.play();
      } else {
        coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0, true, originalCenterPoint))).play();
      }
    },
    toggleAlerts: function () {
      var preAnimation,
          originalCenterPoint = app.map.extent.getCenter();
      if (WizardHelper.isOpen() === true) {
        preAnimation = coreFx.combine(WizardHelper.toggleWizard().concat([_getMapAnimation(0, false)]));
        connect.connect(preAnimation, 'onEnd', function() {
          coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH, true, originalCenterPoint)]).play();
        });
        preAnimation.play();
      } else {
        coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH, true, originalCenterPoint)]).play();
      }
    }
  };
});
