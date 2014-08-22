define([
	"react",
	"dojo/topic",
	"utils/Hasher",
	"components/Radio",
	"components/Check"	
], function (React, topic, Hasher, Radio, Check) {

	var _components = [];

  var List = React.createClass({

    getInitialState: function () {
      return ({
        title: this.props.title,
        filter: this.props.filter
      });
    },

    componentDidMount: function () {
    	// Component is Done, Enforce Rules or Toggle Items Here if Necessary
    	// This is probably the right spot to check to make sure only one option
    	// per radio container is selected or select none if none are selected

    	// Radio Button Groups
    	var radioGroups = ['forest-change','forest-cover','agro-suitability'],
    			noneComponent,
    			foundActive;

    	radioGroups.forEach(function (group) {
    		foundActive = false;
    		_components.forEach(function (component) {
    			if (component.props.filter === group) {
    				// Locate the none radio button
    				if (component.props.key.search("none_") > -1) {
    					noneComponent = component;
    				}
    				// Check if any are active
    				if (component.state.active) {
    					foundActive = true;
    				}
    			}
    		});
    		// If none are active, select the none radio button
    		if (!foundActive) {
    			noneComponent.setState({
    				active: true
    			});
    		}
    	});

    },

    componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

    render: function () {
      return (
        React.DOM.div({'className':'smart-list'}, 
          React.DOM.div({'className': 'filter-list-title'}, this.props.title),
          React.DOM.div({'className': 'layer-line'}),
          React.DOM.ul({'className': 'filter-list'},
            this.props.items.map(this._mapper, this)
          )
        )
      );
    },

    _mapper: function (item) {

      item.visible = (this.state.filter === item.filter);
      item.handle = this._handle;
      item.postCreate = this._postCreate;      

      if (item.type === "radio") {
        return new Radio(item);
      } else {
        return new Check(item);
      }

    },

    _handle: function (component) {

      if (component.props.type === 'radio') {
        this._radio(component);
      } else {
        this._check(component);
      }
    },

    _check: function (component) {
    	var newState = !component.state.active;
      component.setState({
        active: newState
      });
      Hasher.toggleLayers(component.props.key);
      if (component.props.useRadioCallback) {
        topic.publish('toggleLayer', component.props.key);
      } else {
        // Call this function on the next animation frame to give React time 
        // to render the changes from its new state, the callback needs to read
        // the ui to update the layer correctly
        requestAnimationFrame(function () {
          topic.publish('updateLayer', component.props);
        });
      }   
    },

    _radio: function (component) {

      var previous,
      		isNewSelection;

      _components.forEach(function (item, idx) {
        if (item.props.filter === component.props.filter) {
          if (item.state.active) {
            previous = item; 
          }
        }
      });

      if (previous) {
      	isNewSelection = (previous.props.key !== component.props.key);
        if (isNewSelection) {
          
          previous.setState({
            active: false
          });

          // Remove Previous Hash but ignore it if None was previous
          if (previous.props.key.search("none_") === -1) {
          	Hasher.toggleLayers(previous.props.key);
						topic.publish('hideLayer', previous.props.key);
          }

          // Toggle Children for Previous if it has any
          this._toggleChildren(previous, 'remove');

          // Add New if None is not selected and isNew
		      if (component.props.key.search("none_") === -1) {
		      	Hasher.toggleLayers(component.props.key);
						topic.publish('showLayer', component.props.key);
		      }

        }
      } else {
      	// Add New if None is not selected and isNew
	      if (component.props.key.search("none_") === -1) {
	      	Hasher.toggleLayers(component.props.key);
					topic.publish('showLayer', component.props.key);
	      }
      }

      component.setState({
        active: true
      });

      this._toggleChildren(component, 'add');

    },

    _toggleChildren: function (component, action) {

    	var childComponents = [];

    	if (component.props.children) {
    		component.props.children.forEach(function (child) {
    			_components.forEach(function (comp) {
    				if (comp.props.key === child.key) {
    					childComponents.push(comp);
    				}
    			});
    		});

    		if (action === 'remove') {
    			childComponents.forEach(function (child) {
    				if (child.state.active) {
  						topic.publish('hideLayer', child.props.key);
  						Hasher.removeLayers(child.props.key);
    				}
	    		});
    		} else {
    			childComponents.forEach(function (child) {
    				if (child.state.active) {
							topic.publish('showLayer', child.props.key);
							Hasher.toggleLayers(child.props.key);
    				}
	    		});
    		}
    	}

    },

    _postCreate: function (component) {
      _components.push(component);
    }

  });

	return function (props, el) {
		return React.renderComponent(new List(props), document.getElementById(el));
	};

});