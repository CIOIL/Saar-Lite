Ext.define('ExtDoc.views.extlinkwindow.ExtDocLinkWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowLinkController',
	newFolderIds: null,
	saveWindowAction: function(){
		this.submitDocLinks();
	},
	submitDocLinks: function(){
		var currentController = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/update";
		ExtDoc.utils.ExtDocAjax.setMaskObject(this.getView()); 
		Ext.Ajax.request({
			url: completeUrl,
			method: 'POST',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts){
				//update the selected object record so that the new locations are updated without need to refres the main grid
				var selectedObjectRecord = currentController.getView().getObjectFather().getSelectedObject(); 
				selectedObjectRecord.set('i_folder_id', currentController.newFolderIds);
				
				var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
				var needToRemove = true;
				
				for (var index = 0; index < currentController.newFolderIds.length; index++)
				{
					if (currentController.newFolderIds[index] == mainGrid.getCurrentLocation().get('r_object_id'))
					{
						needToRemove = false;
						break;
					}
				}
				
				if (needToRemove)
				{
					var currentLocation = mainGrid.getCurrentLocation().get('r_object_id');
					
					if (currentLocation != ExtDoc.utils.ExtDocUtils.getRecentDocsFolderId() && currentLocation != ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId() && currentLocation != ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId())
					{
						mainGrid.getStore().remove(selectedObjectRecord);
					}
				}

				currentController.getView().destroy();
			},
			failure: function(response, opts){
				currentController.getView().unmask();
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
			},
			jsonData: currentController.buildNewLinksJson()
		});
		this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'),'loading');
	},
	buildNewLinksJson: function(){
		//get new locations from toolbar and set their object ids as json parameter
		var newLocations = this.getView().getMainGrid().getCurrentLocations();
		var objectFolderIds = new Array();

		for (var index = 0; index < newLocations.length; index++)
		{
			objectFolderIds[index] = newLocations[index]["r_object_id"];
		}
		this.newFolderIds = objectFolderIds;
		var object = {
			"properties": {
				"r_object_id": this.getView().getObjectFather().getSelectedObjectId(),
				"i_folder_id": objectFolderIds,
				"r_object_type":  this.getView().getObjectFather().getSelectedObject().get('r_object_type')
			}
		};

		return Ext.JSON.encode(object);
	}
});