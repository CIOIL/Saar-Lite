Ext.define('ExtDoc.views.extimportdocumentwindow.ExtDocImportDocumentWindowController', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowImportDocumentController',

	saveWindowAction: function() {
		this.uploadImport();
	},
	submitSuccess: function() {
		this.getView().getObjectFather().fireEvent('reloadCurrent');
		this.callParent(arguments);
	},
	uploadImport: function() {
		var currentImport = this;
		// var completeUrl = ExtDoc.config.ExtDocConfig.restUrl +
		// "os/insert";
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/createObject";
		var fileField = this.getFieldByName('file');

		if (fileField.value.length > 0)
		{
			this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('uploading_document'));
			if (this.getView().getToolbarByName("bottom_toolbar"))
			{
				if (this.getView().getToolbarByName("bottom_toolbar").getToolByName("okbtn"))
				{
					this.getView().getToolbarByName("bottom_toolbar").getToolByName("okbtn").disable();
				}
				if (this.getView().getToolbarByName("bottom_toolbar").getToolByName("cancelbtn"))
				{
					this.getView().getToolbarByName("bottom_toolbar").getToolByName("cancelbtn").disable();
				}
			}

			ExtDoc.utils.ExtDocAjax.setMaskObject(null);
			Ext.Ajax.request({
				url: completeUrl,
				method: 'POST',
				headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),

				success: function(response, opts) {
					currentImport.uploadContent(response.responseText);
				},

				failure: function(response, opts) {

					currentImport.finalizeUpload(response.status);

					// addition
					currentImport.getView().unmask();
					if (currentImport.getView().getToolbarByName("bottom_toolbar"))
					{
						if (currentImport.getView().getToolbarByName("bottom_toolbar").getToolByName("okbtn"))
						{
							currentImport.getView().getToolbarByName("bottom_toolbar").getToolByName("okbtn").enable();
						}
						if (currentImport.getView().getToolbarByName("bottom_toolbar").getToolByName("cancelbtn"))
						{
							currentImport.getView().getToolbarByName("bottom_toolbar").getToolByName("cancelbtn").enable();
						}
					}
					currentImport.handleFailure(response);
				},

				jsonData: currentImport.buildNewObjectJson()
			});
		} else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'import_file_error');
		}
	},
	handleFailure: function(response) {
		// Validation error
		if (response.status == 400 && ExtDoc.utils.ExtDocUtils.isTextJson(response.responseText))
		{
			this.setValidationError(response.responseText);
		} else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'servererror');
		}
	},

	setValidationError: function(validationsErrorResponse) {
		if (!Ext.isEmpty(validationsErrorResponse))
		{
			this.getView().setValidationErrorObject(Ext.util.JSON.decode(validationsErrorResponse));
			this.validateWindowOnClient();
		}

	},
	validateWindowOnClient: function() {
		for (var index = 0; index < this.getView().tabbar.getTbPanels().length; index++)
		{
			var form = this.getView().tabbar.getTbPanels()[index];

			if (!form.isValid())
			{
				this.getView().tabbar.setActiveTab(index);
			}
		}
	},
	uploadContent: function(newObjectId) {

		var fileField = this.getFieldByName('file');

		var currentImport = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/updateimportedobjectcontent/" + newObjectId;

		var formData = new FormData();
		var xhr = new XMLHttpRequest();

		formData.append('file', fileField.fileInputEl.dom.files[0]);

		xhr.open('POST', completeUrl);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			xhr.setRequestHeader('Authorization', '');
		}
		xhr.onloadend = function(evt) {
			if (evt.target.status === 200)
			{
				currentImport.finalizeUpload(200);
				currentImport.submitSuccess();
			} else
			{
				currentImport.finalizeUpload(evt.target.status);
			}
		};

		xhr.send(formData);
		this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'), 'loading');
	},
	buildNewObjectJson: function() {
		var object = {};
		var objectProperties = {};

		for (var index = 0; index < this.getView().tabbar.getTbPanels().length; index++)
		{
			var form = this.getView().tabbar.getTbPanels()[index];

			for (var indexItems = 0; indexItems < form.items.length; indexItems++)
			{
				if (form.items.get(indexItems).getName().indexOf('from') > -1 
						|| form.items.get(indexItems).getName().indexOf('to') > -1 
						|| form.items.get(indexItems).getName().indexOf('cc') > -1){
					continue;
				}
				if (form.items.get(indexItems).getName() != "file")
				{
					objectProperties[form.items.get(indexItems).getName()] = form.items.get(indexItems).getValue();
				}
				
				if (form.items.get(indexItems).getXTypes().indexOf('datefield') != -1)
				{
					objectProperties[form.items.get(indexItems).getName()] = form.items.get(indexItems).getRawValue();	
				}
			}
		}

		// objectProperties['i_folder_id'] =
		// this.getView().getWindowRecord().get('i_folder_id');
		objectProperties['r_object_type'] =  this.getView().objectType;

		object['properties'] = objectProperties;
		var from_panel = this.getView().getFieldByName('from_panel');
		if (from_panel){
			from_panel.addContactsToProperties(object);
		}
		var to_panel = this.getView().getFieldByName('to_panel');
		if (to_panel){
			to_panel.addContactsToProperties(object);
		}
		var cc_panel = this.getView().getFieldByName('cc_panel');
		if (cc_panel){
			cc_panel.addContactsToProperties(object);
		}
		return Ext.JSON.encode(object);
	},
	finalizeUpload: function(status) {
		if (status == 200 || status == 201)
		{
			this.getView().unmask();
		} else
		{
		}
	}
});