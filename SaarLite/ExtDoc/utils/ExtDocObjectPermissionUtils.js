Ext.define('ExtDoc.utils.ExtDocObjectPermissionUtils', {
	singleton: true,
	objectUserName: null,
	//Delete Has Delete Permission = 6 
	hasUserDeleteDocPermission: function(record){
	 	var hasDeletePermission = false;
		if(!Ext.isEmpty(record))
		{	   	
			if(record.get('user_permit') > 6)
			{
			 	hasDeletePermission = true;
			}
		}
		return hasDeletePermission;
	},
	//Edit has Browse Permission = 5 
	hasUserEditDocPermission: function(record){
		var hasEditPermission = false;
		if(!Ext.isEmpty(record))
		{
			if(ExtDoc.utils.ExtDocUtils.isRecordDocument(record) && record.get('user_permit') > 5)
			{
			 	hasEditPermission = true;
			}
			else if(ExtDoc.utils.ExtDocUtils.isFolder(record) && record.get('user_permit') > 5)
			{
			 	hasEditPermission = true;
			}
		}
		return hasEditPermission;
	},
	hasUserReadDocPermission: function(record){
		var hasEditPermission = false;
		if(!Ext.isEmpty(record))
		{
			if(ExtDoc.utils.ExtDocUtils.isRecordDocument(record) && record.get('user_permit') > 2)
			{
			 	hasEditPermission = true;
			}
			else if(ExtDoc.utils.ExtDocUtils.isFolder(record) && record.get('user_permit') > 2)
			{
			 	hasEditPermission = true;
			}
		}
		return hasEditPermission;
	},
	getUserNameService: function(){
		var currentField = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/userName";
		Ext.Ajax.request({
			url: completeUrl,
			method: 'GET',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
			success: function(response, opts){
				currentField.initObjectUserName(response.responseText);
			},
			failure: function(response, opts){
				//do nothing
			}
		});
	},
	initObjectUserName: function(newObjectUserName){
		var result = Ext.util.JSON.decode(newObjectUserName);
		this.objectUserName = result[0].properties.user_name;
		this.setUserOwnerName(this.objectUserName);
		},
	setUserOwnerName: function(objectUserName){
		var userLoginName = ExtDoc.utils.ExtDocLoginHandler.getUserName();
		var userName = Ext.util.Cookies.get(userLoginName);
		Ext.util.Cookies.set(userLoginName, objectUserName);
	},
	getSenderNameRegEx: function(){
		  var senderNameRegEx = /^[A-Za-z0-9\u0590-\u05FF\uFB1D-\uFB40\s_\'\\"\-,.;()@#]{1,127}$/i;
		  return senderNameRegEx;
	},
	validatePassport: function(str) {
		return (str.match(/^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/ig));
	},
	validateId: function(str) {
		var idNumber = String(str);
   		if ((idNumber.length > 9) || (idNumber.length < 5) || isNaN(idNumber)) {
	      return false;
   		}
   
	   	if (idNumber.length < 9)
		{
      		while(idNumber.length < 9)
      		{
         		idNumber = '0' + idNumber;         
      		}
   		}

  		var mone = 0, incNum;
   		for (var i=0; i < 9; i++)
   		{
      		incNum = Number(idNumber.charAt(i));
      		incNum *= (i%2)+1;
      		if (incNum > 9){
      			incNum -= 9;
      		}
      		mone += incNum;
   		}
   		return (mone%10 == 0);
	},
	validateIdOrPassport: function(str) {
		return (this.validateId(str) || this.validatePassport(str));
	}
}); 