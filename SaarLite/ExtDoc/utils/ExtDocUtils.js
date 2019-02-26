Ext.define('ExtDoc.utils.ExtDocUtils',{
	singleton: true,
	excludedColumns: null,
	getObjectFromProperties: function(properties){
		var object = {};
		
		for(var index = 0 ; index < properties.count() ; index++)
		{
			object[properties.getAt(index).get('name')] = properties.getAt(index).get('property_value');
		}

		return object;	
	},
	isRecordFolder: function(record){
		var isFolder = false;
		var objectId = record.get('r_object_id');
		
		if(objectId.indexOf('0b') == 0 || objectId.indexOf('0c') == 0)
		{
			isFolder = true;
		}

		return isFolder;
	},
	isFolder: function(record){
		var isFolder = false;
		var objectId = record.get('r_object_id');
		var objectType = record.get('r_object_type');
		
		if(objectId.indexOf('0b') == 0 && objectType != "gov_unit_folder")
		{
			isFolder = true;
		}

		return isFolder;
	},
	isRecordDocument: function(record){
		var isDocument = false;
		var objectId = record.get('r_object_id');
		
		if(objectId.indexOf('09') == 0)
		{
			isDocument = true;
		}

		return isDocument;
	},
	isRecordCabinet: function(record){
		var isCabinet = false;
		var objectId = record.get('r_object_id');
		
		if(objectId.indexOf('0c') == 0)
		{
			isCabinet = true;
		}

		return isCabinet;
	},
	cloneStore:function(source){
    	var target = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');

    	Ext.each (source.getRange (), function (record) {
        	var newRecordData = Ext.clone (record.copy().data);
        	target.add (newRecordData);
    	});

    	return target;
	},
	cloneRange:function(source){
		var target = new Array();
		
		Ext.each (source, function (record) {
        	var newRecordData = Ext.clone (record.copy().data);
        	target[target.length] = (newRecordData);
    	});
		
		return target;
	},
	showAlert: function(title,text,params){
		var alertTitle = ExtDoc.locales.ExtDocLocaleManager.getText(title);
		var alertText = ExtDoc.locales.ExtDocLocaleManager.getText(text,params);
		var alertRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		
		var message = Ext.create('Ext.window.MessageBox', {rtl: alertRtl, maxWidth: 0.8 * window.innerWidth});
		
		message.alert({
			title: alertTitle,
			msg: alertText
		});
	},
	unicodeToText: function(input){
		var textToReturn = "";
		
		for(var index = 0 ; index < input.length ; index += 4)
		{
			var unicode = input.substring(index, index + 4);
			textToReturn += String.fromCharCode(parseInt(unicode, 16));
		}
		
		return textToReturn;
	},
	prepareUrl: function(inputUrl,record){
		var returnUrl = inputUrl;
		
		try
		{
			while(returnUrl.indexOf("{") != -1)
			{
				var stratIndex = returnUrl.indexOf("{");
				var lastIndex = returnUrl.indexOf("}");
				
				var replaceValue = returnUrl.substring(stratIndex,lastIndex + 1);
				var propertyName = returnUrl.substring(stratIndex + 1,lastIndex);

				returnUrl = returnUrl.replace(replaceValue,record.get(propertyName));
			}
		}
		catch(e)
		{
			//Exception do nothing
		}

		return returnUrl;
	},
	getRandomNumber: function(){
		return (new Date().getTime() + Math.floor((Math.random() * 100000) + 1));
	},
	isTextJson: function(text){
		var isJson = false;
		
		try
		{
			if(!Ext.isEmpty(text))
			{
				JSON.parse(text);
				isJson = true;
			}
		}
		catch(e)
		{
			isJson = false;
		}
		
		return isJson;
	},
	getHomeFolderId: function(){
		return -1;
	},
	getRecentDocsFolderId: function(){
		return -10;
	},
	getSearchResultsFolderId: function(){
		return -100;
	},
	getFavoriteDocsFolderId: function(){
		return -1000;
	},
	getReturnRecordId: function (currentLocationId){
		if (currentLocationId == this.getRecentDocsFolderId()||
			currentLocationId == this.getSearchResultsFolderId()||
			currentLocationId == this.getFavoriteDocsFolderId())
		{
			return this.getHomeFolderId();
		}
		else
		{
			return currentLocationId;
		}
	},
	getReturnRecordName: function (currentLocation){
		var id = currentLocation.get('r_object_id');
		if (id == this.getRecentDocsFolderId()||
			id == this.getSearchResultsFolderId()||
			id == this.getFavoriteDocsFolderId() ||
			id == this.getHomeFolderId())
		{
			return ExtDoc.locales.ExtDocLocaleManager.getText('return_to_folder') + ExtDoc.locales.ExtDocLocaleManager.getText('cabinets');
		}
		else
		{
			return currentLocation.get('object_name').indexOf(ExtDoc.locales.ExtDocLocaleManager.getText('return_to_folder')) != -1 ? currentLocation.get('object_name') : ExtDoc.locales.ExtDocLocaleManager.getText('return_to_folder') + currentLocation.get('object_name');
		}
	},
	getColumnType: function(columnsType){
		if(columnsType == '4')
			 return 'ExtDoc.views.extgrid.columns.ExtDocGridDateColumn';
		else if(columnsType == 'codetable')
			return 'ExtDoc.views.extgrid.columns.ExtDocGridCodeTableColumn';
		else 
			return 'ExtDoc.views.extgrid.columns.ExtDocGridColumn';	
	},
	
});