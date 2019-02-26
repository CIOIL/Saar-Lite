Ext.define('ExtDoc.tools.ExtDocFileUpload', {
	requires: ['ExtDoc.views.extprogressbar.ExtDocProgressBar'],
	dropZone: null,
	file: null,
	userAddress: null,
	progressBar: null,
	getDropZone: function(){
		return this.dropZone;
	},
	init: function(newDropZone,newFile){
		this.dropZone = newDropZone;
		this.file = newFile;
	},
	updateLoading: function(pres){
		if(!Ext.isEmpty(this.progressBar))
		{
			this.progressBar.setUploadProgress(pres);
		}
	},
	changeContent: function (r_object_id){
		this.progressBar = Ext.create('ExtDoc.views.extprogressbar.ExtDocProgressBar');
		this.progressBar.setFileName(this.file.name);
		this.dropZone.add(this.progressBar);
		this.updateLoading(0.2);
		this.uploadChangeContent(r_object_id);
	},
	upload: function(){
		this.progressBar = Ext.create('ExtDoc.views.extprogressbar.ExtDocProgressBar');
		this.progressBar.setFileName(this.file.name);
		this.dropZone.add(this.progressBar);
		this.setAuthor();
	},
	insertProperits: function(){
		if(!Ext.isEmpty(this.file) && this.checkFile())
		{
			var currentUploader = this;
			var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/insert";
			this.updateLoading(0.2);
			ExtDoc.utils.ExtDocAjax.setMaskObject(null);
			Ext.Ajax.request({
				url: completeUrl,
				method: 'POST',
				headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
				success: function(response, opts){ 
					currentUploader.uploadContent(response.responseText);
				},
				failure: function(response, opts){ 
					currentUploader.finalizeUpload(response.status);
				},
				jsonData: currentUploader.buildNewObjectJson()
			});
		}
	},
	uploadContent: function(newObjectId){
		this.updateLoading(0.5);
		var currentUploader = this;
		
		var dateRaw = this.file.lastModifiedDate;
		var fileDate = dateRaw.getTime();
		
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/replace/" + newObjectId + "/" + fileDate;
		
		var formData = new FormData();
		var xhr = new XMLHttpRequest();
		
		formData.append('file', this.file);

		xhr.open('POST', completeUrl);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.onloadend = function (evt){
			if (evt.target.status === 200)
			{
				currentUploader.finalizeUpload(200);
			}
			else
			{
				currentUploader.finalizeUpload(evt.target.status);
			}
		};

		this.updateLoading(0.7);
		xhr.send(formData);
	},
	uploadChangeContent: function(newObjectId){
		this.updateLoading(0.5);
		var currentUploader = this;
		
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/changecontent/" + newObjectId;
		
		var formData = new FormData();
		var xhr = new XMLHttpRequest();
		
		formData.append('file', this.file);
		
		xhr.open('POST', completeUrl);
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.onloadend = function (evt){
			if (evt.target.status === 200)
			{
				currentUploader.updateLoading(0.7);
				currentUploader.finalizeUpload(200);
				var changeContentTitle = ExtDoc.locales.ExtDocLocaleManager.getText('change_content');
				var contentChanged = ExtDoc.locales.ExtDocLocaleManager.getText('content_changed');
				var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
				var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
				Ext.toast({
					autoCloseDelay: toastTimeout,
    				html: contentChanged,
   					title: changeContentTitle,
     				rtl: toastRtl
 				});
				///handle change content on search results
				///replace r_object_id, r_modify_date and r_version_label (because inserting new minor version)
				if (evt.srcElement &&
					evt.srcElement.responseText)
				{
					var jsonObject = Ext.JSON.decode(evt.srcElement.responseText);
					if (jsonObject)
					{
						var jsonObjectProperties = jsonObject.properties;
						var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
						if (mainGrid &&	mainGrid.getSelection().length == 1)
						{
							var record = mainGrid.getSelection()[0];
							if (record && record.get('priority') == 2 /*&& record.data.action == 'search'*/)
							{
								record.data.r_object_id = jsonObjectProperties.r_object_id;
								record.data.r_modify_date = jsonObjectProperties.r_modify_date;
								record.data.r_version_label = jsonObjectProperties.r_version_label;	
								record.data.a_content_type = jsonObjectProperties.a_content_type;
								record.data.doc_date = jsonObjectProperties.doc_date;
								mainGrid.getView().refreshNode(record);
							}
						}
					}
				}
			}
			else
			{
				currentUploader.finalizeUpload(evt.target.status);
				ExtDoc.utils.ExtDocUtils.showAlert('error','upload_change_content_operation_error');
			}
		};		
		xhr.send(formData);			
	},
	checkFile: function(){
		return true;
	},
	buildNewObjectJson: function(){
		var object = {};
		var objectProperties = {};
		
		var objectName = this.file.name;
		if (objectName.indexOf('.')!=-1)
		{
			objectName = this.file.name.substring(0, this.file.name.lastIndexOf('.'));
		}
		objectProperties['r_object_type'] = ExtDoc.config.ExtDocConfig.autoUploadType;
		objectProperties['object_name'] = objectName;
		objectProperties['i_folder_id'] = this.dropZone.getCurrentFolder().data['r_object_id'];
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		objectProperties['classification'] = currentFolderRecord.get('classification');
		objectProperties['sensitivity'] = 1;
		objectProperties['sender_name'] = this.getUserName();
		objectProperties['item_type'] = 1;
		
		object['properties'] = objectProperties;

		return Ext.JSON.encode(object);
	},
	finalizeUpload: function(status){
		if(status == 200 || status == 201)
		{
			this.progressBar.destroy();
		}
		else
		{
			this.progressBar.setUploadFailed();	
		}
		
		this.getDropZone().reportFileUploadFinalize();
	},
	setAuthor: function(){
		var currentField = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'uis/author';
		var upload = this;
		Ext.Ajax.request({
			url: completeUrl,
			method: 'GET',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
			success: function(response, opts){ 
				currentField.initObjectAuthor(response.responseText);
				currentField.insertProperits();
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
			}
		});
		return currentField;
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
		this.setUserName(value);
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
				arrayElement["sender_name"] =  result[index].properties.sender_name;
				objectAuthors[notEmptyIndex] = arrayElement;
				notEmptyIndex++;
			}
		}
		
		this.setObjectAuthors(objectAuthors);
	},
	setUserName: function(newUserName){
		this.userAddress = newUserName;
	},
	getUserName: function(){
		return this.userAddress;
	}
});