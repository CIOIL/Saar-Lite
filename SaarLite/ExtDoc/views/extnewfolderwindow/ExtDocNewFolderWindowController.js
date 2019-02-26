Ext.define('ExtDoc.views.extnewfolderwindow.ExtDocNewFolderWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowNewFolderController',
	saveWindowAction: function(){
		this.submitWindowToServer(true);
	},
	submitSuccess: function(){
		this.getView().getObjectFather().fireEvent('reloadCurrent');
		this.callParent(arguments);
	},
	handleFailure: function(response){
		//Validation error
		if(response.status == 400 && response.responseText.indexOf('folder with path name') > 0)
		{	
		    var folderName = new Array();
				folderName[0] = this.getViewModel().getData().rec.get('object_name');
			ExtDoc.utils.ExtDocUtils.showAlert('error','duplicate_folder_error',folderName);		
		}
		else if(response.status == 400 && response.responseText == 'NOT_IN_CREATE_FOLDERS_ROLE')
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','not_in_create_folder_role');
		}
		else if (response.status == 400 && ExtDoc.utils.ExtDocUtils.isTextJson(response.responseText))
		{
			try
			{
				var error = JSON.parse(response.responseText);
				
				for (var property in error['properties'])
				{
					this.getFieldByName(property).markInvalid(ExtDoc.locales.ExtDocLocaleManager.getText(error['properties'][property]));
				}
			}
			catch (e)
			{
				
			}
		}
		else 
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
		}
//		 this.callParent(arguments);
	}
});