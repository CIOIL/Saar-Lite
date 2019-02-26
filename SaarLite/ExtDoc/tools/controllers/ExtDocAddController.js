Ext.define('ExtDoc.tools.controllers.ExtDocAddController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.addController',
	addAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		var folderObjectId = this.getLinkFileFolderObjectId();
		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();
		var locationData = {};

		for (var index = 0; index < selectedObjects.length; index++)
		{
			var selectedObject = selectedObjects.getAt(index);
			locationData["r_folder_path"] = selectedObject.get('r_folder_path');
			locationData["r_object_id"] = selectedObject.get('r_object_id'); //i_folder_id of the folder_path
			if (!this.isFileLinked(folderObjectId, selectedObject.get('r_object_id')))
			{
				this.getView().getToolParent().addLocationField(locationData);
			} else
			{
				var folderName = new Array();
				folderName[0] = selectedObject.get('object_name');
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'link_exsits_error', folderName);
			}
		}
	},
	getLinkFileFolderObjectId: function() {
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectId = currentFolderRecord.data['r_object_id'];

		return objectId;
	},
	isFileLinked: function(folderObjectId, selectedObjectId) {
		return (folderObjectId == selectedObjectId);
	}
});