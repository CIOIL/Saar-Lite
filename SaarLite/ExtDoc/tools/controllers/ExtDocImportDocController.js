Ext.define('ExtDoc.tools.controllers.ExtDocImportDocController', {
	requires: [ 'ExtDoc.views.extimportdocumentwindow.ExtDocImportDocumentWindow' ],
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.ImportDocController',
	ImportDocAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		var currentFolderRecord = this.getView().getToolParent().getCurrentLocation();
		if (this.hasPermission(currentFolderRecord))
		{
			var currnetCon = this;
			var xhr = new XMLHttpRequest();
			var formData = new FormData();
			formData.append('folderLocation', currentFolderRecord.get('r_object_id'));
			formData.append('objectType', 'document');
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
					
					var window = Ext.create('ExtDoc.views.exttypechooserwindow.ExtDocTypeChooserWindow');
					window.setWindowType('ExtDoc.views.extimportdocumentwindow.ExtDocImportDocumentWindow');
					window.initRecords();
					window.setActionName('import');
					window.initWindow("config/typechooserwindowform/typechooserwindowform_document.json" , 'initdefaultValues');
					window.setObjectTypes(properties);
					window.setObjectFather(currnetCon.getView().getToolParent());
				}
				else
				{
					ExtDoc.utils.ExtDocUtils.showAlert("error", "servercommerror");
				}
			};
			xhr.send(formData);	
		} else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'write_folder_permissions_error');
		}
	},
	hasPermission: function(currentFolderRecord) {
		return (currentFolderRecord.get('user_permit') >= 6 && currentFolderRecord.get('r_object_type') != 'dm_cabinet' && currentFolderRecord.get('r_object_type') != 'gov_unit_folder');
	}
});