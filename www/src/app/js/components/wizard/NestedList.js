/** @jsx React.DOM */
define([
	"react"
], function (React) {

	var ListItem = React.createClass({displayName: 'ListItem',

		propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.number.isRequired,
      click: React.PropTypes.func.isRequired,
      filter: React.PropTypes.string.isRequired
    },

    /* jshint ignore:start */
		render: function () {
			var isGroupActive = this.props.activeListGroupValue !== undefined && this.props.activeListGroupValue == this.props.value,
					className;

			// Filter not applied  or filter is applied and there are children who match the filter 
			// This means we can't hide the parent or else the children will get hidden as well
			if (this.props.filter === '' || this._searchChildrenForMatches(this.props.children, this.props.filter)) {
				className = isGroupActive ? 'active' : '';
				return (
					React.DOM.div({className: "wizard-list-item"}, 
						React.DOM.span({'data-value': this.props.value, 'data-type': "group", onClick: this._click, className: className}, this.props.label), 
						this.props.children ? this.props.children.map(this._childrenMapper.bind(this, isGroupActive)) : undefined
					)
				);
			} else {
				// Filter applied, none of the children match, if the root matches, show it, else hide it
				className = 'wizard-list-item' + (this.props.label.toLowerCase().search(this.props.filter) > -1 ? '' : ' hidden') + (isGroupActive ? ' active' : '' );

				return (
					React.DOM.div({className: className}, 
						React.DOM.span({'data-value': this.props.value, 'data-type': "group", onClick: this._click, className: className}, this.props.label)
					)
				);
				
			}
		},
		
		_childrenMapper: function (parentActive, item, index) {
			var label = item.label.toLowerCase(), // Filter is lowercase, make the label lowercase for comparison
					className = 'wizard-list-child-item' + (label.search(this.props.filter) > -1 ? '' : ' hidden');

			if (this.props.activeListItemValues.indexOf(item.value) != -1 || parentActive) {
				className += ' active';
			}

			return (
				React.DOM.div({className: className, key: index}, 
					React.DOM.span({'data-value': item.value, 'data-type': "individual", onClick: this._click}, item.label)
				)
			);
		},
		/* jshint ignore:end */

		_searchChildrenForMatches: function (children, filter) {
			return children.some(function (child) {
				if (child.label.toLowerCase().search(filter) > -1) {
					return true;
				} else {
					return false;
				}
			});
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

	var NestedList = React.createClass({displayName: 'NestedList',

    getInitialState: function () {
      return (getDefaultState());
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
      	React.DOM.div({className: "nested-list"}, 
      		React.DOM.div({className: 'searchBox relative' + (this.props.data.length > 0 ? '' : ' hidden')}, 
      			React.DOM.div({className: "nested-list-search-icon"}), 
      			React.DOM.input({placeholder: this.props.placeholder, type: "text", value: this.state.filter, onChange: this._setFilter})
      		), 
      		React.DOM.div({className: 'list-container' + (this.state.filter !== '' ? ' filtered' : '')}, 
      			this.props.data.map(this._mapper, this)
      		)
      	)
      );
    },

    _mapper: function (item, index) {
    	return (
    		ListItem({
    			key: index, 
    			label: item.label || 'No Name', 
    			value: item.value, 
    			click: this.props.click, 
    			children: item.children, 
    			activeListItemValues: this.props.activeListItemValues, 
    			activeListGroupValue: this.props.activeListGroupValue, 
    			filter: this.state.filter}
    		)
    	);
    },
    /* jshint ignore:end */

    _setFilter: function (evt) {
    	this.setState({
    		filter: evt.target.value.toLowerCase()
    	});
    }

  });

return NestedList;

});          
