/** @jsx React.DOM */
define([
  // libs
  'react',
  'lodash',
  // src
  'components/alertsDialog/config',
  'analysis/WizardStore',
  'utils/GeoHelper',
  'utils/Analytics',
  // esri/dojo
  'esri/geometry/Polygon',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/request/xhr',
  'dojox/validate/web'
], function (React, _, Config, WizardStore, GeoHelper, Analytics, Polygon, dom, domClass, Deferred, all, xhr, validate) {

  var AlertsDialog,
      getDefaultState,
      KEYS = Config.STORE_KEYS,
      IDS = Config.IDS,
      TEXT = Config.TEXT,
      self = this;

  // form attributes/text
  var pbVal,
      pbId1,
      pbId2,
      formaId = _.uniqueId(IDS.forma),
      firesId = _.uniqueId(IDS.fires),
      bufferId = _.uniqueId(IDS.buffer),
      emailId = _.uniqueId(IDS.email),
      subscriptionNameId = _.uniqueId(IDS.subscrpition);

  getDefaultState = function () {
    return {
      forma: false,
      fires: false,
      email: '',
      subscriptionName: '',
      features: WizardStore.get(KEYS.selectedCustomFeatures),
      presetFeature: WizardStore.get(KEYS.selectedPresetFeature)
    };
  }

  AlertsDialog = React.createClass({
    getInitialState: getDefaultState,

    componentDidMount: function () {
      WizardStore.registerCallback(KEYS.alertsDialogActive, function () {
        if (WizardStore.get(KEYS.alertsDialogActive)) {
          domClass.add(IDS.mount, 'active');
        } else {
          domClass.remove(IDS.mount, 'active');
        }
      }.bind(this));

      WizardStore.registerCallback(KEYS.customFeatures, function () {
        this.setState({features: WizardStore.get(KEYS.selectedCustomFeatures)});
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedCustomFeatures, function () {
        this.setState({features: WizardStore.get(KEYS.selectedCustomFeatures)});
        WizardStore.set(KEYS.selectedPresetFeature, null);
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedPresetFeature, function () {
        this.setState({presetFeature: WizardStore.get(KEYS.selectedPresetFeature)});

      }.bind(this));

      if (WizardStore.get(KEYS.alertsDialogActive) === true) {
        domClass.add(IDS.mount, 'active');
      }
    },

    render: function () {
      var features = this.state.features,
          presetFeature = this.state.presetFeature,
          selection,
          featuresContainsPoint,
          disable,
          disableConditions,
          hiddenConditions,
          radiusSelect;

      if (presetFeature !== null) {

        featuresContainsPoint = presetFeature.geometry.type === 'point';
        selection = presetFeature.attributes.WRI_label ||
                    presetFeature.attributes.Name ||
                    presetFeature.attributes.name ||
                    presetFeature.attributes.NAME ||
                    presetFeature.attributes.Mill_name ||
                    TEXT.noSelection;

      } else {
        featuresContainsPoint = _.find(features, function (feature) {return feature.geometry.type === 'point'}) ? true : false;
        selection = features.length > 0 ? features.map(function (feature) {return feature.attributes.WRI_label}).join(', ') : TEXT.noSelection;
      }

      if (featuresContainsPoint) {
        radiusSelect = (
          <div className='margin__bottom'>
            <div className='margin--small__left'>{TEXT.bufferLabel}</div>
            <span className='margin--small__left'>{TEXT.bufferOptionsLabel}</span>
            <select id={bufferId} className='margin__left'>
              {TEXT.bufferOptions.map(function (option) {
                return <option value={option[0]}>{option[1]}</option>
              })}
            </select>
          </div>
        )
      }
      hiddenConditions = [
        selection === TEXT.noSelection
      ]

      disableConditions = [
        features.length === 0 && presetFeature === null,
        this.state.subscriptionName.trim().length === 0,
        this.state.email.trim().length === 0,
        !validate.isEmailAddress(this.state.email),
        this.state.forma !== true && this.state.fires !== true

      ]

      disabled = disableConditions.indexOf(true) > -1;

      pbId1 = 'pb_' + _.random(1,100).toString();
      pbId2 = 'pb_' + _.random(1,100).toString();
      // Set default once because React doesn't update defaultValue
      pbVal = pbVal || pbId1 + pbId2;

      // <div className='margin__bottom'>
      //   <label className='vertical-middle'>
      //     <input id={formaId} className='vertical-middle' type='checkbox' onChange={this._formChange} checked={this.state.forma} />
      //     {TEXT.forma}
      //   </label>
      // </div>

      return (
        <div className='alerts-dialog'>
          <div className='close-icon' onClick={this._close}></div>
          <div className='modal-content'>
            <div className='alerts-form__form no-wide border-box'>
              <div className='modal-header'>{TEXT.title}</div>
              <div className='margin__bottom margin--small__left'>
                <span>{TEXT.selectionLabel}</span>
                <span className={'padding__left' + (disableConditions[0] ? ' text-red' : ' text-gold')} title={selection}>
                  {selection.substr(0, 75)}
                  {selection.length > 75 ? '...' : ''}
                </span>
              </div>
              <div className='margin--small__wide'>
                <div className='font-12px text-red margin__top' style={{visibility: disableConditions[4] ? 'visible' : 'hidden'}}>
                  {TEXT.requiredLabels.alerts}
                </div>
              </div>

              <div className=''>
                <label className='margin--small__bottom vertical-middle'>
                  <input id={firesId} className='vertical-middle' type='checkbox' onChange={this._formChange} checked={this.state.fires} />
                  {TEXT.fires}
                </label>
              </div>
              <div className='pooh-bear text-center'>
                <div className='pooh-bear'>Please leave this blank</div>
                <input id={pbId1} className='pooh-bear' type='text' name='name' />
              </div>
              <div className='margin--small__wide font-12px text-red margin__top' style={{visibility: disableConditions[1] ? 'visible' : 'hidden'}}>
                {TEXT.requiredLabels.subscription}
              </div>
              <div className='text-left margin__bottom margin--small__wide'>
                <input id={subscriptionNameId} className='border-medium-gray border-radius' maxLength={toString(Config.MAX_INPUT_CHARS)} type='text' onChange={this._formChange} value={this.state.subscriptionName} placeholder={TEXT.subscriptionPlaceholder} />
                <button className='margin__left font-16px text-white back-orange no-border border-radius' onClick={this._setDefaultSubscriptionName} disabled={disableConditions[0]} style={{display: hiddenConditions[0] ? 'none' : 'inline-block'}}>{TEXT.subscriptionDefaultLabel}</button>
              </div>
              <div className='margin--small__wide font-12px text-red margin__top' style={{visibility: disableConditions[3] ? 'visible' : 'hidden'}}>
                {TEXT.requiredLabels.email}
              </div>
              <div className='text-left margin__bottom margin--small__wide'>
                <input id={emailId} className='border-medium-gray border-radius' maxLength={toString(Config.MAX_INPUT_CHARS)} type='text' onChange={this._formChange} value={this.state.email} placeholder={TEXT.emailPlaceholder} />
              </div>
              <div className='pooh-bear text-center'>
                <div className='pooh-bear'>Please do not change this field</div>
                <input id={pbId2} className='pooh-bear' type='text' name='address' defaultValue={pbVal} />
              </div>
              {radiusSelect}
              <div className='text-center margin__bottom'>
                <button className='text-white back-orange no-border border-radius font-16px' onClick={this._subscribe} disabled={disabled}>
                  <img className='vertical-sub' width='21px' height='19px' src={'app/css/images/alert_symbol_' + (disabled ? 'gray' : 'white') + '.png'} />
                  <span className='padding__left'>{TEXT.subscribe}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },

    _close: function () {
      WizardStore.set(KEYS.alertsDialogActive, !WizardStore.get(KEYS.alertsDialogActive));
    },

    _formChange: function (event) {
      var state = {
        // forma: dom.byId(formaId).checked,
        fires: dom.byId(firesId).checked,
        subscriptionName: dom.byId(subscriptionNameId).value,
        email: dom.byId(emailId).value
      };
      this.setState(state);
    },

    _subscribeToFires: function (unionedPolygon, subscriptionName, email) {
      var deferred = new Deferred(),
          messagesConfig = TEXT.messages,
          firesConfig = Config.requests.fires,
          url = firesConfig.url,
          options = _.cloneDeep(firesConfig.options);

      options.data.features = JSON.stringify({
        rings: unionedPolygon.rings,
        spatialReference: unionedPolygon.spatialReference
      });
      options.data.msg_addr = email;
      options.data.area_name = subscriptionName;
      xhr(url, options).then(function (response) {
        deferred.resolve((response.message && response.message === firesConfig.successMessage) ? messagesConfig.fireSuccess : messagesConfig.fireFail);
      });

      Analytics.sendEvent('Subscribe', 'Fire Alerts', 'User is subscribing to Fire Alerts.');

      return deferred.promise;
    },

    _subscribeToForma: function (geoJson, subscriptionName, email) {
      var deferred = new Deferred(),
          messagesConfig = TEXT.messages,
          url = Config.requests.forma.url,
          options = _.cloneDeep(Config.requests.forma.options),
          data = JSON.stringify({
            topic: options.data.topic,
            email: email,
            geom: '{"type": "' + geoJson.type + '", "coordinates":[' + JSON.stringify(geoJson.geom) + ']}'
          }),
          request = new XMLHttpRequest()
          self = this;

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          deferred.resolve((JSON.parse(request.response).subscribe) ? messagesConfig.formaSuccess : messagesConfig.formaFail);
        }
      };
      request.addEventListener('error', function () {
        deferred.resolve(false);
      }, false);
      request.open(options.method, url, true);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.send(data);

      Analytics.sendEvent('Subscribe', 'Monthly Clearance Alerts', 'User is subscribing to Monthly Clearance Alerts.');

      return deferred.promise;
    },


    _subscribe: function () {
      // honeypot short-circuit
      if ( (dom.byId(pbId1) == null || dom.byId(pbId2) == null) || (dom.byId(pbId1).value.length > 0 || dom.byId(pbId2).value !== pbVal) ) {
        return;
      }

      var features = this.state.features,
          presetFeature = this.state.presetFeature,
          featuresContainsPoint,
          polygons,
          pointsAsPolygons,
          radius,
          subscriptions = [];

      if (presetFeature !== null) {
        features = [presetFeature];
        featuresContainsPoint = features[0].geometry.type === 'point';
      } else {
        featuresContainsPoint = _.find(features, function (feature) {return feature.geometry.type === 'point'}) ? true : false;
      }

      if (featuresContainsPoint) {
        radius = parseInt(dom.byId(bufferId).value);
        pointsAsPolygons = _.filter(features, function (feature) {return feature.geometry.type === 'point'});
        pointsAsPolygons = pointsAsPolygons.map(function (point) {return GeoHelper.preparePointAsPolygon(point, radius);});
        pointsAsPolygons = pointsAsPolygons.map(function (point) {return new Polygon(GeoHelper.getSpatialReference()).addRing(point.geometry.rings[point.geometry.rings.length - 1]);});
        features = _.filter(features, function (feature) {return feature.geometry.type !== 'point'});
        polygons = features.map(function (feature) {
          var polygon = new Polygon(GeoHelper.getSpatialReference());
          polygon.rings = feature.geometry.rings;
          return polygon;
        });
        polygons = polygons.concat(pointsAsPolygons);
      } else {
        polygons = features.map(function (feature) {
          var polygon = new Polygon(GeoHelper.getSpatialReference());
          polygon.rings = feature.geometry.rings;
          return polygon;
        });
      }

      GeoHelper.union(polygons).then(function (unionedPolygon) {
        // if (this.state.forma === true) {
        //   subscriptions.push(this._subscribeToForma(GeoHelper.convertGeometryToGeometric(unionedPolygon), this.state.subscriptionName.trim(), this.state.email.trim()));
        // }
        if (this.state.fires === true) {
          subscriptions.push(this._subscribeToFires(unionedPolygon, this.state.subscriptionName.trim(), this.state.email.trim()));
        }

        all(subscriptions).then(function (responses) {
          // alert(responses.join('\n'));
          console.log(responses.join('\n'));
        });
      }.bind(this));

      this._close();
    },

    _setDefaultSubscriptionName: function () {
      var feature = this.state.presetFeature !== null ? this.state.presetFeature : this.state.features[0],
          subscriptionName = feature.attributes.WRI_label ||
                              feature.attributes.Name ||
                              feature.attributes.NAME ||
                              feature.attributes.Mill_name ||
                              '';
      this.setState({subscriptionName: subscriptionName.substr(0, Config.MAX_INPUT_CHARS)});
    }

  });

  return function () {
    return React.render(React.createElement(AlertsDialog, null), dom.byId(IDS.mount));
  };
});
