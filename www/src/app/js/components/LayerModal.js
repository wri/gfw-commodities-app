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
    // debugger;
    // this.props
    /* jshint ignore:start */
    // render: function() {
    //   return (
    //     <div className='smart-list'>Lucas</div>
    //   );
    // },
    render: function() {
      console.log(this.state.layerInfo)
      return (
          React.createElement(ModalWrapper, null, 
          !this.state.layerInfo.title ? React.createElement("div", {className: "no-info-available"}, "No information available") :
          React.createElement("div", {className: "layer-modal-content"}, 
            React.createElement("div", {className: "source-header"}, 
              React.createElement("strong", {className: "source-title"}, this.state.layerInfo.title), 
              React.createElement("em", {className: "source-description"}, this.state.layerInfo.subtitle)
            ), 
            React.createElement("div", {className: "source-body"}, 
              this.state.layerInfo.map(this.tableMap)
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

  tableMap: function (item) {
    debugger
    return (
      React.createElement("dl", {className: "source-row"}, 
        React.createElement("dt", null, item.label), 
        React.createElement("dd", {dangerouslySetInnerHTML: { __html: item.html}})
      )
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
