// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO
define([
	"react",
  "map/MapModel",
  "analysis/Query",
  "analysis/config",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic"
], function (React, MapModel, AnalyzerQuery, AnalyzerConfig, NestedList, topic) {

  var config = AnalyzerConfig.adminUnit;

	return React.createClass({

    getInitialState: function () {
      return ({
        nestedListData: []
      });
    },

    componentDidMount: function () {
      MapModel.applyTo('admin-unit');
    },

    componentWillReceiveProps: function () {
      
    },

    render: function () {
      return (
        React.DOM.div({'className': 'admin-unit', 'id': 'admin-unit'}, 
          React.DOM.p({'className': 'instructions'}, config.instructions),
          React.DOM.div({'className': 'select-container'},
            React.DOM.select({
              'className': 'country-select', 
              'onChange': this._loadAdminUnits,
              'data-bind': "options: allCountries, optionsText: 'label', optionsValue: 'value'"
            })
          ),
          React.DOM.p({'className': 'instructions'}, config.instructionsPartTwo),
          new NestedList({
            'data': this.state.nestedListData,
            'click': this._lowLevelAdminUnitClick
          })
        )
      );
    },

    _loadAdminUnits: function (evt) {
      var value = evt.target.value,
          self = this;

      if (value === "NONE") {
        // Hide the Layer
        topic.publish("setAdminBoundariesDefenition");
        return;
      }
      // Update State and publish method to show the layer on the map
      topic.publish("setAdminBoundariesDefenition", value);
      AnalyzerQuery.getLowLevelAdminUnitData(value).then(function (data) {
        self.setState({
          nestedListData: data
        });
      });

    },

    _lowLevelAdminUnitClick: function (target) {
      console.dir(target);
    },

    _countrySelectMapper: function (item) {
      return React.DOM.option({'value': item.value}, item.label);
    }

  });

});