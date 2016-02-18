/** @jsx React.DOM */
define([
  "react",
  "components/ModalWrapper",
  "main/config"
], function (React, ModalWrapper, MainConfig) {

  // Variables
  var config = MainConfig.layerModal;

  var LayerModal = React.createClass({displayName: "LayerModal",

    getInitialState: function () {
      return ({
        layerInfo: {}
      });

    },

    componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

    render: function() {
      var layerInfo = [];
      for (var layer in this.state.layerInfo) {
        layerInfo.push(this.state.layerInfo[layer]);
      }

      return (
          React.createElement(ModalWrapper, null, 
          !this.state.layerInfo.title ? React.createElement("div", {className: "no-info-available"}, "No information available") :
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("div", {className: "modal-source"}, 
              React.createElement("h2", {className: "modal-title"}, this.state.layerInfo.title), 
              React.createElement("h3", {className: "modal-subtitle"}, this.state.layerInfo.subtitle), 
              React.createElement("div", {className: "modal-table"}, 
                !this.state.layerInfo.function ? null :
                  this.tableMap(this.state.layerInfo.function, 'function'), 
                
                
                  !this.state.layerInfo.resolution ? null :
                  this.tableMap(this.state.layerInfo.resolution, 'RESOLUTION/SCALE'), 
                
                
                  !this.state.layerInfo.geographic_coverage ? null :
                  this.tableMap(this.state.layerInfo.geographic_coverage, 'GEOGRAPHIC COVERAGE'), 
                
                
                  !this.state.layerInfo.source ? null :
                  this.tableMap(this.state.layerInfo.source, 'source data'), 
                
                
                  !this.state.layerInfo.frequency_of_updates ? null :
                  this.tableMap(this.state.layerInfo.frequency_of_updates, 'FREQUENCY OF UPDATES'), 
                
                
                  !this.state.layerInfo.date_of_content ? null :
                  this.tableMap(this.state.layerInfo.date_of_content, 'DATE OF CONTENT'), 
                
                
                  !this.state.layerInfo.cautions ? null :
                  this.tableMap(this.state.layerInfo.cautions, 'cautions'), 
                
                
                  !this.state.layerInfo.other ? null :
                  this.tableMap(this.state.layerInfo.other, 'other'), 
                
                
                  !this.state.layerInfo.license ? null :
                  this.tableMap(this.state.layerInfo.license, 'license')
                
              ), 
              React.createElement("div", {className: "modal-overview"}, 
                React.createElement("h3", null, "Overview"), 
                
                  !this.state.layerInfo.overview ? null :
                  this.summaryMap(this.state.layerInfo.overview)
                
              ), 
              React.createElement("div", {className: "modal-credits"}, 
                React.createElement("h3", null, "Citation"), 
                
                  !this.state.layerInfo.citation ? null :
                  this.summaryMap(this.state.layerInfo.citation)
                
              )
            )
          )
        
        )
     );
  },

  setData: function (data) {
      this.setState({
        layerInfo: data
      });
  },

  tableMap: function (item, label) {
    return (
      React.createElement("dl", {className: "source-row"}, 
        React.createElement("dt", null, label), 
        React.createElement("dd", {dangerouslySetInnerHTML: { __html: item}})

      )
    );
  },

  summaryMap: function (item) {
    return (
      React.createElement("div", {dangerouslySetInnerHTML: { __html: item}})
    );
  }

  /* jshint ignore:end */

  });

  return function (props, el) {
    /* jshint ignore:start */
		return React.render(React.createElement(LayerModal, React.__spread({},  props)), document.getElementById(el));
    /* jshint ignore:end */
	};

});
