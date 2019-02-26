Ext.define('ExtDoc.utils.ExtDocLimitedAccess',{
	singleton: true,
	limitedAccessObjectId: null,
	getObjectIdAndLoadLocation: function(id, callback){
		if(!this.isGovId(id))
		{
			console.log("invalid limited access govId: " + id);
			viewP.destroy();
			return;
		}
		
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		mainView.mask();
		completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'os/getObjectIdByTypeAndGovId/';
		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.responseType = 'text';
		
		var limitedAccessController = this;
		xhr.onreadystatechange = function(e){
			if (this.readyState == 4 && this.status == 200)
			{
				var objectId = xhr.response;
				
				if (!objectId || objectId.indexOf("0b") != 0)
				{
					console.log("invalid limited access objectId: " + objectId);
					viewP.destroy();
					return;
				}
				
				limitedAccessController.limitedAccessObjectId = objectId;
				mainView.unmask();
				return callback(objectId, 'gov_folder');
			}
			else if (this.readyState == 4 && this.status == 400)
			{
				mainView.unmask();
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
			}
		}
		
		var json = this.buildJson(id);
		xhr.send(json);
	},
	isGovId: function(objectId){
		return objectId && objectId.length > 16;
	},
	checkLimitedAccess: function(){
		return this.limitedAccessObjectId && ExtDoc.config.ExtDocConfig.allowLimitedAccess;
	},
	buildJson: function(id){
		var preJson = {
			"properties": {
				"objectType": "gov_folder",
				"govId": id
			}
		};
		
		var json = Ext.JSON.encode(preJson);
		return json;
	}
});