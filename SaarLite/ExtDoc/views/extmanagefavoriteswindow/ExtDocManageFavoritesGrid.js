Ext.define('ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesGrid', {
	requires: [	'ExtDoc.views.extgrid.ExtDocGrid',
				'ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesGridController'],
	extend: 'Ext.grid.Panel',
	controller: 'mfGridController',
	columnsStore:null,
	manageFavoritesWindow: null,
	initComponent: function(){
		var noDataMessage = ExtDoc.locales.ExtDocLocaleManager.getText('no_data_grid');
		this.viewConfig = { 
			emptyText: noDataMessage,
			plugins: {
				ptype: 'gridviewdragdrop',
				dragText: '*'
			}
		};
		this.selModel = 'checkboxmodel';
		this.callParent(arguments);
	},
	initStore: function(){
		this.setStore(ExtDoc.utils.ExtDocUtils.cloneStore(ExtDoc.utils.ExtDocComponentManager.getComponent('favoritesToolbar').getToolbarStore()));
	},
	initGrid: function(configUrl, manageFavoritesWindow){
		var currentGrid = this;
		this.getView().loadingText = ExtDoc.locales.ExtDocLocaleManager.getText('loading');
		this.rtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		this.setManageFavoritesWindow(manageFavoritesWindow);
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
		this.initStore();
		this.initColumn();
		this.initToolBars();
	},
	initColumn: function(){
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
	setManageFavoritesWindow: function(newManageFavoritesWindow){
		this.manageFavoritesWindow = newManageFavoritesWindow;
	},
	getManageFavoritesWindow: function(){
		return this.manageFavoritesWindow;
	},
	initToolBars: function()
	{
		for(var index = 0 ; index < this.columnsStore.getAt(0).toolbars().count() ; index++)
		{
			var toolbar = Ext.create('ExtDoc.views.exttoolbar.ExtDocToolbar');
			var toolbarConfig = this.columnsStore.getAt(0).toolbars().getAt(index);
	
			toolbar.initToolbar(toolbarConfig,this);
			this.addDocked(toolbar);
		}
	}
});