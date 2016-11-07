/** @jsx React.DOM */
define([
  'react',
  'knockout',
  'map/TCDSlider',
  'map/MapModel',
  'analysis/config',
  'analysis/WizardStore',
  'dojo/topic',
  'utils/Analytics'
], function (React, ko, TCDSlider, MapModel, AnalyzerConfig, WizardStore, topic, Analytics) {

  var KEYS = AnalyzerConfig.STORE_KEYS;

  return React.createClass({

    propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired
    },
    componentDidMount: function () {

			if (this.props.value === 'soy') {
        this.model = MapModel.get('model');
			}

      WizardStore.registerCallback(KEYS.currentTreeCoverDensity, this.tcdUpdated);

    },


    tcdUpdated: function () {
      var aoi = WizardStore.get(KEYS.currentTreeCoverDensity);
      if (this.props.value === 'soy') {
        console.log(aoi);
        this.setState(this.state);
      }
    },

    // componentWillReceiveProps: function(newProps) {
    //   if (newProps.isResetting) {
    //     this.replaceState(this.getInitialState());
    //   }
    //   console.log(newProps.checkedFromPopup);
    //   if (newProps.checkedFromPopup === true) {
    //     this.setState({
    //       active: true
    //     });
    //   }
    //   // else if (this.state.defaultOff.indexOf(newProps.value) > -1) {
    //   //   this.setState({
    //   //     active: false
    //   //   });
    //   // }
    // },

    // componentDidUpdate: function(prevProps, prevState) {
    //   if (this.props.change && (prevState.active !== this.state.active)) {
    //     this.props.change(this.props.value);
    //   }
    // },

    /* jshint ignore:start */
    render: function() {
      var className = 'wizard-checkbox' + (this.props.checked ? ' active' : '');

      var tcdDensityValue;

      if (this.props.value === 'soy' && this.model) {
        tcdDensityValue = this.model.tcdDensityValue();
      }

      return (
        <div className='wizard-checkbox-container'>
          <div className={className} data-value={this.props.value}>
            <span className='custom-check' onClick={this.toggle}>
              <span />
            </span>
            <a className='wizard-checkbox-label' onClick={this.toggle}>{this.props.label}</a>
            {
              this.props.noInfoIcon ? null :
              <span onClick={this.showInfo} className='layer-info-icon' dangerouslySetInnerHTML={{__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}} />
            }
          </div>
          {
            this.props.checked && this.props.value === 'soy' ?
            <span className='tcd-percentage-holder'>
            <span className='tcd-percentage-label'>Analyzing at </span>
            <span className='tcd-percentage-button' onClick={this.showSoySlider}>{tcdDensityValue}</span>
            <span className='tcd-percentage-label'> density</span></span> : null
          }
        </div>
      );
    },
    /* jshint ignore:end */

    toggle: function() {
      this.props.change(this.props.value);
      if (this.props.value === 'soy') {
        TCDSlider.hide();
      }
      // Emit Event for Analytics
      Analytics.sendEvent('Event', 'Analysis Toggle', 'User toggled analysis for the ' + this.props.value + 'layer.');
    },

    showSoySlider: function() {
      TCDSlider.show();
    },

    showInfo: function() {

      switch (this.props.value) {
        case 'peat':
          this.props.infoDivClass = 'forest-and-land-cover-peat-lands';
          break;
        case 'gladAlerts':
          this.props.infoDivClass = 'forest-change-glad-alerts';
          break;
        case 'plantationsTypeLayer':
          this.props.infoDivClass = 'forest-and-land-cover-plantations';
          break;
        case 'plantationsSpeciesLayer':
          this.props.infoDivClass = 'forest-and-land-cover-plantations';
          break;
        case 'indonesiaMoratorium':
          this.props.infoDivClass = 'land-use-moratorium-areas';
          break;
        case 'prodes':
          this.props.infoDivClass = 'forest-change-prodes-alerts';
          break;
        case 'guyraAlerts':
          this.props.infoDivClass = 'forest-change-gran-chaco';
          break;
        case 'treeDensity':
          this.props.infoDivClass = 'forest-and-land-cover-tree-cover-density';
          break;
        case 'legal':
          this.props.infoDivClass = 'forest-and-land-cover-legal-classifications';
          break;
        case 'protected':
          this.props.infoDivClass = 'conservation-protected-areas';
          break;
        case 'carbon':
          this.props.infoDivClass = 'forest-and-land-cover-carbon-stocks';
          break;
        case 'intact':
          this.props.infoDivClass = 'forest-and-land-cover-intact-forest-landscape';
          break;
        case 'landCoverGlob':
          this.props.infoDivClass = 'forest-and-land-cover-land-cover-global';
          break;
        case 'primForest':
          this.props.infoDivClass = 'forest-and-land-cover-primary-forest';
          break;
        case 'biomes':
          this.props.infoDivClass = 'forest-and-land-cover-brazil-biomes';
          break;
        case 'suit':
          this.props.infoDivClass = 'land-use-oil-palm';
          break;
        case 'rspo':
          this.props.infoDivClass = 'land-use-rspo-consessions';
          break;
        case 'landCoverIndo':
          this.props.infoDivClass = 'forest-and-land-cover-land-cover-indonesia';
          break;
        case 'landCoverAsia':
          this.props.infoDivClass = 'forest-and-land-cover-land-cover-south-east-asia';
          break;
        case 'treeCoverLoss':
          this.props.infoDivClass = 'forest-change-tree-cover-change';
          break;
      }

      if (document.getElementsByClassName(this.props.infoDivClass).length) {
        topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
      } else {
        topic.publish('showInfoPanel', this.props.infoDivClass);
      }

    }

  });

});
