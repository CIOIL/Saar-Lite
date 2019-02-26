Ext.define('ExtDoc.tools.controllers.ExtDocDownloadController', {
    extend : 'Ext.app.ViewController',
	alias: 'controller.downloadController',
	url: null,
	objectsToDownload: null,
	setUrl: function(newUrl){
		this.url = newUrl;		
	},
	getUrl: function(){
		return this.url;
	},
	getObjectsToDownload: function(){
		return this.objectsToDownload;
	},
	initUrl: function(){
		this.setUrl(ExtDoc.config.ExtDocConfig.restUrl + "content/download/");
	},
	init: function(){
		this.initUrl();
		this.callParent();
	},
	downloadAction: function(){
		this.getView().setDisabled(true);
		this.getView().mask('','loading');
		this.objectsToDownload = new Array();
		var selectedObjects = this.getView().getToolParent().getSelection();
		
		for(var i = 0 ; i < selectedObjects.length ; i++)
		{
			var selectedObject = selectedObjects[i];
			
			if(!Ext.isEmpty(selectedObject.get('a_content_type')))
			{
				this.getObjectsToDownload()[this.getObjectsToDownload().length] = selectedObject;
			}
		}
		this.downloadNextObject();
	},
	downloadNextObject: function()
	{
		if(this.getObjectsToDownload().length > 0)
		{
			this.downloadObject(this.getObjectsToDownload()[this.getObjectsToDownload().length - 1]);
			this.getObjectsToDownload().splice(-1,1);
		}
		else
		{
			this.getView().setDisabled(false);
			this.getView().unmask();
		}
	},
	downloadObject:function(objectToDownload){
		var currentTool = this;
		var completeUrl = this.getUrl() + objectToDownload.get('r_object_id');
		
		var xhr = new XMLHttpRequest();
		xhr.open('GET', completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.responseType = 'blob';

		xhr.onreadystatechange = function(e) {
  			if(this.readyState == 4 && this.status == 200)
  			{
  				var filename = ExtDoc.utils.ExtDocUtils.unicodeToText(xhr.getResponseHeader("Content-Disposition"));
  				saveAs(xhr.response,filename);

  				currentTool.downloadNextObject();
  			}
  			else if(this.readyState == 4 && this.status != 200)
  			{
  				currentTool.downloadNextObject();
  			}
		};

		xhr.send();
	}
});