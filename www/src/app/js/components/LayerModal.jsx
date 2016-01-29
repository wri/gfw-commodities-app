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

    render: function() {
      var layerInfo = [];
      for (var layer in this.state.layerInfo) {
        layerInfo.push(this.state.layerInfo[layer]);
      }

      return (
          <ModalWrapper>
          {!this.state.layerInfo.title ? <div className='no-info-available'>No information available</div> :
          <div className='modal-content'>
            <div className='modal-source'>
              <h2 className='modal-title'>{this.state.layerInfo.title}</h2>
              <h3 className='modal-subtitle'>{this.state.layerInfo.subtitle}</h3>
              <div className='modal-table'>
                {!this.state.layerInfo.function ? null :
                  this.tableMap(this.state.layerInfo.function, 'function')
                }
                {
                  !this.state.layerInfo.resolution ? null :
                  this.tableMap(this.state.layerInfo.function, 'RESOLUTION/SCALE')
                }
                {
                  !this.state.layerInfo.geographic_coverage ? null :
                  this.tableMap(this.state.layerInfo.geographic_coverage, 'GEOGRAPHIC COVERAGE')
                }
                {
                  !this.state.layerInfo.source ? null :
                  this.tableMap(this.state.layerInfo.source, 'source data')
                }
                {
                  !this.state.layerInfo.frequency_of_updates ? null :
                  this.tableMap(this.state.layerInfo.frequency_of_updates, 'FREQUENCY OF UPDATES')
                }
                {
                  !this.state.layerInfo.date_of_content ? null :
                  this.tableMap(this.state.layerInfo.date_of_content, 'DATE OF CONTENT')
                }
                {
                  !this.state.layerInfo.cautions ? null :
                  this.tableMap(this.state.layerInfo.cautions, 'cautions')
                }
                {
                  !this.state.layerInfo.other ? null :
                  this.tableMap(this.state.layerInfo.other, 'other')
                }
                {
                  !this.state.layerInfo.license ? null :
                  this.tableMap(this.state.layerInfo.license, 'license')
                }
              </div>
              <div className='modal-overview'>
                <h3>Overview</h3>
                {
                  !this.state.layerInfo.overview ? null :
                  this.summaryMap(this.state.layerInfo.overview)
                }
              </div>
              <div className='modal-credits'>
                <h3>Citation</h3>
                {
                  !this.state.layerInfo.citation ? null :
                  this.summaryMap(this.state.layerInfo.citation)
                }
              </div>
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

  tableMap: function (item, label) {
    return (
      <dl className='source-row'>
        <dt>{label}</dt>
        <dd dangerouslySetInnerHTML={{ __html: item }}></dd>

      </dl>
    );
  },

  summaryMap: function (item) {
    return (
      <div dangerouslySetInnerHTML={{ __html: item }}></div>
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
