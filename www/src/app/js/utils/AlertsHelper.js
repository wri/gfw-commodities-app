define([
  'dojo/fx',
  'dojo/_base/fx',
  'dojo/Deferred',
  'components/alertsForm/AlertsForm',
  'components/alertsDialog/alertsDialog',
  'analysis/WizardHelper',
  'analysis/WizardStore',
  'analysis/config',
  'map/config'
], function (coreFx, Fx, Deferred, AlertsForm, AlertsDialog, WizardHelper, WizardStore, AnalyzerConfig, MapConfig) {

  var alertsForm,
      alertsDialog,
      isOpen = false,
      KEYS = AnalyzerConfig.STORE_KEYS,
      _initAlertsDialog,
      _animate,
      _open,
      _close;

  _initAlertsDialog = function () {
    alertsDialog = alertsDialog || new AlertsDialog();
  }

  _animate = function (alertsFormWidth) {
    var animations,
        deferred = new Deferred();
        orignalCenterPoint = app.map.extent.getCenter();
        alertsFormWidth = alertsFormWidth || 0;
        duration = 500;

    animations = [
      // alertsForm animation
      {
        node: document.getElementById('alerts-form-container'),
        properties: {
          width: alertsFormWidth
        },
        duration: duration
      },
      // map animation
      {
        node: document.getElementById("map-container"),
        properties: {
          left: alertsFormWidth
        },
        duration: duration,
        onEnd: function () {
          app.map.resize(true);
          app.map.centerAt(orignalCenterPoint);
          deferred.resolve(true);
        }
      }
    ]

    animations = animations.map(function (animation){ return Fx.animateProperty(animation); });
    coreFx.combine(animations).play();

    return deferred;
  }

  _open = function () {
    _animate(460).then(function () {
      isOpen = true;
    });
  }

  _close = function () {
    _animate(0).then(function () {
      isOpen = false;
    });
  },

  _toggle = function () {
    // open/close toggle, handling open wizard if necessary
    if (!isOpen) {
      if (WizardHelper.isOpen()) {
        WizardHelper.toggleWizard().then(_open);
      } else {
        _open();
      }
    } else {
      _close();
    }
    WizardStore.set(KEYS.selectedCustomFeatures, []);
  }

  // NOTE: Below code is necessary to init dialog
  WizardStore.registerCallback(KEYS.alertsDialogActive, _initAlertsDialog);

  return {
    toggleAlertsForm: function () {
      alertsForm = alertsForm || new AlertsForm({toggle:_toggle}, 'alerts-form');
      _toggle();
    },

    isOpen: isOpen
  }
});
