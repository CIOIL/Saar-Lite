Ext.define('ExtDoc.tools.controllers.ExtDocClipboardController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.clipboardController',
	addToClipboard: function(){
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var currentLocationObjectId = mainView.getMainGrid().getCurrentLocation().get('r_object_id');
		var selectedRecords = mainView.getMainGrid().getSelection();
		var clipboardStore = mainView.getMainGrid().getClipboardStore();
		selectedRecords.forEach(function(record){
			var id = record.get('r_object_id');
			var duplicate;
			
			for (var i = 0; i < clipboardStore.count(); i++)
			{
				if (clipboardStore.getAt(i).get('r_object_id') == id)
				{
					duplicate = id;
				}
			}
			
			if(!duplicate)
			{
				record.set('added_to_clipboard_from_r_object_id', currentLocationObjectId);
				clipboardStore.add(record);
			}
		});
		
		var addToClipboardTitle = ExtDoc.locales.ExtDocLocaleManager.getText('clipboard');
		var addToClipboardWarning = ExtDoc.locales.ExtDocLocaleManager.getText(selectedRecords.length > 1 ? 'items_added_to_clipboard_warning' : 'item_added_to_clipboard_warning');
		var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
		Ext.toast({
			autoCloseDelay: toastTimeout,
			html: addToClipboardWarning,
			title: addToClipboardTitle,
			rtl: toastRtl
		});
	},
	showClipboard: function(){
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		
		var oldUnitLayerName = mainGrid.getUnitLayerName(); 
		mainGrid.setUnitLayerName(mainGrid.getDefaultUnitlayer());
  	    mainGrid.initColumns();
  	    
		var currentLocation = mainGrid.getCurrentLocation();
		var clipboardStore = mainGrid.getClipboardStore();
		mainGrid.getSelectionModel().clearSelections();
		mainGrid.setStore(clipboardStore);
		mainGrid.setCurrentStore('clipboardStore');
		
		mainGrid.gridBreadcrumb.breadcrumbPath = mainGrid.gridBreadcrumb.breadcrumbPath.splice(0, 1);
		
		var clipboardRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		clipboardRecord.set('r_object_id', ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId());
		clipboardRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText('clipboard'));
		clipboardRecord.set('no_tooltip',true);
		mainGrid.gridBreadcrumb.breadcrumbPath.push(clipboardRecord);
		
		var returnRecordId = ExtDoc.utils.ExtDocUtils.getReturnRecordId(currentLocation.get('r_object_id'));
		var returnRecordName = ExtDoc.utils.ExtDocUtils.getReturnRecordName(currentLocation);
		var returnRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		returnRecord.set('r_object_id', returnRecordId);
		returnRecord.set('object_name', returnRecordName);
		returnRecord.set('r_object_type', 'clipboard');
		returnRecord.set('unit_layer_name', oldUnitLayerName);
		if (returnRecordId != ExtDoc.utils.ExtDocUtils.getHomeFolderId())
		{
			returnRecord.set('action_caller','clipboard');
		}
		returnRecord.set('no_tooltip',true);
		mainGrid.gridBreadcrumb.breadcrumbPath.push(returnRecord);
		mainGrid.gridBreadcrumb.reloadBreadcrumn();
		mainGrid.fireEvent('updateToolBars',-1,null,false);
		ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
	},
	removeFromClipboard: function(){
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var selectedRecords = mainView.getMainGrid().getSelection();
		var store = mainView.getMainGrid().getClipboardStore();
		store.remove(selectedRecords);
	}
});