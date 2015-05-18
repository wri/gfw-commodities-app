define([
  'dojo/fx',
  'dojo/_base/fx',
  'dojo/Deferred',
  'components/alertsForm/AlertsForm',
  'components/alertsDialog/alertsDialog',
  'analysis/WizardStore',
  'analysis/config',
  'map/config'
], function (coreFx, Fx, Deferred, AlertsForm, AlertsDialog, WizardStore, AnalyzerConfig, MapConfig) {

  var alertsForm,
      alertsDialog,
      KEYS = AnalyzerConfig.STORE_KEYS,
      _isOpen = false,
      _initAlertsDialog,
      _animate,
      _open,
      _close;

  _initAlertsDialog = function () {
    alertsDialog = alertsDialog || new AlertsDialog();
  }

  _animate = function (alertsFormWidth) {
    var animations,
        orignalCenterPoint = app.map.extent.getCenter();
        alertsFormWidth = alertsFormWidth || 0;
        duration = 500;

    return Fx.animateProperty({
      node: document.getElementById('alerts-form-container'),
      properties: {
        width: alertsFormWidth
      },
      duration: duration,
      onEnd: function () {
        _isOpen = !_isOpen;
      }
    });
  }

  _toggle = function () {
    WizardStore.set(KEYS.selectedCustomFeatures, []);
    return !_isOpen ? _animate(460) : _animate(0);
  }

  // NOTE: Below code is necessary to init dialog
  WizardStore.registerCallback(KEYS.alertsDialogActive, _initAlertsDialog);

  return {
    toggleAlertsForm: function () {
      alertsForm = alertsForm || new AlertsForm({}, 'alerts-form');
      return _toggle();
    },
    isOpen: function () {
      return _isOpen;
    }
  }
});
