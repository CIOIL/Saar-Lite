Ext.define('ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.mfWindowController',
	saveWindowAction: function(){
		this.submitChanges();
	},
	submitChanges: function(){	
		this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'),'loading');
		var currentController = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/updateFavorites/";			
		Ext.Ajax.request({
			url: completeUrl,
			method: 'POST',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts){ 
				currentController.updateFavoritesToolBar();
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
				currentController.getView().unmask();
			},
			jsonData: currentController.buildFavoritesJson()
		});
	},
	updateFavoritesToolBar: function(){
		var editedStore = this.getView().getMfGrid().getStore();
		var favoritesToolbar = ExtDoc.utils.ExtDocComponentManager.getComponent('favoritesToolbar');
		
		favoritesToolbar.setToolbarStore(editedStore);
		favoritesToolbar.buildToolbar();
		this.closeView();
	},
	buildUpdateProperty: function(){
		var updatePropertyArray = new Array();
		var originalStore = ExtDoc.utils.ExtDocComponentManager.getComponent('favoritesToolbar').getToolbarStore();
		var editedStore = this.getView().getMfGrid().getStore();
		
		for(var index = 0 ; index < editedStore.getCount() ; index++)
		{
			if(editedStore.getAt(index).get('r_object_id') != originalStore.getAt(index).get('r_object_id'))
			{
				var updateObject = {
					"r_object_id": editedStore.getAt(index).get('r_object_id'),
					"order_no": originalStore.getAt(index).get('order_no')
				};
				
				updatePropertyArray[updatePropertyArray.length] = updateObject;
				editedStore.getAt(index).set('order_no',originalStore.getAt(index).get('order_no'));
			}
		}
		
		return updatePropertyArray;
	},
	buildDeleteProperty: function(){
		var removedProperty = new Array();
		var removedSelection = this.getView().getMfGrid().getStore().getRemovedRecords();
		
		for(var index = 0 ; index < removedSelection.length ; index++)
		{
			removedProperty[index] = removedSelection[index].get('r_object_id');
		}
		
		return removedProperty;
	},
	buildFavoritesJson: function(){
		updateObjects = this.buildUpdateProperty();
		deleteObjects = this.buildDeleteProperty();
		
		var object = {
			"properties": {
				"updateObjects": updateObjects,
				"deleteObjects": deleteObjects
			}
		};

		return Ext.JSON.encode(object);
	}
});