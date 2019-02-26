Ext.define('ExtDoc.views.extcolumnselectorwindow.ExtDocColumnsSelectorWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
    alias: 'controller.columnsSelectorController',
    defaultStore : null,
    isMaskVisible: false,
    oldSelectedStore: null,
    saveColumnSelected:function(){
    	this.restoreDefaultDragOver();
    	var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		var currentController = this;
		
		var grid = this.getView().getColumnSelectedGrid();
		var newColumnsSelection = grid.getStore().getRange();
		
		if(newColumnsSelection.length  == 0)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','columns_selected_error','rtl');
		}
		else
		{
			var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
			var unitLayerName = mainGrid.getUnitLayerName();
			
			this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('save_columns_loading'))
			
			var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/saveColumnsSelectedToUser";
	
			ExtDoc.utils.ExtDocAjax.setMaskObject(null);
			Ext.Ajax.request({
				url: completeUrl,
				method: 'POST',
				headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
	
				success: function(response, opts) {
					currentController.closeView();
					
					var saveColumnSelectorTitle = ExtDoc.locales.ExtDocLocaleManager.getText('saveColumnSelectorTitle');
					var saveColumnsPerUnit = ExtDoc.locales.ExtDocLocaleManager.getText('saveColumnsPerUnit');
					var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
					var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
					Ext.toast({
							autoCloseDelay: toastTimeout,
		    				html: saveColumnsPerUnit,
		   					title: saveColumnSelectorTitle,
		     				rtl: toastRtl
		 				});
					
					ExtDoc.utils.ExtDocCache.clear(unitLayerName);
					
					var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
					mainGrid.initColumns();
				},
				failure: function(response, opts) {
					currentController.getView().unmask();
					currentController.handleFailure(response);
				},
					jsonData: currentController.buildColumnsObjectJson(unitLayerName, newColumnsSelection)
			});
		}
	},
	buildColumnsObjectJson: function(unitLayerName, newColumnsSelection){
		var grid = this.getView().getColumnSelectedGrid();
		
		if(newColumnsSelection != undefined)
		{
			var numColumnSelected = grid.getStore().getData().length;
			var columnsToSave = new Array();
	
			for (var index = 0; index < numColumnSelected ; index++)
			{
				var row = newColumnsSelection[index];
				columnsToSave[index] = row.data.columns_name;
			}
			
			var object = {
				"properties": {
					"columns_name": columnsToSave,
					"unit_layer_name": unitLayerName
				}
			};
	
			return Ext.JSON.encode(object);
		}
		else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','columns_selected_error','rtl');
		}
	},
	sortRowUp:function(){
		if(this.getView().getColumnSelectedGrid().getSelection().length >1)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','sort_only_one_column','rtl');
		}
		else
		{
			var selectedRow = this.getView().getColumnSelectedGrid().getSelection()[0];
			var rowIndex = this.getView().getColumnSelectedGrid().getStore().indexOf(selectedRow);
			if(rowIndex != 0)
			{
				this.getView().getColumnSelectedGrid().getStore().remove(selectedRow, true);
				this.getView().getColumnSelectedGrid().getStore().insert(rowIndex-1, selectedRow);
			}
		}
	},
	sortRowDown:function(){
		if(this.getView().getColumnSelectedGrid().getSelection().length >1)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','sort_only_one_column','rtl');
		}
		else
		{
			var selectedRow = this.getView().getColumnSelectedGrid().getSelection()[0];
			var rowIndex = this.getView().getColumnSelectedGrid().getStore().indexOf(selectedRow);
			this.getView().getColumnSelectedGrid().getStore().remove(selectedRow, true);
			this.getView().getColumnSelectedGrid().getStore().insert(rowIndex+1, selectedRow);
		}
	},
	removeColumnSelected: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		var selectedRow = 	this.getView().getColumnSelectedGrid().getSelection();
		for (var index = 0; index < selectedRow.length; index++)
		{
			var selectedObject = selectedRow[index];
		
			var newRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			newRecord.set('columns_name', selectedObject.get('columns_name')); 
			newRecord.set('columns_desc', selectedObject.get('columns_desc')); 
			newRecord.dirty = false;
			this.getView().getColumnSelectedGrid().getStore().remove(selectedRow);
			
			var numColumnSelected = this.getView().getColumnsAvilableGrid().getStore().getData().length;
			this.getView().getColumnsAvilableGrid().getStore().insert(numColumnSelected+1,newRecord);
		}
	},
	addColumnSelected: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		var selectedRow = this.getView().getColumnsAvilableGrid().getSelection();
		for (var index = 0; index < selectedRow.length; index++)
		{
			var selectedObject = selectedRow[index];
		
			var newRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			
			newRecord.set('columns_name', selectedObject.get('columns_name')); 
			newRecord.set('columns_desc', selectedObject.get('columns_desc')); 
			newRecord.dirty = false;
			this.getView().getColumnsAvilableGrid().getStore().remove(selectedRow);
			
			var numColumnSelected = this.getView().getColumnSelectedGrid().getStore().getData().length;
			
			this.getView().getColumnSelectedGrid().getStore().insert(numColumnSelected,newRecord);
		}
	},
	returnToDefaultColumns: function(isMaskVisible)
	{
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		this.isMaskVisible = isMaskVisible;
		
		var grid = this.getView().getColumnSelectedGrid();
		
		this.oldSelectedStore = this.getView().getColumnSelectedGrid().getStore().getRange();
		grid.getStore().removeAll();
		
		var columnStore = Ext.create('ExtDoc.stores.extgrid.ExtDocGridStore');
		columnStore.initStore("config/maingrid/main_grid.json");
		this.setDefaultStore(columnStore);
		var currentGrid = this;
		columnStore.load({
			callback: function(records, operation, success){
				if(success){
					currentGrid.initDefaultColumns();
				}
			}
		});
	},
	initDefaultColumns: function()
	{
		var exColumns = ExtDoc.utils.ExtDocUtils.excludedColumns;	
		if(!exColumns)
			this.initExcludedColumns();
		else
			this.initDefaultGrid();
	},
	initDefaultGrid: function()
	{
		var grid = this.getView().getColumnSelectedGrid();
		
		var avilableGridCount = this.getView().getColumnsAvilableGrid().getStore().getData().length;
		var columnStore = this.getDefaultStore();
		var recordsToInsert = [];
		for(var index = 0 ; index < columnStore.getAt(0).columns().count() ; index++)
		{
			var columnConfig = columnStore.getAt(0).columns().getAt(index);
			if(ExtDoc.utils.ExtDocUtils.excludedColumns.indexOf(columnConfig.get('property'))< 0)	
			{
				var newRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
				newRecord.set('columns_name', columnConfig.get('property')); 
				
				if(columnConfig.get('property') == 'object_name')
				{
					newRecord.set('columns_desc', ExtDoc.locales.ExtDocLocaleManager.getText('name')); 
				}
				else
				{
					newRecord.set('columns_desc', ExtDoc.locales.ExtDocLocaleManager.getText(columnConfig.get('property'))); 
				}
				
				newRecord.dirty = false;
				recordsToInsert.push(newRecord);
			}
		}
		grid.getStore().insert(0,recordsToInsert);
		
		this.removeFromAvilableGrid(recordsToInsert);
		this.addToAvilableGrid(recordsToInsert);
		
		if(this.isMaskVisible)
		{
			grid.clearMask();
		}
	},
	removeFromAvilableGrid: function(recordsToRemove)
	{
		for(var index= 0 ;index<recordsToRemove.length;index++ )
		{
			var rowToDelete = this.getView().getColumnsAvilableGrid().getStore().findRecord('columns_name',recordsToRemove[index].data.columns_name,0,false, true, true);
			if(rowToDelete && rowToDelete!= -1)
			{
				this.getView().getColumnsAvilableGrid().getStore().remove(rowToDelete);
			}
		}
	},
	initExcludedColumns: function()
	{
		var currentCon = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/getExcludedColumns";
			
		ExtDoc.utils.ExtDocAjax.setMaskObject(null);
		Ext.Ajax.request({
			url: completeUrl,
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
			method: 'GET',
			success: function(response, opts) {
				currentCon.initExColumns(response.responseText);
			},
			failure: function(response, opts) {
			}
		});
	},
	initExColumns: function(newExColumns)
	{
		var result = Ext.util.JSON.decode(newExColumns);
		var exColumnsArray = [];
		for(var index = 0 ;index < result.length; index++)
		{
			exColumnsArray.push(result[index].properties.exColumn);
		}
		ExtDoc.utils.ExtDocUtils.excludedColumns = exColumnsArray;
		this.initDefaultGrid();
	},
	addToAvilableGrid: function(recordsToInsert)
	{
		if(this.oldSelectedStore!= undefined && this.oldSelectedStore.length > 0)
		{
			var avilableCount =  this.getView().getColumnsAvilableGrid().getData.length;
			for(var i = 0; i< this.oldSelectedStore.length ;i++)
			{
				var findInSelectedColumns = false;
				for(var index= 0 ;index< recordsToInsert.length;index++ )
				{
					if(this.oldSelectedStore[i].data.columns_name == recordsToInsert[index].data.columns_name)
					{
						findInSelectedColumns = true
					}
				}
				if(!findInSelectedColumns)
				{
					this.getView().getColumnsAvilableGrid().getStore().insert(avilableCount++, this.oldSelectedStore[i]);
				}
			}
		}
	},
	setDefaultStore: function(newStore){
		this.defaultStore = newStore;
	},
	getDefaultStore: function(){
		return this.defaultStore;
	}
});