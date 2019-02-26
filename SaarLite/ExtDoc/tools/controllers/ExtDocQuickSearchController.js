Ext.define('ExtDoc.tools.controllers.ExtDocQuickSearchController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.quickSearchController',
	doQuickSearch: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		var searchValue = this.getView().getToolParent().findFieldByName('searchValue').getValue();

		if (Ext.isEmpty(searchValue))
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'serach_empty_error');
		}
		else
		{
			this.getMainGrid().getView().emptyText = ExtDoc.locales.ExtDocLocaleManager.getText('wait_system_searches');
  		    this.getMainGrid().getView().refresh();
			var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "ss/search/";
			var searchStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');
			this.getMainGrid().setCurrentStore('gridStore');
			searchStore.initStore(completeUrl);
			searchStore.setJsonToPost(this.getSearchProperties());
			searchStore.setStoreMethod('POST');

			var oldUnitLayerName = this.getMainGrid().getUnitLayerName();
			this.getMainGrid().setDefaultUnitlayer();
	    	this.getMainGrid().initColumns();
	    	  
			this.getMainGrid().setStore(searchStore);
			ExtDoc.utils.ExtDocSearchAbortionManager.setActiveSearchAjax(this.getMainGrid().getStore());
			this.getMainGrid().getStore().load({
			    scope: this,
			    callback: function(records, operation, success) {
			    	  if (!records || records.length === 0){
			    		  this.getMainGrid().getView().emptyText = ExtDoc.locales.ExtDocLocaleManager.getText('no_data_grid');
			    		  this.getMainGrid().getView().refresh();
			    	  }
			    	  ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
			    	}
				}
			);
            
			var currentLocation = this.getMainGrid().getCurrentLocation();
			
			this.getMainGrid().gridBreadcrumb.breadcrumbPath = this.getMainGrid().gridBreadcrumb.breadcrumbPath.splice(0, 1);
			var searchResultsRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			searchResultsRecord.set('r_object_id',ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId());
			searchResultsRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText("search_results"));
			this.getMainGrid().gridBreadcrumb.breadcrumbPath.push(searchResultsRecord);

			var returnRecordId = ExtDoc.utils.ExtDocUtils.getReturnRecordId(currentLocation.get('r_object_id'));
			var returnRecordName = ExtDoc.utils.ExtDocUtils.getReturnRecordName(currentLocation);
			var returnRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			returnRecord.set('r_object_id', returnRecordId);
			returnRecord.set('object_name', returnRecordName);
			returnRecord.set('unit_layer_name', oldUnitLayerName);
			
			if (returnRecordId != ExtDoc.utils.ExtDocUtils.getHomeFolderId())
			{
				returnRecord.set('action_caller','search');
			}
			
			returnRecord.set('no_tooltip',true);
			this.getMainGrid().gridBreadcrumb.breadcrumbPath.push(returnRecord);
			
			this.getMainGrid().gridBreadcrumb.reloadBreadcrumn();
			this.getMainGrid().fireEvent('updateToolBars',-1,null,false);
			this.getMainGrid().getStore().on('load', function(){ExtDoc.utils.ExtDocSearchAbortionManager.clearActiveSearchAjax();});
		}
	},
	getMainView: function() {
		return ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
	},
	getMainGrid: function() {
		return this.getMainView().getMainGrid();
	},
	getSearchProperties: function() {
		var objectType = this.getView().getToolParent().findFieldByName('objectType').getValue();
		var searchValue = this.getView().getToolParent().findFieldByName('searchValue').getValue();

		var objectProperties = {
			"object_type": objectType,
			"search_value": searchValue != null ? searchValue.replace('"','') : searchValue,
			"search_in_folder": ExtDoc.utils.ExtDocLimitedAccess.checkLimitedAccess() ? true : false,
			"folder_path": ExtDoc.utils.ExtDocLocation.getApplicationLocationPath()
		};
		
		return objectProperties;
	}
});