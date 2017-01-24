define([
    'dojo/dom',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'dijit/registry',
    'esri/graphic',
    'esri/request',
    'components/SubmitModal',
    'utils/NavListController',
    'models/SubmissionModel'
], function (dom, query, domClass, domStyle, registry, Graphic, esriRequest, SubmitModal, NavListController, SubmissionModel) {

	var initialized = false;
  var self;
  var submitModal;

	return {

		init: function (template) {

			if (initialized) {
				registry.byId('stackContainer').selectChild('submissionView');
				return;
			}
      self = this;

			initialized = true;
			registry.byId('stackContainer').selectChild('submissionView');
			registry.byId('submissionView').set('content', template);
      SubmissionModel.initialize('submissionView');

      submitModal = new SubmitModal({
      }, 'submit-modal');
      // var context = 'submission';
      // NavListController.loadNavControl(context);
      // NavListController.loadNavView(context);

		},

    handleDataSubmit: function(model) {
        self.model = model;
        $('#storyNameInput').css('border-color', '#c0c0c0');
        $('#storyCompanyInput').css('border-color', '#c0c0c0');
        $('#storyTitleInput').css('border-color', '#@c0c0c0');
        $('#storyEmailInput').css('border-color', '#c0c0c0');

        $('#concessionInput').css('border-color', '#c0c0c0');
        $('#facilityInput').css('border-color', '#c0c0c0');
        $('#otherInput').css('border-color', '#c0c0c0');

        var concessionFileName = model.concessionFileName();
        var concessionFileType = model.concessionFileType();
        var facilityFileName = model.facilityFileName();
        var facilityFileType = model.facilityFileType();
        var otherFileName = model.otherFileName();
        var otherFileType = model.otherFileType();
        var node;

        if (!model.storyNameData()) {
          $('#storyNameInput').css('border-color', 'red');
          // alert('Please enter your name!');
          // SubmissionModal.addClass('story-name');
          // SubmissionModal.toggle();
          submitModal.addError('storyName');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }
        if (!model.storyCompanyData()) {
          $('#storyCompanyInput').css('border-color', 'red');
          submitModal.addError('storyCompany');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }
        if (!model.storyTitleData()) {
          $('#storyTitleInput').css('border-color', 'red');
          submitModal.addError('storyPosition');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }
        if (!model.storyEmailData()) {
          $('#storyEmailInput').css('border-color', 'red');
          submitModal.addError('storyEmail');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }

        if (!model.concessionFileName()) {
          $('#concessionInput').css('border-color', 'red');
          submitModal.addError('storyData');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }

        var concessionFile = $('#concessionInput')[0].files[0];
        var facilityFile = $('#facilityInput')[0].files[0];
        var otherFile = $('#otherInput')[0].files[0];

        if (concessionFile || facilityFile || otherFile) {
          var form_data = new FormData();
          if (concessionFile) {
            form_data.append('concessionFile', concessionFile);
            form_data.append('concessionFileName', concessionFileName);
            form_data.append('concessionFileType', concessionFileType);
          }
          if (facilityFile) {
            form_data.append('facilityFile', facilityFile);
            form_data.append('facilityFileName', facilityFileName);
            form_data.append('facilityFileType', facilityFileType);
          }
          if (otherFile) {
            form_data.append('otherFile', otherFile);
            form_data.append('otherFileName', otherFileName);
            form_data.append('otherFileType', otherFileType);
          }

          form_data.append('storyEmail', model.storyEmailData());
          form_data.append('storyTitle', model.storyTitleData());
          form_data.append('storyCompany', model.storyCompanyData());
          form_data.append('storyUserName', model.storyNameData());

          var d = new Date();
          var datestring = d.getDate() + '_' + (d.getMonth() + 1) + '_' + d.getFullYear();

          form_data.append('datestring', datestring);

          $.ajax({
            url: 'app/php/post_file_to_s3.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(){
              console.log(arguments);
              // self.uploadToAGOL(response);
              submitModal.addError('submissionSuccess');
              var modalNode = submitModal.getDOMNode();
              domClass.remove(modalNode.parentNode, 'hidden');
              $('#storyForm')[0].reset();
            },
            error: function () {
              console.log(arguments);
              submitModal.addError('s3Error');
              node = submitModal.getDOMNode();
              domClass.remove(node.parentNode, 'hidden');
            }
          });

        }
    },
    handleFileChange: function(obj, evt){
      if (evt.target.files.length === 0) {
        return;
      }
      var fileName = evt.target.files[0].name;
      var hash = {
        '.xls': 1,
        '.xlsx': 1,
        '.csv': 1
      };
      var re = /\..+$/;
      var ext = fileName.match(re);

      var fileType = evt.target.files[0].type;

      // if (fileType !== 'text/csv' && fileType !== 'application/zip' && hash[ext] !== 1) {
      //   evt.target.value = '';
      //   if (evt.target.value) {
      //     evt.target.type = 'file';
      //     evt.target.type = 'input';
      //   }
      //   alert('You must submit a zipped shapfile or a CSV/XLS!');
      //
      //   return;
      // }

      if (evt.target.id === 'concessionInput') {
        obj.concessionFileName(fileName);
        obj.concessionFileType(fileType);
      } else if (evt.target.id === 'facilityInput') {
        obj.facilityFileName(fileName);
        obj.facilityFileType(fileType);
      } else if (evt.target.id === 'otherInput') {
        obj.facilityFileName(fileName);
        obj.facilityFileType(fileType);
      }


    },
    uploadToAGOL: function(response){
      var arr = response.split(';');
      var modalNode;

      var url1 = arr[0];
      var url2;
      if (arr.length > 1){
        url2 = arr[1];
      }
      var attributes = {};
      attributes.name = self.model.storyNameData();
      attributes.company = self.model.storyCompanyData();
      attributes.title = self.model.storyTitleData();
      attributes.email = self.model.storyEmailData();
      if (self.model.storyDetailsData()) {
          attributes.notes = self.model.storyDetailsData();
      }
      attributes.data_file_name = self.model.dataFileName();
      if (self.model.facilityFileName()) {
          attributes.att_file_name = self.model.facilityFileName();
      }
      attributes.data_url = url1;
      if (url2) {
        attributes.attribute_url = url2;
      }

      var features = [
        {
          attributes: attributes
        }
      ];

      // var proxyUrl = 'http://commodities-test.herokuapp.com/app/php/proxy.php';
      var proxyUrl = './app/php/proxy.php';

      esri.config.defaults.io.proxyUrl = proxyUrl;
      esri.config.defaults.io.alwaysUseProxy = false;

      var layerUrl = 'http://services.arcgis.com/hBEMHCkbQdfV906F/arcgis/rest/services/data_submission_form/FeatureServer/0/addFeatures';
      var layersRequest = esriRequest({
        url: layerUrl,
        content: {
          'f': 'json',
          features: JSON.stringify(features)
        },
        handleAs: 'json',
        callbackParamName: 'callback'
      },
      {
        usePost: true,
        useProxy: true
      });

      layersRequest.then(
        function() {
          submitModal.addError('submissionSuccess');
          modalNode = submitModal.getDOMNode();
          domClass.remove(modalNode.parentNode, 'hidden');
          $('#storyForm')[0].reset();
      }, function() {
          submitModal.addError('layersRequestError');
          modalNode = submitModal.getDOMNode();
          domClass.remove(modalNode.parentNode, 'hidden');
      });

    }

	};

});
