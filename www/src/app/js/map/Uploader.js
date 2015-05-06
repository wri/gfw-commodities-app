define([
	'dojo/on',
	'dojo/dom-class'
], function (on, domClass) {
	'use strict';

	var closeHandle;

	var Uploader = {

		toggle: function () {
			domClass.toggle('upload-modal', 'active');

			if (closeHandle) {
				closeHandle.remove();
				closeHandle = undefined;
			} else {
				closeHandle = on.once(document.querySelector('#upload-modal .close-icon'), 'click', this.toggle);
			}

		},

		beginUpload: function () {
			
		}


	};

	return Uploader;

});