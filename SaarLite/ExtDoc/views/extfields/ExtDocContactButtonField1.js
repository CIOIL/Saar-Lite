Ext.define('ExtDoc.views.extfields.ExtDocContactButtonField1', {
	extend: 'ExtDoc.views.extfields.ExtDocButtonField',
	requires: ['ExtDoc.utils.ExtDocEmail','ExtDoc.mock.ExtDocMockOutlook', 'ExtDoc.utils.ExtDocRedemption'],
	style: {
         width: '24px', //doesn't work
         border: 'none',
         backgroundImage: "url('images/Icon-Plus.png')",
         backgroundRepeat: 'no-repeat',
         marginLeft: '125px',
         marginBottom: '5px',
         outline: 0
	},
	listeners: {
		afterrender: function(){
			this.getEl().dom.style.width = '19px';
			this.getEl().dom.style.border = 'none';
			if (this.fieldLabel && this.fieldLabel.length > 0){
				this.displayLabel();
			}
			
			this.updateAfterRender();	
		},
		focus: function(){
			this.getEl().dom.style.outline = 0;
			this.getEl().dom.style.border = 'none';
		}
	},
	callGetRecipients: function(){
		var field = this;
		window.getRecipients = function (contactsJson){
			var contacts = eval(contactsJson);
			field.fillToPanel(contacts);
			field.fillCcPanel(contacts);
			field.fillFromPanel(contacts);
		}
		var fromIds = this.getFromContactIds();
		var toIds = this.getToContactIds();
		var ccIds = this.getCcContactIds();
		
			if (fromIds){
				this.invokeGetRecipients(fromIds, toIds, ccIds);
			} else {
				ExtDoc.utils.ExtDocEmail.getEmail(this.invokeGetRecipients, toIds, ccIds);
			}
		
		
		
	}, 
	invokeGetRecipients: function(userEmail, toIds, ccIds){
		//if redemption...
		if ('redemption' == ExtDoc.config.ExtDocConfig.outlookConnection && BrowserDetectorFactory.getBrowserDetector().isIE()){
			toIds = toIds.indexOf(';') > -1 ? toIds.split(';') : [toIds];
			ccIds = ccIds.indexOf(';') > -1 ? ccIds.split(';') : [ccIds];
			var recipients = ExtDoc.utils.ExtDocRedemption.getRecipients([userEmail], toIds, ccIds);
			if (recipients && recipients.length > 0){
				getRecipients(JSON.stringify(recipients));
			}
			return;
		}
		
		// else addin...
		if (!BrowserDetectorFactory.getBrowserDetector().isIE()){
			ExtDoc.mock.ExtDocMockOutlook.mock();
		}
		try
		{
			window.external.GetRecipients(userEmail, toIds, ccIds);
		}
		catch (e)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'recepients_invoked_not_in_addin');
		}
	},
	fillToPanel: function(contacts){
		this.fillContactsPanel(contacts, 2, 'to_panel');
	}, 
	fillCcPanel: function(contacts){
		this.fillContactsPanel(contacts, 3, 'cc_panel');
	},
	fillFromPanel: function(contacts){
		this.fillContactsPanel(contacts, 1, 'from_panel');
	},
	fillContactsPanel: function(contacts, typeId, fieldName){
		var panel = this.getFieldPanel().getPanelWindow().getFieldByName(fieldName);
		if (!panel){
			return;
		}
		var contactsArray = [];
		for (var i = 0; i < contacts.length; i++) {
			if (contacts[i].Type == typeId){
				var isExist=  this.checkIfExist(contactsArray, contacts[i].Email);
				if(!isExist)
					contactsArray.push(contacts[i]);
			}
        }
		panel.setContacts(contactsArray);
	}, 
	checkIfExist: function(contactsArray, email){
		for (var i = 0; i < contactsArray.length; i++) {
			if(contactsArray[i].Email == email)
				return true;
		}
		return false;
	},
	getToContactIds: function(){
		return this.getContactIds('to_panel');
	},
	getCcContactIds: function(){
		return this.getContactIds('cc_panel');
	},
	getFromContactIds: function(){
		return this.getContactIds('from_panel');
	},
	getContactIds: function(fieldName){
		var panel = this.getFieldPanel().getPanelWindow().getFieldByName(fieldName);
		if (!panel){
			return;
		}
		
		var contactsArr =  panel.getContacts();
		var contactIds = '';
		for (var i = 0; i < contactsArr.length; i++){
			contactIds += (';' + contactsArr[i].Email);
		}
		return contactIds.substring(1);
	}
});