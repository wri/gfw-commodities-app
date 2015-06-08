/** @jsx React.DOM */
define([
	"react"
], function (React) {

	var ListItem = React.createClass({

		propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired,
      click: React.PropTypes.func.isRequired,
      filter: React.PropTypes.string.isRequired
    },

    /* jshint ignore:start */
		render: function () {
			var isGroupActive = this.props.activeListGroupValue !== undefined && this.props.activeListGroupValue == this.props.value,
					className;

			if (this.props.filter === '' || this._searchChildrenForMatches(this.props.children, this.props.filter)) {
				className = isGroupActive ? 'active' : '';
				// No Filter applied, render like usual
				return (
					<div className='wizard-list-item'>
						<span data-value={this.props.value} data-type='group' onClick={this._click} className={className}>{this.props.label}</span>
						{this.props.children ? this.props.children.map(this._childrenMapper.bind(this, isGroupActive)) : undefined}
					</div>
				);
			} else {
				// Filter applied, none of the children match, if the root matches, show it, else hide it
				var label = this.props.label.toLowerCase();
				className = 'wizard-list-item' + (label.search(this.props.filter) > -1 ? '' : ' hidden') + (isGroupActive ? ' active' : '' );

				return (
					<div className={className}>
						<span data-value={this.props.value} data-type='group' onClick={this._click} className={className}>{this.props.label}</span>
					</div>
				);
				
			}
		},
		
		_childrenMapper: function (parentActive, item, index) {
			var label = item.label.toLowerCase(), // Filter is lowercase, make the label lowercase for comparison
					className = 'wizard-list-child-item' + 
											(label.search(this.props.filter) > -1 ? '' : ' hidden');

			if (this.props.activeListItemValues.indexOf(item.value) != -1 || parentActive) {
				className += ' active';
			}

			return (
				<div className={className} key={index}>
					<span data-value={item.value} data-type='individual' onClick={this._click}>{item.label}</span>
				</div>
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

	var NestedList = React.createClass({

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
      	<div className='nested-list'>
      		<div className={'searchBox relative' + (this.props.data.length > 0 ? '' : ' hidden')}>
      			<div className='nested-list-search-icon' />
      			<input placeholder={this.props.placeholder} type='text' value={this.state.filter} onChange={this._setFilter} />
      		</div>
      		<div className={'list-container' + (this.state.filter !== '' ? ' filtered' : '')}>
      			{this.props.data.map(this._mapper, this)}
      		</div>
      	</div>
      );
    },

    _mapper: function (item, index) {
    	return (
    		<ListItem
    			key={index}
    			label={item.label || 'No Name'}
    			value={item.value}
    			click={this.props.click}
    			children={item.children}
    			activeListItemValues={this.props.activeListItemValues}
    			activeListGroupValue={this.props.activeListGroupValue}
    			filter={this.state.filter}
    		/>
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
