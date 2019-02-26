Ext.define('ExtDoc.views.extfields.ExtDocAuthorField', {
	mixins: [ 'ExtDoc.views.extfields.ExtDocField' ],
	extend: 'ExtDoc.views.extfields.ExtDocTextField',
	requires: 'ExtDoc.utils.ExtDocObjectPermissionUtils',
	objectAuthors: null,
	editable: true,
	regex: ExtDoc.utils.ExtDocObjectPermissionUtils.getSenderNameRegEx(),
	invalidText: ExtDoc.locales.ExtDocLocaleManager.getText('invalid_input_allowed_characters_letters_digits_spaces_underscores'),//"Invalid input. Only letters and numbers allowed.",

	updateAfterRender: function(){
		this.getAuthor();
	},
	getAuthor: function(){
		if (this.getFieldPanel().getPanelWindow() != null)
		{
			this.setFolderId(this.getFieldPanel().getPanelWindow().getWindowRecord().get('sender_name'));
		} else
		{
			return;
		}

		var currentField = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + this.getFieldProperties().get('dataUrl');

		Ext.Ajax.request({
			url: completeUrl,
			method: 'GET',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
			success: function(response, opts){
				currentField.initObjectAuthor(response.responseText);
				currentField.reportLoaded();
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'servererror');
			}
		});
	},
	setObjectAuthors: function(newAuthors){
		//set sender name in Author field
		this.objectAuthors = newAuthors;
		var value = "";

		for (var index = 0; index < newAuthors.length; index++)
		{
			value = value + newAuthors[index]["sender_name"];

			if (index < newAuthors.length - 1)
			{
				value = value + ", ";
			}
		}
		this.setFieldValue(value);
	},
	initObjectAuthor: function(newObjectAuthor){
		var result = Ext.util.JSON.decode(newObjectAuthor);
		var notEmptyIndex = 0;
		var objectAuthors = new Array();

		for (var index = 0; index < result.length; index++)
		{
			if (result[index].properties.sender_name != null)
			{
				var arrayElement = {};
				arrayElement["sender_name"] = result[index].properties.sender_name;
				objectAuthors[notEmptyIndex] = arrayElement;
				notEmptyIndex++;
			}
		}
		this.setObjectAuthors(objectAuthors);
		
		//check readonly
		for (index = 0; index < result.length; index++)
		{
			if (result[index].properties.readonly != null)
			{
				if ('true' === result[index].properties.readonly){
					//this.readOnly = true;
					this.setReadOnly(true);
					break;
				}
			}
		}
		
		
	},
	reportLoaded: function(){
		this.getFieldPanel().reportLoaded(true);
	},
	setFolderId: function(newFolderId){
		this.folderId = newFolderId;
	},
	getFolderId: function(){
		return this.folderId;
	}
});
