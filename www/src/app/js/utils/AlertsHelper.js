define([
  'dojo/fx',
  'dojo/_base/fx',
  'dojo/Deferred',
  'components/alertsForm/AlertsForm',
  'components/alertsDialog/alertsDialog',
  'utils/Helper',
  'analysis/WizardHelper',
  'analysis/WizardStore',
  'analysis/config',
  'map/config',
  'exports'
], function (coreFx, Fx, Deferred, AlertsForm, AlertsDialog, Helper, WizardHelper, WizardStore, AnalyzerConfig, MapConfig, exports) {

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

  exports.toggleAlertsForm =  function () {
    alertsForm = alertsForm || new AlertsForm({toggle:Helper.toggleAlerts}, 'alerts-form');
    return _toggle();
  };
  exports.isOpen = function () {
    return _isOpen;
  };
});
