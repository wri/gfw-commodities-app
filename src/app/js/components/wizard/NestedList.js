// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO IN ADMIN UNIT
define([
	"react"
], function (React) {

	/*
		Sample of what the data will look like
		[
			{'label': 'A', 'value': 'a'},
			{'label': 'B', 'value': 'b'},
			{'label': 'C', 'value': 'c', 'children': [
				{'label': 'd', 'value': 'd'},
				{'label': 'e', 'value': 'e'},
			]}
		]
	*/

	var ListItem = React.createClass({

		propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired,
      click: React.PropTypes.func.isRequired,
      filter: React.PropTypes.string.isRequired, // All Lowercase
      children: React.PropTypes.array //Optional
    },

		render: function () {

			if (this.props.filter === '') {
				// No Filter applied, render like usual
				return React.DOM.div({'className': 'wizard-list-item'},
					React.DOM.span({'className': 'wizard-list-item-icon'}),
					React.DOM.span({'data-value': this.props.value, 'onClick': this._click}, this.props.label),
					(this.props.children ? this.props.children.map(this._childrenMapper, this) : null)
				);
			} else {
				if (this._searchChildrenForMatches(this.props.children, this.props.filter)) {
					// Filter applied, if any children match the filter, render the parent as normal and the children
					return React.DOM.div({'className': 'wizard-list-item'},
						React.DOM.span({'className': 'wizard-list-item-icon'}),
						React.DOM.span({'data-value': this.props.value, 'onClick': this._click}, this.props.label),
						(this.props.children ? this.props.children.map(this._childrenMapper, this) : null)
					);
				} else {
					// Filter applied, none of the children match, if the root matches, show it, else hide it
					var label = this.props.label.toLowerCase(),
							className = 'wizard-list-item ' + 
													(label.search(this.props.filter) > -1 ? '' : 'hidden');

					return React.DOM.div({'className': className},
						React.DOM.span({'className': 'wizard-list-item-icon'}),
						React.DOM.span({'data-value': this.props.value, 'onClick': this._click}, this.props.label)
					);
				}
			}
		},

		_searchChildrenForMatches: function (children, filter) {
			return children.some(function (child) {
				if (child.label.toLowerCase().search(filter) > -1) {
					return true;
				} else {
					return false;
				}
			});
		},

		_childrenMapper: function (item) {
			var label = item.label.toLowerCase(), // Filter is lowercase, make the label lowercase for comparison
					className = 'wizard-list-child-item ' + 
											(label.search(this.props.filter) > -1 ? '' : 'hidden');

			return React.DOM.div({'className': className},
				React.DOM.span({'className': 'wizard-list-child-item-icon'}),
				React.DOM.span({'data-value': item.value, 'onClick': this._click}, item.label)				
			);
		},

		_click: function (evt) {
			this.props.click(evt.target);
		}

	});


	function getDefaultState() {
		return {
      filter: ''
    };
	}

	return React.createClass({

    getInitialState: function () {
      return (getDefaultState());
    },

    render: function () {
      return (
      	React.DOM.div({'className': 'nested-list'},
      		React.DOM.div({'className': 'searchBox'},
          	React.DOM.input({'placeholder': 'Search', 'type': 'text', 'onChange': this._setFilter})
	        ),
	        React.DOM.div({'className': 'list-container ' + (this.state.filter !== '' ? 'filtered' : '')},
	          this.props.data.map(this._mapper, this)
	        )
      	)
      );
    },

    _mapper: function (item) {
    	return new ListItem({
    		'label': item.label,
    		'value': item.value,
    		'click': this.props.click,
    		'children': item.children,
    		'filter': this.state.filter
    	});
    },

    _setFilter: function (evt) {
    	this.setState({
    		filter: evt.target.value.toLowerCase()
    	});
    }

  });

});          