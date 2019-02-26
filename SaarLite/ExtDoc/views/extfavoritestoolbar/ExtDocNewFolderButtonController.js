Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocNewFolderButtonController', {
	requires: ['ExtDoc.views.extnewfolderwindow.ExtDocNewFolderWindow'],
	extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.newFolderButtonController',
	newDocAction: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
//		var currentFolderRecord = this.getView().getToolParent().getCurrentLocation();
		if (this.hasPermission(currentFolderRecord))
		{
			var window = Ext.create('ExtDoc.views.extnewfolderwindow.ExtDocNewFolderWindow');
			window.setWindowRecord(this.getNewFolderRecord(currentFolderRecord));
			window.initWindow("config/newfolderform/new_folder_form.json");
//			window.setObjectFather(currentFolderRecord.getToolParent());
		}
		else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','write_folder_permissions_error');
			
		}
	},
	getNewFolderRecord: function(currentFolderRecord){
		var docRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		
		docRecord.set('unit_id',currentFolderRecord.get('unit_id'));
		docRecord.set('r_object_type',ExtDoc.config.ExtDocConfig.folderType);
		docRecord.set('r_object_id',currentFolderRecord.get('r_object_id'));
		docRecord.set('i_folder_id',currentFolderRecord.get('r_object_id'));
		docRecord.set('classification',currentFolderRecord.get('classification'));
		docRecord.set('sensitivity',currentFolderRecord.get('sensitivity'));
		docRecord.set('status_date', new Date());
		
		return docRecord;
	},
	hasPermission: function(currentFolderRecord){
		return (currentFolderRecord.get('user_permit') >= 6  && currentFolderRecord.get('r_object_type') != 'dm_cabinet');
	}
});