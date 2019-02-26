Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocLastDocsMenuItemController', {
	extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.lastDocsController',
	showLastDocs: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/lastDocs/";
		var searchStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');

		searchStore.initStore(completeUrl);
		searchStore.setStoreMethod('GET');
		
		var oldUnitLayerName = mainGrid.getUnitLayerName();
		
		mainGrid.setUnitLayerName(ExtDoc.utils.ExtDocUtils.getRecentDocsFolderId());
    	mainGrid.initColumns();
    	  
		mainGrid.setStore(searchStore);
		mainGrid.getStore().load({
		    scope: this,
		    callback: function(records, operation, success) {
		    	  
		    	  ExtDoc.utils.ExtDocLocationColumnUtils.setActionOnRecord();
		    
		    	  ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
		    	}
			}
		);

		var currentLocation = mainGrid.getCurrentLocation();
		
		mainGrid.gridBreadcrumb.breadcrumbPath = mainGrid.gridBreadcrumb.breadcrumbPath.splice(0, 1);
		var lastDocsRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		lastDocsRecord.set('r_object_id',ExtDoc.utils.ExtDocUtils.getRecentDocsFolderId());
		lastDocsRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText("recent_documents"));
		mainGrid.gridBreadcrumb.breadcrumbPath.push(lastDocsRecord);
		
		var returnRecordId = ExtDoc.utils.ExtDocUtils.getReturnRecordId(currentLocation.get('r_object_id'));
		var returnRecordName = ExtDoc.utils.ExtDocUtils.getReturnRecordName(currentLocation);
		var returnRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		returnRecord.set('r_object_id', returnRecordId);
		returnRecord.set('object_name', returnRecordName);
		returnRecord.set('r_object_type', 'lastdocs');
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