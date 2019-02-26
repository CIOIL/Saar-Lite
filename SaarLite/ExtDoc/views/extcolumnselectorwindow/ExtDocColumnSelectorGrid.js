Ext.define('ExtDoc.views.extcolumnselectorwindow.ExtDocColumnSelectorGrid', {
	requires: ['ExtDoc.stores.extgrid.ExtDocGridStore'],
	extend: 'Ext.grid.Panel',
	flex: 2,
	countStore:0,
	unitLayerName: null,
	recordSelected : null,
	columnsStore: null,
	gridHomeService: null,
	gridName: null,
	columnSelectorWindow: null,
	viewConfig: {
		markDirty: false
	},
	initProperties: function(){
		this.setGridHomeService(this.columnsStore.getAt(0).get("home"));
		this.setGridName(this.columnsStore.getAt(0).get("name"));
	},
	initGrid: function(configUrl, columnSelectorWindow){
		var currentGrid = this;
		this.getView().loadingText = ExtDoc.locales.ExtDocLocaleManager.getText('loading');
		this.rtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		this.setColumnSelectorWindow(columnSelectorWindow);
		this.columnsStore = Ext.create('ExtDoc.stores.extgrid.ExtDocGridStore');
		this.columnsStore.initStore(configUrl);
		
		this.columnsStore.load({
			callback: function(records, operation, success){
				if(success){
					currentGrid.buildGrid();
				}
			}
		});
	},
	buildGrid: function()
	{
		this.initProperties();
		this.initStore();
		this.initColumn();
		this.initData();
	},
	initColumn: function()
	{
		var header = this.getHeaderContainer(); 
		for(var index = 0 ; index < this.columnsStore.getAt(0).columns().count() ; index++)
		{
			var columnConfig = this.columnsStore.getAt(0).columns().getAt(index);
			var newColumn;
			
			newColumn = Ext.create('ExtDoc.views.extgrid.columns.ExtDocGridColumn');
			newColumn.setColumnConfig(this.columnsStore.getAt(0).columns().getAt(index));
			newColumn.initColumn();
			newColumn.setFlex(1);
			header.add(newColumn);
		}
	},
	initStore: function()
	{
		var newStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');
		this.setStore(newStore);
	},
	initData: function()
	{
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		this.unitLayerName = mainGrid.getUnitLayerName();
		this.getStore().initStore(ExtDoc.config.ExtDocConfig.restUrl + this.getGridHomeService() + this.unitLayerName);
		
		var currentGrid = this;
		this.getStore().load({
			scope: this,
		    callback: function(records, operation){
		    	if(currentGrid.getStore().isLoaded())
		    	{
		    		var countRecords = records.length;
		    		for (var i = 0; i < countRecords; i++)
		    		{
		    			if(!Ext.isEmpty(ExtDoc.locales.ExtDocLocaleManager.getText(records[i].get('columns_name'))))
		    			{
		    				if(records[i].get('columns_name') == 'object_name')
		    				{
		    					records[i].set('columns_desc', ExtDoc.locales.ExtDocLocaleManager.getText('name'));
		    				}
		    				else
		    				{
		    					records[i].set('columns_desc', ExtDoc.locales.ExtDocLocaleManager.getText(records[i].get('columns_name')));
		    				}
		    			}
		    		}
		    		if(currentGrid.getGridName() == 'columns_avilable_grid')
		    		{
		    			currentGrid.getColumnSelectorWindow().initColumnSelectedGrid();
		    		}
		    		else
		    		{
		    			if(!records || records.length === 0){
			    			currentGrid.displayDefaultColumn();
		    			}
		    			else
		    			{
		    				currentGrid.clearMask();
		    			}
		    		}
		    	}
			}
		});
	},
	displayDefaultColumn: function(){
		this.getColumnSelectorWindow().getController().returnToDefaultColumns(true);
	},
	initBreadcrumb: function(){
		
	},
	clearMask: function()
	{
		this.getColumnSelectorWindow().doUnmaskView();
		this.getColumnSelectorWindow().getColumnsAvilableGrid().setHidden(false);
		this.getColumnSelectorWindow().getColumnSelectedGrid().setHidden(false);
		this.getColumnSelectorWindow().getPanelButtons().setHidden(false);
	},
	setGridHomeService: function(newGridHomeService){
		this.gridHomeService = newGridHomeService;
	},
	getGridHomeService: function(){
		return this.gridHomeService;
	},
	setGridName: function(newGridName){
		this.gridName = newGridName;
	},
	getGridName: function(){
		return this.gridName;
	},
	setColumnSelectorWindow: function(newColumnSelectorWindow){
		this.columnSelectorWindow = newColumnSelectorWindow;
	},
	getColumnSelectorWindow: function(){
		return this.columnSelectorWindow;
	}
});