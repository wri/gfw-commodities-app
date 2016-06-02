define([
	'react',
	'components/ModalWrapper',
  'dojo/dom-class',
	'map/config'
], function (React, ModalWrapper, domClass, MapConfig) {

  var closeSvg = '<use xlink:href="#shape-close" />';

  var CalendarWrapper = React.createClass({

    close () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    render: function() {
      return (
        <div className='modal-container'>
        <div className='calendar-background' onClick={this.close} />
        <div className='calendar-window'>
          <div title='close' className='modal-close close-icon pointer' onClick={this.close}>
            <svg dangerouslySetInnerHTML={{ __html: closeSvg }}/>
          </div>
          <div className='calendar-wrapper custom-scroll'>
            {this.props.children}
          </div>
        </div>
      </div>
      );

    }
  });

  return CalendarWrapper;

});
