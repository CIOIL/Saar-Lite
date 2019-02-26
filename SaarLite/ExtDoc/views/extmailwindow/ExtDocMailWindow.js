Ext.define('ExtDoc.views.extmailwindow.ExtDocMailWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.extmailwindow.ExtDocMailWindowController'],
	controller: 'windowMailController',
	id: 'mailwindow',
	objectIds: [],
	listeners: {
		afterrender: function(){
			this.updateAfterRender();	
		}
	}, 
	updateAfterRender : function(){
		var currentWindow = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'content/checkPDF/';
		
		//check if document has pdf rendition
		Ext.Ajax.request({
			url: completeUrl,
			method: 'POST',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts){ 
				if ('true' != response.responseText){
					currentWindow.getFieldByName('attach_pdf').setDisabled(true);
					currentWindow.getFieldByName('link_pdf').setDisabled(true);
				}
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
			},
			jsonData: currentWindow.buildJson()
		});
		
		//check if selected only one document
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObjects = mainGrid.getSelectionModel().getSelected();
		if (selectedObjects.length == 1){
			//set subject field
			currentWindow.getFieldByName('subject').setValue(selectedObjects.getAt(0).get('object_name'));
		}
		
		var linkPdfCheckBox = this.getFieldByName('link_pdf');
		linkPdfCheckBox.setValue(1);
		
		var contactsGrid = this.getFieldByName('contacts_grid');
		if (contactsGrid.hasCasualContact){
			var attachPdfCheckBox = this.getFieldByName('attach_pdf');
			attachPdfCheckBox.setValue(1);
		}
		
	},
	setObjectIds: function (ids){
		this.objectIds = ids;
	},
	getObjectsToEmail: function (){
		return this.objectIds;
	},
	buildJson: function() {
		var preJson = {
			"properties": {
				"docIds": this.objectIds
			}
		};
		var json = Ext.JSON.encode(preJson);
		return json;
	}, 
	getRecipients: function(){
		var recipients = [];
		var contactsGrid = this.getFieldByName('contacts_grid');
		for (var i = 0; i < contactsGrid.getStore().getRange().length; i++){
			var recipientObject = contactsGrid.getStore().getRange()[i].data;
			var newObject = {};
			if (recipientObject.type == ExtDoc.locales.ExtDocLocaleManager.getText("cc")){
				newObject.type = 'cc';
			} else {
				newObject.type = 'to';
			}
//			if (recipientObject.permission == ExtDoc.locales.ExtDocLocaleManager.getText("read")){
//				newObject.permission = 'read';
//			} else {
//				newObject.permission = 'edit';
//			}
			newObject.name = recipientObject.name;
			newObject.email = recipientObject.email;
			
			recipients.push(newObject);
		}
		
		return recipients;
	}
});