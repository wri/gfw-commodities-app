/** @jsx React.DOM */
define([
  'react',
  'dojo/topic'
], function (React, topic) {

  return React.createClass({

    propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired
    },
    //
    // getInitialState: function() {
    //   return {
    //     active: this.props.defaultChecked || false
    //     // defaultOff: ['protected', 'plantationsTypeLayer', 'plantationsSpeciesLayer']
    //   };
    // },

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

      return (
        React.createElement("div", {className: "wizard-checkbox-container"}, 
          React.createElement("div", {className: className, "data-value": this.props.value}, 
            React.createElement("span", {className: "custom-check", onClick: this.toggle}, 
              React.createElement("span", null)
            ), 
            React.createElement("a", {className: "wizard-checkbox-label", onClick: this.toggle}, this.props.label), 
            
              this.props.noInfoIcon ? null :
              React.createElement("span", {onClick: this.showInfo, className: "layer-info-icon", dangerouslySetInnerHTML: {__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}})
            
          )
        )
      );
    },
    /* jshint ignore:end */

    toggle: function() {
      this.props.change(this.props.value);
      // this.setState({ active: !this.state.active });
    },

    showInfo: function() {
      console.log(this.props.value);

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
      console.log(this.props.infoDivClass);

      if (document.getElementsByClassName(this.props.infoDivClass).length) {
        topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
      } else {
        topic.publish('showInfoPanel', this.props.infoDivClass);
      }

    }

  });

});
