define([
	'react',
	'components/ModalWrapper',
  'dojo/dom-class'
], function (React, ModalWrapper, domClass) {


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
						<svg viewBox="0 0 25 25">
              <path d="M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z"></path>
            </svg>
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
