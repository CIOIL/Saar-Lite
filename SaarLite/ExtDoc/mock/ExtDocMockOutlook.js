Ext.define('ExtDoc.mock.ExtDocMockOutlook', {
	singleton: true,
	alert: null,
	mock: function(){
		window.external = new Object();
		window.external.GetRecipients = function(){
			ExtDoc.mock.ExtDocMockOutlook.alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
			ExtDoc.mock.ExtDocMockOutlook.alert.show('mock', 'mock_data_use_inside_outlook', ExtDoc.mock.ExtDocMockOutlook.alertOk);				
		}
		function Contacts(){
			this.items = [ {
				Address: '1111@gmail.com',
				Name: '1111',
				Type: 1
			}, //type: 1-from, 2-to, 3-cc
			{
				Address: '22dfgdfgdfg22@gmail.com',
				Name: '222dfgdfgdfdfg2',
				Type: 2
			}, {
				Address: '3333@gmail.com',
				Name: '3333',
				Type: 3
			}, {
				Address: '1111@gmail.com',
				Name: '1111',
				Type: 1
			}, //type: 1-from, 2-to, 3-cc
			{
				Address: '2222@gmail.com',
				Name: '2222',
				Type: 2
			}, {
				Address: '3333@gmail.com',
				Name: '3333',
				Type: 3
			}, {
				Address: '1111@gmail.com',
				Name: '1111',
				Type: 1
			}, //type: 1-from, 2-to, 3-cc
			{
				Address: '2222@gmail.com',
				Name: '2222',
				Type: 2
			}, {
				Address: '3333@gmail.com',
				Name: '3333',
				Type: 3
			}, {
				Address: '1111@gmail.com',
				Name: '1111',
				Type: 1
			}, //type: 1-from, 2-to, 3-cc
			{
				Address: '2222@gmail.com',
				Name: '2222',
				Type: 2
			}, {
				Address: '3333@gmail.com',
				Name: '3333',
				Type: 3
			} ];
			this.Count = this.items.length;
			this.Item = function(index){
				return this.items[index - 1];
			}
		}
	}, 
	alertOk : function(){
		var contactsJson = '[{"Name":"Abed Naser","Email":"Abed.Naser@comply.co.il","Type":1, "FirstName":"Abed", "LastName":"Naser", "PhoneNumber":"4654645656", "HomePhone":"564565", "FaxNumber":"345345", "FullAddress":"dfgdfgdfg", "CityAddress":"sdfsdf", "JobTitles":"dfsddf","Alias":"ljklkj", "PostalCode":"45667", "CompanyName":"CL","Department":"AA","Initials":"A.G.","Pager":"56756","StateProvince":"merkaz" },'+
		                    '{"Name":"Adi Eyal","Email":"Adi.Eyal@ness-tech.co.il","Type":2, "FirstName":"Abed", "LastName":"Naser", "PhoneNumber":"4654645656", "HomePhone":"564565", "FaxNumber":"345345", "FullAddress":"dfgdfgdfg", "CityAddress":"sdfsdf", "JobTitles":"dfsddf","Alias":"ljklkj", "PostalCode":"45667", "CompanyName":"CL","Department":"AA","Initials":"A.G.","Pager":"56756","StateProvince":"merkaz" },'+
		                    '{"Name":"Adar Chaim","Email":"Adar.Chaim@ness-tech.co.il","Type":2, "FirstName":"Abed", "LastName":"Naser", "PhoneNumber":"4654645656", "HomePhone":"564565", "FaxNumber":"345345", "FullAddress":"dfgdfgdfg", "CityAddress":"sdfsdf", "JobTitles":"dfsddf","Alias":"ljklkj", "PostalCode":"45667", "CompanyName":"CL","Department":"AA","Initials":"A.G.","Pager":"56756","StateProvince":"merkaz" },'+
		                    '{"Name":"Adi Filgut","Email":"Adi.Filgut@tsgitsystems.com","Type":3, "FirstName":"Abed", "LastName":"Naser", "PhoneNumber":"4654645656", "HomePhone":"564565", "FaxNumber":"345345", "FullAddress":"dfgdfgdfg", "CityAddress":"sdfsdf", "JobTitles":"dfsddf","Alias":"ljklkj", "PostalCode":"45667", "CompanyName":"CL","Department":"AA","Initials":"A.G.","Pager":"56756","StateProvince":"merkaz" },'+
		                    '{"Name":"Adi Eyal","Email":"Adi.Eyal@ness-tech.co.il","Type":3, "FirstName":"Abed", "LastName":"Naser", "PhoneNumber":"4654645656", "HomePhone":"564565", "FaxNumber":"345345", "FullAddress":"dfgdfgdfg", "CityAddress":"sdfsdf", "JobTitles":"dfsddf","Alias":"ljklkj", "PostalCode":"45667", "CompanyName":"CL","Department":"AA","Initials":"A.G.","Pager":"56756","StateProvince":"merkaz" }]';
		window.getRecipients(contactsJson);

	}
});