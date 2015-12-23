define([
  'lodash',
  'dojo/fx',
  'dojo/_base/fx',
  'dojo/Deferred',
  'components/alertsForm/AlertsForm',
  'components/alertsDialog/alertsDialog',
  'analysis/WizardStore',
  'analysis/Query',
  'analysis/config',
  'map/config'
], function (_, coreFx, Fx, Deferred, AlertsForm, AlertsDialog, WizardStore, AnalyzerQuery, AnalyzerConfig, MapConfig) {

  var alertsForm,
      alertsDialog,
      KEYS = AnalyzerConfig.STORE_KEYS,
      GENERIC_LAYER_IDS = {
        'Logging concession': 3,
        'Mining concession': 2,
        'Wood fiber plantation': 0,
        'Oil palm concession': 1//,
        //'RSPO Oil palm concession': 27
      },
      _isOpen = false,
      _initAlertsDialog,
      _animate,
      _open,
      _close,
      self = this;

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

  _getFeatureFromPopup = function (event) {
    var deferred,
        target = event.target,
        type = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
        label = target.dataset ? target.dataset.label : target.getAttribute('data-label'),
        id = target.dataset ? target.dataset.id : target.getAttribute('data-id'),
        url,
        layer,
        self = this;

    // Referenced from WizardHelper.js@analyzeAreaFromPopup
    if (type === 'AdminBoundary') {
      layer = MapConfig.adminUnitsLayer.layerId;
      url = MapConfig.adminUnitsLayer.url + '/' + layer;
    } else if (type === 'CertScheme') {
      layer = MapConfig.commercialEntitiesLayer.layerId;
      url = MapConfig.commercialEntitiesLayer.url + '/' + layer;
    } else if (type === 'MillPoint') {
      // deferred = AnalyzerQuery.getMillByEntityId(id);
      deferred = AnalyzerQuery.getMillByWriId(id);
    } else if (type === 'WDPA') {
      layer = MapConfig.palHelper.layerId;
      url = MapConfig.palHelper.url + '/' + layer;
    } else if (type === 'CustomGraphic') {
      deferred = new Deferred();
      layer = app.map.getLayer(MapConfig.customGraphicsLayer.id);
      deferred.resolve(_.find(layer.graphics, function (graphic) {return graphic.attributes.WRI_ID === parseInt(id)}) || false);
    } else if (GENERIC_LAYER_IDS[type] !== undefined) {
      layer = GENERIC_LAYER_IDS[type];
      url = MapConfig.oilPerm.url + '/' + layer;
    }

    if (deferred === undefined && url !== undefined) {
      deferred = AnalyzerQuery.getFeatureById(url, id);
    } else if (deferred === undefined) {
      throw new Error('Could not identify feature from event data.');
    }

    return deferred;
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
    },
    subscribeFromPopup: function (event) {
      var target = event.target,
          isCustomGraphic = (target.dataset ? target.dataset.type : target.getAttribute('data-type')) === 'CustomGraphic';

      self._getFeatureFromPopup(event).then(function (response) {

        if (response) {
          
          WizardStore.set(KEYS.alertsDialogActive, true);
          WizardStore.set(KEYS.selectedCustomFeatures, isCustomGraphic ? [response] : []);
          WizardStore.set(KEYS.selectedPresetFeature, isCustomGraphic ? null : response);
        } else {
          throw new Error('Could not identify feature from event data.');
        }
      });
      app.map.infoWindow.hide();
    }
  }
});
