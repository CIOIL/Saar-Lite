Ext.define('ExtDoc.tools.controllers.ExtDocLinkController', {
	requires: [ 'ExtDoc.views.extlinkwindow.ExtDocLinkWindow' ],
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.linkController',
	selectedObject: null,
	selectedObjectId: null,
	objectLocations: null,
	folderId: null,
	linkAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		
		var limitedAccess = ExtDoc.utils.ExtDocLimitedAccess.checkLimitedAccess();
		if (limitedAccess)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','action_not_allowed_error');
			return;
		}
		
		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();
		if (selectedObjects.length != 1)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'select_only_one_object');
		} else
		{
			this.selectedObject = selectedObjects.getAt(0);
			if (this.hasPermissions(this.selectedObject))
			{
				this.getFolderPath();
			}
		}
	},
	getFolderPath: function() {		
		this.setFolderId(this.selectedObject.get('i_folder_id'));
		this.setSelectedObjectId(this.selectedObject.get('r_object_id'));
		var currentObject = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/getFoldersLocation";
		Ext.Ajax.request({
			url: completeUrl,
			method: 'POST',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts) {
				currentObject.initObjectLocations(response.responseText);
				currentObject.createLinkWindow();
			},
			failure: function(response, opts) {
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'servererror');
			},
			jsonData: currentObject.buildNewObjectJson()
		});
	},
	setFolderId: function(newFolderId) {
		this.folderId = newFolderId;
	},
	getFolderId: function() {
		return this.folderId;
	},
	setSelectedObjectId: function(newObjectId) {
		this.selectedObjectId = newObjectId;
	},
	getSelectedObjectId: function() {
		return this.selectedObjectId;
	},
	hasPermissions: function(selectedObject) {
		var result = false;

		if (selectedObject.get('user_permit') < 6)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'edit_permission_single_error');
		} else
		{
			result = true;
		}

		return result;
	},
	initObjectLocations: function(newObjectLocations) {
		var result = Ext.util.JSON.decode(newObjectLocations);
		var notEmptyIndex = 0;
		var objectLocations = new Array();

		for (var index = 0; index < result.length; index++)
		{
			if (result[index].properties.r_folder_path != null)
			{
				var arrayElement = {};
				arrayElement["r_folder_path"] = result[index].properties.r_folder_path;
				arrayElement["r_object_id"] = result[index].properties.r_object_id; //i_folder_id of the folder_path
				objectLocations[notEmptyIndex] = arrayElement;
				notEmptyIndex++;
			}
		}

		this.setObjectLocations(objectLocations);
	},
	getObjectLocations: function() {
		return this.objectLocations;
	},
	setObjectLocations: function(newLocations) {
		this.objectLocations = newLocations;
	},
	buildNewObjectJson: function() {
		var object = {};
		var objectProperties = {};
		objectProperties['folderIds'] = this.getFolderId();
		object['properties'] = objectProperties;
		return Ext.JSON.encode(object);
	},
	createLinkWindow: function() {
		var linkWindow = Ext.create('ExtDoc.views.extlinkwindow.ExtDocLinkWindow');
		linkWindow.setObjectFather(this);
		linkWindow.initLocationWindow();
	},
	getSelectedObject: function() {
		return this.selectedObject;
	}
});