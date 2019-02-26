Ext.define('ExtDoc.utils.ExtDocRecipients', {
	requires: [ 'ExtDoc.utils.ExtDocEmail', 'ExtDoc.mock.ExtDocMockOutlook', 'ExtDoc.utils.ExtDocRedemption' ],
	putRecipientsIntoDistributionStore: function(store){
		var toIds = this.getToContactIds(store);
		var ccIds = this.getCcContactIds(store);
		//var recipients = this.execute(toIds, ccIds);
		
		window.getRecipients = function (contactsJson){
			var contacts = eval(contactsJson);
			var data = [];
			for (var i = 0; i < contacts.length; i++)
			{
				var record = {};
				record.name = contacts[i].Name;
				record.email = contacts[i].Email;
				if (contacts[i].Type == 2){
					record.type = ExtDoc.locales.ExtDocLocaleManager.getText("to");
				} else if (contacts[i].Type == 3){
					record.type = ExtDoc.locales.ExtDocLocaleManager.getText("cc");
				}
				data[i] = record;
				//store.add(record);
			}
			store.loadData(data, false);
		}
		this.execute(toIds, ccIds, null);
	},

	execute: function(toIds, ccIds, fromIds){		
		if (fromIds)
		{
			this.invokeGetRecipients(fromIds, toIds, ccIds);
		} else
		{
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
	
	getToContactIds: function (store){
		var contactIds = '';
		for (var i = 0; i < store.count(); i++){
			var record = store.getAt(i);
			if (record.get("type") == ExtDoc.locales.ExtDocLocaleManager.getText("to"))
			{
				if (record.get('email')){
					contactIds += (';' + record.get('email'));
				}
				
			}
		}
		return contactIds.substring(1);
	}, 
	getCcContactIds: function (store){
		var contactIds = '';
		for (var i = 0; i < store.count(); i++){
			var record = store.getAt(i);
			if (record.get("type") == ExtDoc.locales.ExtDocLocaleManager.getText("cc"))
			{
				if (record.get('email')){
					contactIds += (';' + record.get('email'));
				}
			}
		}
		return contactIds.substring(1);
	}

});