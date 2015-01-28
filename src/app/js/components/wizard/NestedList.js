// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO IN ADMIN UNIT
define([
	"react"
], function (React) {

	var ListItem = React.createClass({

		propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired,
      click: React.PropTypes.func.isRequired,
      filter: React.PropTypes.string.isRequired, // All Lowercase
      children: React.PropTypes.array, //Optional
      activeListItemValues: React.PropTypes.array //Optional
    },

		render: function () {
			if (this.props.filter === '') {
				// No Filter applied, render like usual
				return React.DOM.div({'className': 'wizard-list-item'},
					//React.DOM.span({'className': 'wizard-list-item-icon'}),
					React.DOM.span({'data-value': this.props.value, 'data-type':'group', 'onClick': this._click}, this.props.label),
					(this.props.children ? this.props.children.map(this._childrenMapper, this) : null)
				);
			} else {
				if (this._searchChildrenForMatches(this.props.children, this.props.filter)) {
					// Filter applied, if any children match the filter, render the parent as normal and the children
					return React.DOM.div({'className': 'wizard-list-item'},
						//React.DOM.span({'className': 'wizard-list-item-icon'}),
						React.DOM.span({'data-value': this.props.value, 'data-type':'group', 'onClick': this._click}, this.props.label),
						(this.props.children ? this.props.children.map(this._childrenMapper, this) : null)
					);
				} else {
					// Filter applied, none of the children match, if the root matches, show it, else hide it
					var label = this.props.label.toLowerCase(),
							className = 'wizard-list-item ' + 
													(label.search(this.props.filter) > -1 ? '' : 'hidden ');

					return React.DOM.div({'className': className},
						//React.DOM.span({'className': 'wizard-list-item-icon'}),
						React.DOM.span({'data-value': this.props.value, 'data-type':'group', 'onClick': this._click}, this.props.label)
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
											(label.search(this.props.filter) > -1 ? '' : 'hidden ');

			// Condition for active class, not defining semantic vars to keep iterating quickly, instead documenting below
			// var isItemActive = this.props.activeListItemValues.indexOf(item.value) != -1
			if ( this.props.activeListItemValues && this.props.activeListItemValues.indexOf(item.value) != -1 ) {
				className += 'active';
			}

			return React.DOM.div({'className': className},
				//React.DOM.span({'className': 'wizard-list-child-item-icon'}),
				React.DOM.span({'data-value': item.value, 'data-type':'individual', 'onClick': this._click}, item.label)				
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

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    render: function () {
      return (
      	React.DOM.div({'className': 'nested-list'},
      		React.DOM.div({'className': 'searchBox relative' + (this.props.data.length > 0 ? '' : ' hidden')},
      			React.DOM.div({'className': 'nested-list-search-icon'}),
          	React.DOM.input({
          		'placeholder': this.props.placeholder, 
          		'type': 'text',
          		'value': this.state.filter,
          		'onChange': this._setFilter
          	})
	        ),
	        React.DOM.div({'className': 'list-container ' + (this.state.filter !== '' ? 'filtered' : '')},
	          this.props.data.map(this._mapper, this)
	        )
      	)
      );
    },

    _mapper: function (item) {
    	return new ListItem({
    		'label': item.label || "No Name",
    		'value': item.value,
    		'click': this.props.click,
    		'children': item.children,
    		'activeListItemValues': this.props.activeListItemValues,
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