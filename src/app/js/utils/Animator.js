(function (win, doc) {

	// Make Sure requestAnimationFrame is available
	win.requestAnimationFrame = (function () {
		return win.requestAnimationFrame ||
			win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
	})();

	var Animator = {};
	var fps = 1000 / 60;

	Animator.fadeIn = function (itemIds, options, callback) {

		if (Object.prototype.toString.call(itemIds) !== '[object Array]') {
			itemIds = [itemIds];
		}

		var	id = itemIds.shift(),
				element = document.getElementById(id),
				steps = fps / (options.duration || 500);		

		function fade() {
			// 1 * element.style.opacity is necessary to convert string to number for addition
			element.style.opacity = 1 * element.style.opacity + steps;
			if (element.style.opacity < 1) {
				win.requestAnimationFrame(fade);
			} else {
				id = itemIds.shift();
				element = document.getElementById(id);
				if (element) {
					win.requestAnimationFrame(fade);
				} else {
					if (typeof callback === "function") {
						callback();
					}
				}
			}
		}
		win.requestAnimationFrame(fade);
	};

	// Animator.slide = function (options, callback) {

	// 	// Options must contain node, and some properties object containing which properties to animate

	// };


  if (typeof define === "function" && define.amd) {
    define([], function() {
    	return Animator;
	  });
	} else {
		window.animator = Animator;
	}

})(window, document, define);