Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocFavoriteDocsMenuItemController', {
	extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.favoriteDocsController',
	showFavoriteDocs: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/favoritedocs/";
		var searchStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');
		mainGrid.getView().emptyText = '';
		mainGrid.getView().refresh();
		searchStore.initStore(completeUrl);
		searchStore.setStoreMethod('GET');
   	  
		var oldUnitLayerName = mainGrid.getUnitLayerName();
		mainGrid.setUnitLayerName(ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId());
  	    mainGrid.initColumns();
  	  
		mainGrid.setStore(searchStore);
		mainGrid.getStore().load({
		    scope: this,
		    callback: function(records, operation, success) {
		    	if (!records || records.length === 0){
		    		 mainGrid.getView().emptyText = ExtDoc.locales.ExtDocLocaleManager.getText('no_data_grid');
		    		 mainGrid.getView().refresh();
		    	  }
		    	  ExtDoc.utils.ExtDocLocationColumnUtils.setActionOnRecord();
		    	  ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
		    	}
			}
		);

		var currentLocation = mainGrid.getCurrentLocation();
		
		mainGrid.gridBreadcrumb.breadcrumbPath = mainGrid.gridBreadcrumb.breadcrumbPath.splice(0, 1);
		var favoriteDocsRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		favoriteDocsRecord.set('r_object_id',ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId());
		favoriteDocsRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText("favorite_documents"));
		mainGrid.gridBreadcrumb.breadcrumbPath.push(favoriteDocsRecord);
		
		var returnRecordId = ExtDoc.utils.ExtDocUtils.getReturnRecordId(currentLocation.get('r_object_id'));
		var returnRecordName = ExtDoc.utils.ExtDocUtils.getReturnRecordName(currentLocation);
		var returnRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		returnRecord.set('r_object_id', returnRecordId);
		returnRecord.set('object_name', returnRecordName);
		returnRecord.set('r_object_type', 'favoritedocs');
		returnRecord.set('unit_layer_name', oldUnitLayerName);
		
		if (returnRecordId != ExtDoc.utils.ExtDocUtils.getHomeFolderId())
		{
			returnRecord.set('action_caller','favorites');
		}
		
		returnRecord.set('no_tooltip',true);
		mainGrid.gridBreadcrumb.breadcrumbPath.push(returnRecord);
		
		mainGrid.gridBreadcrumb.reloadBreadcrumn();
		mainGrid.fireEvent('updateToolBars',-1,null,false);
	}
});