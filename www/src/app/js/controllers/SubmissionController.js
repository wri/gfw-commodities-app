define([
    'dojo/dom',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'map/SubmissionModal',
    'dijit/registry',
    'esri/graphic',
    'esri/request',
    'utils/NavListController',
    'models/SubmissionModel'
], function (dom, query, domClass, domStyle, SubmissionModal, registry, Graphic, esriRequest, NavListController, SubmissionModel) {

	var initialized = false;
  var self;

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

        $('#dataInput').css('border-color', '#c0c0c0');
        $('#attributeDataInput').css('border-color', '#c0c0c0');

        var dataFileName = model.dataFileName();
        var dataFileType = model.dataFileType();
        var attributeFileName = model.attributeFileName();
        var attributeFileType = model.attributeFileType();


        if (!model.storyNameData()) {
          $('#storyNameInput').css('border-color', 'red');
          // alert('Please enter your name!');
          SubmissionModal.addClass('story-name');
          SubmissionModal.toggle();
          return;
        }
        if (!model.storyCompanyData()) {
          $('#storyCompanyInput').css('border-color', 'red');
          alert('Please enter your company!');
          return;
        }
        if (!model.storyTitleData()) {
          $('#storyTitleInput').css('border-color', 'red');
          alert('Please enter your title!');
          return;
        }
        if (!model.storyEmailData()) {
          $('#storyEmailInput').css('border-color', 'red');
          alert('Please enter your email!');
          return;
        }

        if (!model.dataFileName()) {
          $('#dataInput').css('border-color', 'red');
          alert('Please attach your data!');
          return;
        }

        var dataFile = $('#dataInput')[0].files[0];
        var attributeFile = $('#attributeDataInput')[0].files[0];


        if (dataFile) {

          var form_data = new FormData();
          form_data.append('dataFile', dataFile);
          form_data.append('dataFileName', dataFileName);
          form_data.append('dataFileType', dataFileType);

          if (attributeFile) {
            form_data.append('attributeFile', attributeFile);
            form_data.append('attributeFileName', attributeFileName);
            form_data.append('attributeFileType', attributeFileType);
          }

          $.ajax({
            url: 'app/php/post_file_to_s3.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(response){
              self.uploadToAGOL(response);
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
        '.xls'  : 1,
        '.xlsx' : 1,
        '.csv'  : 1
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

      if (evt.target.id === 'dataInput') {
        obj.dataFileName(fileName);
        obj.dataFileType(fileType);
      } else if (evt.target.id === 'attributeDataInput') {
        obj.attributeFileName(fileName);
        obj.attributeFileType(fileType);
      }


    },
    uploadToAGOL: function(response){

      var arr = response.split(';');

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
      if (self.model.attributeFileName()) {
          attributes.att_file_name = self.model.attributeFileName();
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

      var proxyUrl = 'http://commodities-test.herokuapp.com/app/php/proxy.php';

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
        function(response) {
          console.log('Success: ', response);
          alert('Data successfully submitted!')
      }, function(error) {
          alert('Data was not successfully submitted, please try again.')
          console.log('Error: ', error.message);
      });


    }

	};

});
