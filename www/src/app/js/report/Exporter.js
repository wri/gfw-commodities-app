define([

], function () {
	'use strict';

	function encodeToBase64 (data) {
		//  discuss at: http://phpjs.org/functions/base64_encode/
	  //  original by: Tyler Akins (http://rumkin.com)
	  //  improved by: Bayron Guevara
	  //  improved by: Thunder.m
	  //  improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //  improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //  improved by: Rafał Kukawski (http://kukawski.pl)
	  //  bugfixed by: Pellentesque Malesuada
	  //   example 1: base64_encode('Kevin van Zonneveld');
	  //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	  //   example 2: base64_encode('a');
	  //   returns 2: 'YQ=='
	  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	  var o1, o2, o3, h1, h2, h3, h4, bits, 
	  		i = 0,
		    ac = 0,
		    enc = '',
		    tmp_arr = [];

		if (!data) {
			return data;
		}

		do {
			// Pack three octets into four hexets
			o1 = data.charCodeAt(i++);
	    o2 = data.charCodeAt(i++);
	    o3 = data.charCodeAt(i++);

	    bits = o1 << 16 | o2 << 8 | o3;

	    h1 = bits >> 18 & 0x3f;
	    h2 = bits >> 12 & 0x3f;
	    h3 = bits >> 6 & 0x3f;
	    h4 = bits & 0x3f;

	    // Use hexets to index into b64 and append result to encoded string
	    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);

		} while (i < data.length);

		enc = tmp_arr.join('');

		var r = data.length % 3;

		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

	}

	function base64ToBlob (base64Data, contentType) {
		// Taken From: http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
		contentType = contentType || '';
		var sliceSize = 1024;
		var byteCharacters = atob(base64Data);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);

		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {

			var begin = sliceIndex * sliceSize;
			var end = Math.min(begin + sliceSize, bytesLength);

			var bytes = new Array(end - begin);
			var i = 0;

			for (var offset = begin; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}

			byteArrays[sliceIndex] = new Uint8Array(bytes);

		}

		return new Blob(byteArrays, { type: contentType });

	}


	var Exporter = {

		exportCSV: function (exportData) {

			var hrefType = 'data:application/vnd.ms-excel;base64,',
					blobType = 'text/csv;charset=utf-8',
					filename = 'data.csv',
					link = document.createElement('a'),
					blob;

			// If FileSaver loaded successfully and Blob's are supported
			if (saveAs && !!new Blob) {

				blob = base64ToBlob(encodeToBase64(exportData), blobType);
				saveAs(blob, filename);

			} else if (link.download === '') {

				link.href = hrefType + encodeToBase64(exportData);
				link.target = '_blank';
				link.download = filename;
				link.click();

			} else {

				window.open(hrefType + encodeToBase64(exportData));

			}

		}

	};

	return Exporter;

});