Ext.define('ExtDoc.views.extfields.ExtDocContactsPanelField', {
	extend: 'ExtDoc.views.extfields.ExtDocPanelField',
	contacts: [],
	html: '',
	getContacts: function(){
		return this.contacts;
	},
	setContacts: function(contacts){
		this.contacts = contacts;
		this.updateHtml();
		this.setRemoveHandlers();
	},
	updateHtml: function(){
		var html = '<table  style="width:100%; table-layout: fixed;border-collapse: collapse; ">';
		for (var i = 0; i < this.contacts.length; i++)
		{
			if (this.contacts[i])
			{
				html += '<tr>';
				html += '<td style="width: 30%;overflow:hidden;padding-right:5px;padding-left:5px;">';
				html += '<span style="width: 90px;overflow:hidden;font-weight: bold;" title="' + this.contacts[i].Name + '">'
						+ this.contacts[i].Name + '</span>';
				html += '</td>';
				html += '<td style="overflow:hidden;padding-right:5px;padding-left:5px;" dir="ltr">';
				if (this.contacts[i].Email)
				{
					//this.contacts[i].Email = 'mockmail@test.com';
					//html += '<span dir="ltr" style="color:blue;text-decoration:underline;width: 100px;overflow:hidden;" title="'
					//+ this.contacts[i].Email + '">' + this.contacts[i].Email + '</span>';
					html += '<a dir="ltr" href="mailto:' + this.contacts[i].Email + '" title="' + this.contacts[i].Email + '">'
							+ this.contacts[i].Email + '</a>';
				} else
				{
					html += '<span dir="ltr" style="color:blue;text-decoration:underline;width: 100px;overflow:hidden;" title="'
							+ 'mockmail@test.com' + '">' + ' ' + '</span>';
				}

				html += '</td>';
				html += '<td style="width: 10%;padding-right:5px;">';
				html += '<button style="color:red;border:none;background-color:white;cursor:pointer;" id="' + this.name
						+ '_contact_remove_button_' + i + '">X</button>';
				html += '</td>';
				html += '</tr>';
			}
		}
		html += '</table>';
		this.html = html;
		this.update(html);
	},
	setRemoveHandlers: function(){
		var panel = this;
		for (var i = 0; i < this.contacts.length; i++)
		{
			var buttonElement = Ext.get(panel.name + '_contact_remove_button_' + i);
			if (buttonElement)
			{
				buttonElement.on('click', function(index){
					return function(){
						panel.removeContact(index);
					}
				}(i));
			}
		}
	},
	removeContact: function(index){
		this.contacts.splice(index, 1);
		this.updateHtml();
		this.setRemoveHandlers();
	},
	getValue: function(){
		return '';
	},
	listeners: {
		afterrender: function(){
			var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
			var selectedObject = mainGrid.getSelectionModel().getSelected().getAt(0);
			if (selectedObject && this.dontRequest !== true)
			{
				this.requestContacts();
				
			}
		}
	},
	requestContacts: function(){
		var currentWindow = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'content/getContacts/';

		Ext.Ajax.request({
			url: completeUrl,
			method: 'POST',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts){
				currentWindow.showContacts(response.responseText);
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'servererror');
			},
			jsonData: currentWindow.buildJson()
		});
	},
	buildJson: function(){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObject = mainGrid.getSelectionModel().getSelected().getAt(0);
		var preJson = {
			"properties": {
				"docIds": [ selectedObject.get('r_object_id') ],
				"r_object_type": selectedObject.get('r_object_type')
			}
		};
		var json = Ext.JSON.encode(preJson);
		return json;
	},
	showContacts: function(json){
		//console.log(json);
		var response = JSON.parse(json);
		if (response.properties.addressee_name && this.getName() == 'to_panel')
		{
			//var toPanel = this.getFieldByName('to_panel');
			var toContacts = [];
			if (response.properties.addressee_name.constructor === Array && response.properties.addressee_name.length > 0)
			{
				for (var i = 0; i < response.properties.addressee_name.length; i++)
				{
					var to = {
						Name: response.properties.addressee_name[i],
						Email: response.properties.addressee_id[i],
						FirstName: response.properties.addressee_first_name[i],
						LastName: response.properties.addressee_last_name[i],
						PhoneNumber: response.properties.addressee_phone_number[i],
						FaxNumber: response.properties.addressee_fax_number[i],
						FullAddress: response.properties.addressee_full_address[i],
						CityAddress: response.properties.addressee_city_address[i],
						JobTitles: response.properties.addressee_job_title[i],
						Alias: response.properties.addressee_alias[i],
						PostalCode: response.properties.addressee_postal_code[i],
						CompanyName: response.properties.addressee_company_name[i],
						Department: response.properties.addressee_department[i],
						Initials: response.properties.addressee_initials[i],
						Title: response.properties.addressee_title[i],
						Pager: response.properties.addressee_pager[i],
						StateProvince: response.properties.addressee_state_province[i],
						HomePhone: response.properties.addressee_home_phone[i]

					};
					toContacts.push(to);
				}

			} else if(response.properties.addressee_name.constructor !== Array)
			{
				var to = {
					Name: response.properties.addressee_name,
					Email: response.properties.addressee_id,
					FirstName: response.properties.addressee_first_name,
					LastName: response.properties.addressee_last_name,
					PhoneNumber: response.properties.addressee_phone_number,
					FaxNumber: response.properties.addressee_fax_number,
					FullAddress: response.properties.addressee_full_address,
					CityAddress: response.properties.addressee_city_address,
					JobTitles: response.properties.addressee_job_title,
					Alias: response.properties.addressee_alias,
					PostalCode: response.properties.addressee_postal_code,
					CompanyName: response.properties.addressee_company_name,
					Department: response.properties.addressee_department,
					Initials: response.properties.addressee_initials,
					Title: response.properties.addressee_title,
					Pager: response.properties.addressee_pager,
					StateProvince: response.properties.addressee_state_province,
					HomePhone: response.properties.addressee_home_phone

				};
				toContacts.push(to);
			}
			this.setContacts(toContacts);
		}
		if (response.properties.cc_name && this.getName() == 'cc_panel')
		{
			var ccContacts = [];
			if (response.properties.cc_name.constructor === Array && response.properties.cc_name.length > 0)
			{
				for (var j = 0; j < response.properties.cc_name.length; j++)
				{
					var cc = {
						Name: response.properties.cc_name[j],
						Email: response.properties.cc_id[j],
						FirstName: response.properties.cc_first_name[j],
						LastName: response.properties.cc_last_name[j],
						PhoneNumber: response.properties.cc_phone_number[j],
						FaxNumber: response.properties.cc_fax_number[j],
						FullAddress: response.properties.cc_full_address[j],
						CityAddress: response.properties.cc_city_address[j],
						JobTitles: response.properties.cc_job_title[j],
						Alias: response.properties.cc_alias[j],
						PostalCode: response.properties.cc_postal_code[j],
						CompanyName: response.properties.cc_company_name[j],
						Department: response.properties.cc_department[j],
						Initials: response.properties.cc_initials[j],
						Title: response.properties.cc_title[j],
						Pager: response.properties.cc_pager[j],
						StateProvince: response.properties.cc_state_province[j],
						HomePhone: response.properties.cc_home_phone[j]

					};
					ccContacts.push(cc);
				}
			} else if(response.properties.cc_name.constructor !== Array)
			{
				var cc = {
					Name: response.properties.cc_name,
					Email: response.properties.cc_id,
					FirstName: response.properties.cc_first_name,
					LastName: response.properties.cc_last_name,
					PhoneNumber: response.properties.cc_phone_number,
					FaxNumber: response.properties.cc_fax_number,
					FullAddress: response.properties.cc_full_address,
					CityAddress: response.properties.cc_city_address,
					JobTitles: response.properties.cc_job_title,
					Alias: response.properties.cc_alias,
					PostalCode: response.properties.cc_postal_code,
					CompanyName: response.properties.cc_company_name,
					Department: response.properties.cc_department,
					Initials: response.properties.cc_initials,
					Title: response.properties.cc_title,
					Pager: response.properties.cc_pager,
					StateProvince: response.properties.cc_state_province,
					HomePhone: response.properties.cc_home_phone

				};
				ccContacts.push(cc);
			}
			this.setContacts(ccContacts);
		}
		if (response.properties.sender_name && this.getName() == 'from_panel')
		{
			var fromContacts = [];
			if (response.properties.sender_name.constructor === Array && response.properties.sender_name.length > 0)
			{
				for (var j = 0; j < response.properties.sender_name.length; j++)
				{
					var from = {
						Name: response.properties.sender_name[j],
						Email: response.properties.sender_id[j]
					};
					fromContacts.push(from);
				}
			} else if(response.properties.sender_name.constructor !== Array)
			{
				var from = {
					Name: response.properties.sender_name,
					Email: response.properties.sender_id
				};
				fromContacts.push(from);
			}
			this.setContacts(fromContacts);
		}
	},
	addContactsToProperties: function(object){
		var outlook_fields = [ "first_name", "last_name", "phone_number", "fax_number", "full_address", "city_address", "job_title",
								"alias", "postal_code", "company_name", "department", "initials", "title", "pager", "state_province",
								"home_phone" ];
		if (this.getName() == 'to_panel')
		{
			object.properties.addressee_name = [];
			object.properties.addressee_id = [];
			for (var i = 0; i < outlook_fields.length; i++)
			{
				object.properties['addressee_' + outlook_fields[i]] = [];
			}
			for (var i = 0; i < this.getContacts().length; i++)
			{
				object.properties.addressee_name.push(this.getContacts()[i].Name);
				object.properties.addressee_id.push(this.getContacts()[i].Name.indexOf('#') != -1 ? this.getContacts()[i].Name : this.getContacts()[i].Email);

				object.properties.addressee_first_name.push(this.getContacts()[i].FirstName);
				object.properties.addressee_last_name.push(this.getContacts()[i].LastName);
				object.properties.addressee_phone_number.push(this.getContacts()[i].PhoneNumber);
				object.properties.addressee_fax_number.push(this.getContacts()[i].FaxNumber);
				object.properties.addressee_full_address.push(this.getContacts()[i].FullAddress);
				object.properties.addressee_city_address.push(this.getContacts()[i].CityAddress);
				object.properties.addressee_job_title.push(this.getContacts()[i].JobTitles);
				object.properties.addressee_alias.push(this.getContacts()[i].Alias);
				object.properties.addressee_postal_code.push(this.getContacts()[i].PostalCode);
				object.properties.addressee_company_name.push(this.getContacts()[i].CompanyName);
				object.properties.addressee_department.push(this.getContacts()[i].Department);
				object.properties.addressee_initials.push(this.getContacts()[i].Initials);
				object.properties.addressee_title.push(this.getContacts()[i].Title);
				object.properties.addressee_pager.push(this.getContacts()[i].Pager);
				object.properties.addressee_state_province.push(this.getContacts()[i].StateProvince);
				object.properties.addressee_home_phone.push(this.getContacts()[i].HomePhone);

			}
		}
		if (this.getName() == 'cc_panel')
		{
			object.properties.cc_name = [];
			object.properties.cc_id = [];
			for (var i = 0; i < outlook_fields.length; i++)
			{
				object.properties['cc_' + outlook_fields[i]] = [];
			}
			for (var i = 0; i < this.getContacts().length; i++)
			{
				object.properties.cc_name.push(this.getContacts()[i].Name);
				object.properties.cc_id.push(this.getContacts()[i].Email);
				object.properties.cc_first_name.push(this.getContacts()[i].FirstName);
				object.properties.cc_last_name.push(this.getContacts()[i].LastName);
				object.properties.cc_phone_number.push(this.getContacts()[i].PhoneNumber);
				object.properties.cc_fax_number.push(this.getContacts()[i].FaxNumber);
				object.properties.cc_full_address.push(this.getContacts()[i].FullAddress);
				object.properties.cc_city_address.push(this.getContacts()[i].CityAddress);
				object.properties.cc_job_title.push(this.getContacts()[i].JobTitles);
				object.properties.cc_alias.push(this.getContacts()[i].Alias);
				object.properties.cc_postal_code.push(this.getContacts()[i].PostalCode);
				object.properties.cc_company_name.push(this.getContacts()[i].CompanyName);
				object.properties.cc_department.push(this.getContacts()[i].Department);
				object.properties.cc_initials.push(this.getContacts()[i].Initials);
				object.properties.cc_title.push(this.getContacts()[i].Title);
				object.properties.cc_pager.push(this.getContacts()[i].Pager);
				object.properties.cc_state_province.push(this.getContacts()[i].StateProvince);
				object.properties.cc_home_phone.push(this.getContacts()[i].HomePhone);
			}
		}
		if (this.getName() == 'from_panel')
		{
			object.properties.sender_name = [];
			object.properties.sender_id = [];
			for (var i = 0; i < outlook_fields.length; i++)
			{
				object.properties['sender_' + outlook_fields[i]] = [];
			}
			for (var i = 0; i < this.getContacts().length; i++)
			{
				object.properties.sender_name.push(this.getContacts()[i].Name);
				object.properties.sender_id.push(this.getContacts()[i].Email);
				object.properties.sender_first_name.push(this.getContacts()[i].FirstName);
				object.properties.sender_last_name.push(this.getContacts()[i].LastName);
				object.properties.sender_phone_number.push(this.getContacts()[i].PhoneNumber);
				object.properties.sender_fax_number.push(this.getContacts()[i].FaxNumber);
				object.properties.sender_full_address.push(this.getContacts()[i].FullAddress);
				object.properties.sender_city_address.push(this.getContacts()[i].CityAddress);
				object.properties.sender_job_title.push(this.getContacts()[i].JobTitles);
				object.properties.sender_alias.push(this.getContacts()[i].Alias);
				object.properties.sender_postal_code.push(this.getContacts()[i].PostalCode);
				object.properties.sender_company_name.push(this.getContacts()[i].CompanyName);
				object.properties.sender_department.push(this.getContacts()[i].Department);
				object.properties.sender_initials.push(this.getContacts()[i].Initials);
				object.properties.sender_title.push(this.getContacts()[i].Title);
				object.properties.sender_pager.push(this.getContacts()[i].Pager);
				object.properties.sender_state_province.push(this.getContacts()[i].StateProvince);
				object.properties.sender_home_phone.push(this.getContacts()[i].HomePhone);
			}
		}
	},
	printObject: function(array){
		var output = '';
		for (var i = 0; i < array.length; i++)
		{
			var object = array[i];
			//alert (object);
			for ( var property in object)
			{
				output += property + ': ' + object[property] + '; ';
			}
		}
	}
});