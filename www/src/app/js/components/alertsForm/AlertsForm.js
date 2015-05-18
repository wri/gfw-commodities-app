define([
  // libs
  'react',
  'lodash',
  // src
  'analysis/WizardStore',
  'components/alertsForm/config',
  'components/featureList/FeatureList',
  'map/config',
  'map/MapModel',
  'map/Uploader',
  'map/Symbols',
  'utils/GeoHelper',
  // esri/dojo
  'esri/graphic',
  'esri/geometry/Polygon',
  'esri/toolbars/draw',
  'dojo/topic',
  'dojo/dom',
  'dojo/query',
  'dojo/dom-class',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/request/xhr',
  'dojox/validate/web'
], function (React, _, WizardStore, AlertsConfig, FeatureList, MapConfig, MapModel, Uploader, Symbols, GeoHelper, Graphic, Polygon, Draw, topic, dom, dojoQuery, domClass, Deferred, all, xhr, validate) {

  var AlertsForm,
      drawToolbar,
      activeTool,
      TEXT = AlertsConfig.TEXT,
      KEYS = AlertsConfig.STORE_KEYS,
      getDefaultState,
      pbVal,
      pbId1,
      pbId2,
      formaId = _.uniqueId(),
      firesId = _.uniqueId(),
      emailId = _.uniqueId(),
      subscriptionNameId = _.uniqueId(),
      modal,
      formaChecked = false,
      firesChecked = false,
      subscriptionName = '',
      email = '',
      self = this;

  getDefaultState = function () {
    return {
      features: WizardStore.get(KEYS.customFeatures),
      selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures),
      modalOpen: false
    }
  }

  AlertsForm = React.createClass({

    getInitialState: getDefaultState,

    componentDidMount: function () {
      drawToolbar = new Draw(app.map);
      drawToolbar.on('draw-end', this._drawComplete);

      WizardStore.registerCallback(KEYS.customFeatures, function () {
        this.setState({features: WizardStore.get(KEYS.customFeatures)});
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedCustomFeatures, function () {
        this.setState({selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures)});
      }.bind(this));

      this.setState(getDefaultState());
    },

    componentWillReceiveProps: function (newProps) {
      // Update state with newly received props
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        this._deactivateToolbar();
        this._removeActiveClass();
      }
    },

    componentDidUpdate: function (prevProps, prevState) {
      if (prevState.modalOpen === true) {
        this._renderModal()
      }
    },

    render: function () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures),
          currentSelectionLabel = currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label}).join(',') : TEXT.noSelection,
          self = this;

      pbId1 = 'pb_' + _.random(1,100).toString();
      pbId2 = 'pb_' + _.random(1,100).toString();
      // Set default once because React doesn't update defaultValue
      pbVal = pbVal || pbId1 + pbId2;

      return (
        React.DOM.div({className: 'relative fill'},
          // Header
          React.DOM.div({className: 'alerts-form__header'},
            React.DOM.div({className: 'fill__long border-box padding'}, TEXT.title),
            React.DOM.button({'onClick': this._toggle, className: 'alerts-form__header__exit back-white absolute no-top no-right no-padding fill__long pointer'}, 
              React.DOM.img({'className': 'vertical-middle', 'src': 'app/css/images/close_symbol.png'})
            )
          ),
          // Body
          React.DOM.div({className: 'alerts-form__body'}, 
            // Tools
            React.DOM.div({'className':'padding__wide padding__top'},
              React.DOM.div({'className':'margin__bottom'}, AlertsConfig.customArea.instructions),
              React.DOM.div({'className':'text-center margin__bottom'},
                React.DOM.button({'className':'alerts-form__drawing-tool back-light-gray no-border border-radius margin padding pointer', 'onClick': this._activateToolbar, 'data-geometry-type': Draw.FREEHAND_POLYGON}, AlertsConfig.customArea.freehandLabel),
                React.DOM.button({'className':'alerts-form__drawing-tool back-light-gray no-border border-radius margin padding pointer', 'onClick': this._activateToolbar, 'data-geometry-type': Draw.POLYGON}, AlertsConfig.customArea.polyLabel),
                React.DOM.button({'className':'alerts-form__drawing-tool back-light-gray no-border border-radius margin padding pointer', 'onClick': Uploader.toggle.bind(Uploader), 'id':'alerts-draw-upload' }, AlertsConfig.customArea.uploadLabel)
              )
            ),
            // Features
            new FeatureList({'features': this.state.features, 'selectedFeatures': this.state.selectedFeatures})
          ),
          // Footer
          React.DOM.div({className:'alerts-form__footer'}, 
            React.DOM.div({className:'inline-block padding__left'}, TEXT.selection),
            React.DOM.div({className:'alerts-form__footer__selection absolute inline-block padding__wide text-gold ellipsis border-box', title:currentSelectionLabel}, currentSelectionLabel),
            // React.DOM.button({className:'text-white back-orange no-border fill__long pointer absolute no-right no-top', onClick:this._subscribeToAlerts, disabled:(this.state.modalOpen || this.state.selectedFeatures.length === 0)}, TEXT.subscribe)
            React.DOM.button({className:'text-white back-orange no-border fill__long pointer absolute no-right no-top', onClick:this._subscribeToAlerts}, TEXT.subscribe)
          )
        )
      );
    },

    _modal: function () {
      // TODO: refactor into own component
      var radiusSelect,
          modalMount = document.getElementById(AlertsConfig.MODAL_ID),
          selectedFeatures = this.state.selectedFeatures,
          selectionContainsPoint = _.find(selectedFeatures, function (feature) {return feature.geometry.type === 'point'}) ? true : false,
          self = this,
          close = function () {
            domClass.toggle(AlertsConfig.MODAL_ID, 'active');
            subscriptionName = '';
            self.setState({modalOpen:false});
            setTimeout(function () {React.unmountComponentAtNode(modalMount)}, 750);
          },
          emailChange = function (event) {
            email = event.target.value;
            self._renderModal();
          },
          formaChange = function (event) {
            formaChecked = event.target.checked;
            self._renderModal();
          },
          firesChange = function (event) {
            firesChecked = event.target.checked;
            self._renderModal();
          },
          subscribeClick = function (event) {
            validations = [
              // [!validate.isEmailAddress(emailAddr), messagesConfig.invalidEmail],
              // [!formaCheck && !firesCheck, messagesConfig.noSelection],
              // [!formaCheck && !firesCheck, messagesConfig.noSelection],
              // [!subscriptionName || subscriptionName.length === 0, messagesConfig.noSelectionName],
              // [selectedFeatures.length === 0, messagesConfig.noAreaSelection]
            ].filter(function (validation) {
              return validation[0];
            }).map(function (validation) {
              return validation[1];
            }).join('\n');

            if (validations.length > 0) {
              alert(AlertsConfig.messagesLabel + validations);
            } else {
              // Map feature geometries to new Polygons for SpatialReference for union
              // buffer points to circles if exist
              polygons = selectedFeatures.map(function (feature) {
                return feature.geometry.type === 'point' ? GeoHelper.preparePointAsPolygon(feature) : feature;
              }).map(function (feature) {
                return new Polygon(GeoHelper.getSpatialReference()).addRing(feature.geometry.rings[feature.geometry.rings.length - 1]);;
              });
              GeoHelper.union(polygons).then(function (unionedPolygon) {
                debugger;
                // if (firesCheck) {
                //   subscriptions.push(self._subscribeToFires(unionedPolygon, subscriptionName, emailAddr));
                // }
                // if (formaCheck) {
                //   subscriptions.push(self._subscribeToForma(GeoHelper.convertGeometryToGeometric(unionedPolygon), subscriptionName, emailAddr));
                // }

                // all(subscriptions).then(function (responses) {
                //   alert(responses.join('\n'))
                // });
              });
            }

          };

      if (selectedFeatures.length == 1) {
        subscriptionName = selectedFeatures[0].attributes.WRI_label ;
      }

      if (selectionContainsPoint) {
        radiusSelect = React.DOM.div({className:'margin__bottom'}, 
          React.DOM.span({className:'margin__left'}, 'Buffer size:'),
          React.DOM.select({className:'margin__left'},
            TEXT.bufferOptions.map(function (option) {
              return React.DOM.option({value:option[0]}, option[1]);
            })
          )
        );
      }

      return (
        React.DOM.div(null,
          React.DOM.div({className:'close-icon', onClick:close}),
          React.DOM.div({className:'modal-content'},
            React.DOM.div({'className':'alerts-form__form no-wide border-box'},
              React.DOM.div({className:'modal-header'}, TEXT.modalTitle),
              React.DOM.div({className:'margin__bottom'},
                React.DOM.input({className:'vertical-middle', type: 'checkbox', checked:formaChecked, onChange:formaChange, id:formaId}),
                React.DOM.label({className:'vertical-middle', htmlFor:formaId}, TEXT.forma)
              ),
              React.DOM.div({className:'margin__bottom'},
                React.DOM.input({className:'vertical-middle', type: 'checkbox', checked:firesChecked, onChange:firesChange, id:firesId}),
                React.DOM.label({className:'vertical-middle', htmlFor:firesId}, TEXT.fires)
              ),
              React.DOM.div({className:'pooh-bear text-center'},
                React.DOM.div({className:'pooh-bear'}, 'Please leave this blank'),
                React.DOM.input({id:pbId1, className:'pooh-bear', type:'text', name:'name'})
              ),
              radiusSelect,
              React.DOM.div({className:'text-center margin__bottom'},
                React.DOM.input({id:subscriptionNameId, className:'border-medium-gray border-radius', type:'text', defaultValue:subscriptionName, placeholder:TEXT.subscriptionPlaceholder})
              ),
              React.DOM.div({className:'text-center margin__bottom'},
                React.DOM.input({id:emailId, className:'border-medium-gray border-radius', type:'text', value:email, onChange:emailChange, placeholder:TEXT.emailPlaceholder})
              ),
              React.DOM.div({className:'pooh-bear text-center'},
                React.DOM.div({className:'pooh-bear'}, 'Please do not change this field'),
                React.DOM.input({id:pbId2, className:'pooh-bear', type:'text', name:'address', defaultValue:pbVal})
              ),
              React.DOM.div({className:'text-right margin__bottom'},
                React.DOM.button({className:'text-white back-orange no-border border-radius font-16px',  onClick:subscribeClick}, TEXT.subscribe)
              )
            )
          )
        )
      )
    },

    _renderModal: function () {
      var modalMount = document.getElementById(AlertsConfig.MODAL_ID);
      modal = modal || new this._modal();
      
      if (!modalMount) {
        throw new Error('Undefined Error: Could not find modalMount element.');
      } else {
        React.renderComponent(this._modal(), modalMount);
      }
    },

    _toggle: function () {
      topic.publish('toggleAlerts');
    },

    _activateToolbar: function (evt) {
      var geometryType;

      geometryType = evt.target.dataset ? evt.target.dataset.geometryType : evt.target.getAttribute("data-geometry-type")

      // If any other tools are active, remove the active class
      this._removeActiveClass();

      // If they clicked the same button twice, deactivate the toolbar
      if (activeTool === geometryType) {
        this._deactivateToolbar();
        return;
      }

      activeTool = geometryType

      drawToolbar.activate(geometryType);
      domClass.add(evt.target, "active");

      // Update the Model so other parts of the application can be aware of this
      MapModel.set('drawToolsEnabled', true);
    },

    _deactivateToolbar: function () {
      drawToolbar.deactivate();
      activeTool = undefined;
      MapModel.set('drawToolsEnabled', false);
    },

    _drawComplete: function (evt) {
      this._removeActiveClass();
      this._deactivateToolbar();

      if (!evt.geometry) {
        return;
      }

      var id = GeoHelper.nextCustomFeatureId(),
        attrs = { "WRI_ID": id },
        feature = new Graphic(evt.geometry, Symbols.getPolygonSymbol(), attrs);

      attrs[AlertsConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";

      WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([feature]));
    },

    _removeActiveClass: function () {
      dojoQuery(".drawing-tools .drawing-tool-button").forEach(function (node) {
        domClass.remove(node, "active");
      });
    }, 

    _subscribeToFires: function (unionedPolygons, subscriptionName, email) {
      var deferred = new Deferred(),
          messagesConfig = AlertsConfig.messages,
          firesConfig = AlertsConfig.requests.fires,
          url = firesConfig.url,
          options = _.cloneDeep(firesConfig.options);

      options.data.features = JSON.stringify({
        rings: unionedPolygons.rings,
        spatialReference: unionedPolygons.spatialReference
      });
      options.data.msg_addr = email;
      options.data.area_name = subscriptionName;
      xhr(url, options).then(function (response) {
        deferred.resolve((response.message && response.message === firesConfig.successMessage) ? messagesConfig.fireSuccess : messagesConfig.fireFail);
      });
      return deferred.promise;
    },

    _subscribeToForma: function (geoJson, subscriptionName, email) {
      var deferred = new Deferred(),
          messagesConfig = AlertsConfig.messages,
          url = AlertsConfig.requests.forma.url,
          options = _.cloneDeep(AlertsConfig.requests.forma.options),
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
      return deferred.promise;
    },

    // Adapted from Generator.js:subscribeToAlerts, some required functionality
    // separated to GeoHelper & subfunctions above
    _subscribeToAlerts: function () {
      WizardStore.set(KEYS.alertsDialogActive, true);

      return

      // Honeypot
      // if ((dom.byId(pbId1) == null || dom.byId(pbId2) == null) || (dom.byId(pbId1).value.length > 0 || dom.byId(pbId2).value !== pbVal)) {
      //   return;
      // }

      this._renderModal();
      domClass.toggle(AlertsConfig.MODAL_ID, 'active');
      this.setState({modalOpen:true});

      return

      var selectedFeatures = this.state.selectedFeatures,
          polygons,
          emailAddr = dom.byId(emailId).value,
          subscriptionName = dom.byId(subscriptionNameId).value.trim(),
          formaCheck = dom.byId(formaId).checked,
          firesCheck = dom.byId(firesId).checked,
          messagesConfig = AlertsConfig.messages,
          validations = [],
          subscriptions = [],
          self = this;

      validations = [
        [!validate.isEmailAddress(emailAddr), messagesConfig.invalidEmail],
        [!formaCheck && !firesCheck, messagesConfig.noSelection],
        [!formaCheck && !firesCheck, messagesConfig.noSelection],
        [!subscriptionName || subscriptionName.length === 0, messagesConfig.noSelectionName],
        [selectedFeatures.length === 0, messagesConfig.noAreaSelection]
      ].filter(function (validation) {
        return validation[0];
      }).map(function (validation) {
        return validation[1];
      }).join('\n');

      if (validations.length > 0) {
        alert(AlertsConfig.messagesLabel + validations);
      } else {
        // Map feature geometries to new Polygons for SpatialReference for union
        polygons = selectedFeatures.map(function (feature) {
          // TODO: handle circles, convert to polys (@Generator.js:177)
          // TODO: handle points, convert to buffered circles (@Generator.js:185)
          return new Polygon(GeoHelper.getSpatialReference()).addRing(feature.geometry.rings[feature.geometry.rings.length - 1]);;
        });
        GeoHelper.union(polygons).then(function (unionedPolygon) {
          if (firesCheck) {
            subscriptions.push(self._subscribeToFires(unionedPolygon, subscriptionName, emailAddr));
          }
          if (formaCheck) {
            subscriptions.push(self._subscribeToForma(GeoHelper.convertGeometryToGeometric(unionedPolygon), subscriptionName, emailAddr));
          }

          all(subscriptions).then(function (responses) {
            alert(responses.join('\n'))
          });
        });
      }
    }
  });

  return function (props, el) {
    return React.renderComponent(new AlertsForm(props), document.getElementById(el));
  };
});
