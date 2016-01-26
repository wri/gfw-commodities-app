/** @jsx React.DOM */
define([
  "react",
  "components/ModalWrapper",
  "main/config"
], function (React, ModalWrapper, MainConfig) {

  // Variables
  var config = MainConfig.layerModal;

  var LayerModal = React.createClass({

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
          <ModalWrapper>
          {!this.state.layerInfo.title ? <div className='no-info-available'>No information available</div> :
          <div className='layer-modal-content'>
            <div className='source-header'>
              <strong className='source-title'>{this.state.layerInfo.title}</strong>
              <em className='source-description'>{this.state.layerInfo.subtitle}</em>
            </div>
            <div className='source-body'>
              {this.state.layerInfo.map(this.tableMap)}
            </div>
          </div>
        }
        </ModalWrapper>
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
      <dl className='source-row'>
        <dt>{item.label}</dt>
        <dd dangerouslySetInnerHTML={{ __html: item.html }}></dd>
      </dl>
    );
  }
  /* jshint ignore:end */

  });

  return function (props, el) {
    /* jshint ignore:start */
		return React.render(<LayerModal {...props} />, document.getElementById(el));
    /* jshint ignore:end */
	};

});
