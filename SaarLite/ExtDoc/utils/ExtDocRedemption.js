Ext.define('ExtDoc.utils.ExtDocRedemption', {
    singleton: true, 
    getRecipients: function(fromEmailArray, toEmailArray, ccEmailArray){
    	var contacts = [];
    	var outlookMgr = getOutlookMgr("_0");
		var recipients = outlookMgr.browseContacts("_0", fromEmailArray, toEmailArray, ccEmailArray);
		if (!recipients){
			return;
		}
		for (var i = 1; i <= recipients.Count; i++){
			var recipient = recipients.Item(i);
			var entry = recipient.addressEntry;
			var dataContact;
			if (entry == null) {
				continue;
			} 

			if ('EX' == entry.Type){ //general user
				var entryByMail = outlookMgr.getContactFromContactsEntryByMail(entry.SMTPAddress);
			} else { //private user
				var entryByMail = outlookMgr.getContactFromContactsEntryByMail(entry.Address);
			}	



			if (entry.Members) //group
			{
				var splitGroup = false;
				if (splitGroup)
				{
					var membersGroup = setMembersGroup(entryByMail.outlook_id);

					for (var indexGroup = 0; indexGroup < membersGroup.length; indexGroup++)
					{
						var groupEntry = outlookMgr.getContactFromContactsEntryByMail(membersGroup[indexGroup]);
						this.addToContacts(contacts, groupEntry, recipient);
					}
				} else {
					this.addToContacts(contacts, entryByMail, recipient);
				}
					
				
		   	   	
			} else if (entryByMail.first_name == "" && entryByMail.last_name == ""){ //custom recipient 
				var contactName = entryByMail.outlook_id.split('@')[0];
				if (contactName.indexOf('.') > 0){
					contactName = contactName.split('.')[0] + ' ' + contactName.split('.')[1];
				}
				entryByMail.full_name = contactName;
				this.addToContacts(contacts, entryByMail, recipient);
		    } else { 
				this.addToContacts(contacts, entryByMail, recipient);
			}
		}
    	return contacts;
	},
	addToContacts: function(contacts, entryByMail, recipient){
		var contact = new Object();
		contact.Type = recipient.Type;
		contact.Email = entryByMail.outlook_id;
		contact.Name = entryByMail.full_name;
		contact.FirstName = entryByMail.first_name;
		contact.LastName = entryByMail.last_name;
		contact.PhoneNumber = entryByMail.phone_number;
		contact.FaxNumber = entryByMail.fax_number;
		contact.FullAddress = entryByMail.full_address;
		contact.CityAddress = entryByMail.city_address;
		contact.JobTitles = entryByMail.job_title;
		contact.Alias = entryByMail.alias;
		contact.PostalCode = entryByMail.postal_code;
		contact.CompanyName = entryByMail.company_name;
		contact.Department = entryByMail.department;
		contact.Initials = entryByMail.initials;
		contact.Title = entryByMail.title;
		contact.Pager = entryByMail.pager;
		contact.StateProvince = entryByMail.state_province;
		contact.HomePhone = entryByMail.home_phone;
		
		contacts.push(contact);
	}

});  