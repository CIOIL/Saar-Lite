Ext.define('ExtDoc.tools.controllers.ExtDocNewFolderController', {
	requires: [ 'ExtDoc.views.extnewfolderwindow.ExtDocNewFolderWindow' ],
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.newFolderController',
	newDocAction: function()
	{
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		
		var currentFolderRecord = this.getView().getToolParent().getCurrentLocation();
		var currnetCon = this;
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		formData.append('folderLocation', currentFolderRecord.get('r_object_id'));
		formData.append('objectType', 'folder');
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/createobjecttypes";
		xhr.open('POST', completeUrl);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.onloadend = function (evt){
			if (evt.target.status === 200)
			{
				var types = JSON.parse(xhr.response);
				var properties = types['properties'];
				if (Object.keys(properties).length == 0)
				{
					ExtDoc.utils.ExtDocUtils.showAlert("error", "create_folder_permission_error");
				}
				else
				{
					var window = Ext.create('ExtDoc.views.exttypechooserwindow.ExtDocTypeChooserWindow');
					window.setWindowType('ExtDoc.views.extnewfolderwindow.ExtDocNewFolderWindow');
					window.setActionName('new');
					window.initRecords();
					window.initWindow("config/typechooserwindowform/typechooserwindowform_folder.json", 'initdefaultValues');
					window.setObjectTypes(properties);
				}
			}
			else
			{
				ExtDoc.utils.ExtDocUtils.showAlert("error", "servercommerror");
			}
		};
		xhr.send(formData);   
	}
});