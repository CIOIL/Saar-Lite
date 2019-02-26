﻿﻿﻿Ext.define('ExtDoc.views.extgrid.ExtDocGrid', {
	requires: [	'ExtDoc.stores.extobject.ExtDocObjectBufferedStore',
				'ExtDoc.stores.extgrid.ExtDocGridStore',
				'ExtDoc.views.extgrid.ExtDocGridController',
				'ExtDoc.views.exttoolbar.ExtDocToolbar',
				'ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumb',
				'ExtDoc.views.extloginwindow.ExtDocLoginWindow',
				'ExtDoc.views.extgrid.columns.ExtDocGridLockColumn',
				'ExtDoc.views.extgrid.columns.ExtDocGridTypeColumn',
				'ExtDoc.views.extgrid.columns.ExtDocGridDateColumn',
				'ExtDoc.views.extgrid.columns.ExtDocGridLinksColumn',
				'ExtDoc.views.extgrid.columns.ExtDocGridLocationColumn',
				'ExtDoc.views.extgrid.columns.ExtDocGridCodeTableColumn',
				'ExtDoc.views.extgrid.columns.ExtDocGridVersionLabelColumn',
				'ExtDoc.views.extcontextmenu.ExtDocContextMenu',
				'ExtDoc.views.extpdfviewer.ExtDocPdfViewer',
				'ExtDoc.views.extadvsearchwindow.ExtDocAdvSearchWindow'],
	controller: 'gridController',
	extend: 'Ext.grid.Panel',
	region: 'center',
	columnLines: true,
	mainView: null,
	configStore: null,
	defaultColumnsStore: null,
	unitLayerName: null,
	gridQuery: null,
	gridColumns: null,
	gridOrderby: null,
	gridName: null,
	gridSelectionPriority: null,
	gridCurrentPriority: -1,
	selectedArray: null,
	gridMenus: null,
	gridToolbars: null,
	gridHomeService: null,
	gridBreadcrumb: null,
	gridReloadService: 'os/folderObjects/',
	regularStore: null,
	clipboardStore: null,
	currentStore: null,
	header: false,
	scrollable: true,
	listeners: {
		cellclick: 'cellClick',
		backclick: 'setBackLocation',
    	rowcontextmenu: 'rightClickMenu',
    	reloadCurrent: 'reloadCurrentLocation',
    	initGridPath: 'initGridPath',
    	getGridPath: 'getGridPath',
    	select: 'select',
    	deselect: 'deselect',
    	updateToolBars: 'updateToolBars',
		celldblclick: 'cellDblclick'
	},
	initComponent: function(){
		this.selModel = 'checkboxmodel';
		this.callParent(arguments);
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
	setOrderby: function(newOrderby){
		this.gridOrderby = newOrderby;
	},
	getOrderby: function(){
		if(Ext.isEmpty(this.gridOrderby))
		{
			return "object_name";
		}
		else
		{
			return this.gridOrderby;
		}
	},
	setSelectionPriority: function(newSelectionPriority){
		this.gridSelectionPriority = newSelectionPriority;
	},
	getSelectionPriority: function(){
		return this.gridSelectionPriority;
	},
	getCurrentPriority: function(){
		return this.gridCurrentPriority;
	},
	setCurrentPriority: function(newCurrentPriority){
		this.gridCurrentPriority = newCurrentPriority;
	},
	getGridMenus: function(){
		return this.gridMenus;
	},
	getGridToolbars:function(){
		return this.gridToolbars;
	},
	getCurrentLocation: function(){
		return this.getGridBreadcrumb().getCurrentLocation();
	},
	getContentRecord: function(){
		return this.getGridBreadcrumb().getCurrentLocation();
	},
	getGridBreadcrumb: function(){
		return this.gridBreadcrumb;
	},
	initToolBars: function(){
		for(var index = 0 ; index < this.configStore.getAt(0).toolbars().count() ; index++)
		{
			var toolbar = Ext.create('ExtDoc.views.exttoolbar.ExtDocToolbar');
			var toolbarConfig = this.configStore.getAt(0).toolbars().getAt(index);
			
			if(Ext.isEmpty(this.getGridToolbars()))
			{
				this.gridToolbars = new Array();
			}
			
			this.gridToolbars[this.gridToolbars.length] = toolbar;
			toolbar.initToolbar(toolbarConfig,this);
			this.addDocked(toolbar);
		}
	},
	initMenus: function(){
		for(var index = 0 ; index < this.configStore.getAt(0).menus().count() ; index++)
		{
			var menuConfig = this.configStore.getAt(0).menus().getAt(index);
			var menu = Ext.create(menuConfig.get('type'));
			
			menu.initMenu(this,menuConfig);
			
			if(Ext.isEmpty(this.getGridMenus()))
			{
				this.gridMenus = {};	
			}
			
			this.gridMenus[menuConfig.get('role')] = menu;
		}
	},
	initColumns: function(){

		var currentGrid = this;
		
		var columnSelectedArray = this.loadColumnsFromCache();
		
		if(!columnSelectedArray)
		{
			var columnSelectedArray = this.getColumnsSelector();
		}
		
		var columns = this.getHeaderContainer().getGridColumns().length;
		
		var headerCount = this.getHeaderContainer().items.length;
		Ext.suspendLayouts();
		
		var removedColumns = [];
		for(index = 1 ; index < headerCount; index++)
		{
			removedColumns.push(this.getHeaderContainer().remove(1, false));
		}
		
		Ext.destroy(removedColumns);
		Ext.resumeLayouts();
		
		if(columnSelectedArray && columnSelectedArray.length > 0)
		{
			this.defaultColumnsStore = Ext.create('ExtDoc.stores.extgrid.ExtDocGridStore');
			this.defaultColumnsStore.initStore("config/maingrid/default_columns_grid.json");
			
			this.defaultColumnsStore.load({
				callback: function(records, operation, success){
					if(success){
							var key = currentGrid.createCacheKey();
							ExtDoc.utils.ExtDocCache.put(key, columnSelectedArray);
							currentGrid.initColumnsSelected(columnSelectedArray);
						}
					}
				});
		}
		else
		{
			var header = this.getHeaderContainer();
			this.initColumnsFromJson(this.configStore, header);
		}
		//Ext.resumeLayouts();
	},
	initBreadcrumb: function(){
		this.gridBreadcrumb = Ext.create('ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumb');
		this.gridBreadcrumb.initBreadcrumb(this);
		this.gridBreadcrumb.dock = 'top';
		this.addDocked(this.gridBreadcrumb);
	},
	initColumnsFromJson: function(storeColumns, header){
		
		var columnsToAdd = [];
		for(var index = 0 ; index <  storeColumns.getAt(0).columns().count() ; index++)
		{
			var columnConfig = storeColumns.getAt(0).columns().getAt(index);
			var newColumn;
			
			if(Ext.isEmpty(columnConfig.get('type')))
			{
				newColumn = Ext.create('ExtDoc.views.extgrid.columns.ExtDocGridColumn');
			}
			else
			{
				newColumn = Ext.create(columnConfig.get('type'));
			}
			
			newColumn.setColumnConfig(columnConfig);
			newColumn.initColumn();
			columnsToAdd.push(newColumn);
			//header.add(newColumn);
		}
		
		header.add(columnsToAdd);
		return header;
	},
	setStore: function(){
		this.setCurrentPriority(-1);
		this.fireEvent('updateToolBars',-1,null,false);
		this.initSelectionArray();

		this.callParent(arguments);
	},
	initStore: function(){
		var newStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectBufferedStore');
		this.setRegularStore(newStore);
		
		if (!this.getClipboardStore())
		{	
			var newClipboardStore = Ext.create('Ext.data.Store', {model: 'ExtDoc.models.extobject.ExtDocObjectModel', bufferedMode: false});
			this.setClipboardStore (newClipboardStore);
		}
		
		this.setStore(newStore);
		this.setCurrentStore('gridStore');
		this.reloadHomeStore();
	},
	initSelectionArray: function(){
		this.selectedArray = {};
		var array = this.getSelectionPriority();
		
		for(var key in array)
		{ 
			this.selectedArray[array[key]] = 0;
		}
	},
	isSelectedArrayEmpty: function(){
		var priorityArray = this.selectedArray;

		for(var key in priorityArray)
		{	
			if(priorityArray[key] > 0)
			{
				return false;
			}
		}
		
		return true;
	},
	getHigherPriority: function(){
		var higherPriority = -1;
		for(var key in this.selectedArray)
		{	
			if(this.selectedArray[key] > 0)
			{
				higherPriority = key;
			}
		}	
		return higherPriority;
	},
	reloadHomeStore: function(){
		var currentLayerName = this.getCurrentLocation().get('unit_layer_name');
		if(currentLayerName == undefined || currentLayerName == null)
		{
			currentLayerName = this.getDefaultUnitlayer();
		}
		
		if(this.unitLayerName != currentLayerName)
		{
			this.unitLayerName = currentLayerName;
			this.initColumns();
		}
		
		this.getStore().initStore(ExtDoc.config.ExtDocConfig.restUrl + this.getGridHomeService());
		this.setCurrentStore('gridStore');
		this.getView().emptyText = '';
		this.getView().refresh();
		this.getStore().loadNextPage();
	},
	reloadStore: function(objectId){
		var currentLayerName = this.getCurrentLocation().get('unit_layer_name');
		if(currentLayerName == undefined || currentLayerName == null)
		{
			currentLayerName = this.getDefaultUnitlayer();
		}
		
		if(this.unitLayerName != currentLayerName)
		{
			this.unitLayerName = currentLayerName;
			this.initColumns();
		}
		
		this.setStore(this.getRegularStore());
		this.setCurrentStore('gridStore');
		this.getStore().removeAll();
		this.getView().emptyText = '';
		this.getView().refresh();
		this.getStore().initStore(ExtDoc.config.ExtDocConfig.restUrl + this.gridReloadService + objectId + "/" + this.getOrderby() + "/{page}");
		var currentGrid = this;		
		this.getStore().loadNextPage(currentGrid);
		this.fireEvent('updateToolBars',-1,null,false);
	},
	initGrid: function(configUrl, mainView){
		var currentGrid = this;
		this.getView().loadingText = ExtDoc.locales.ExtDocLocaleManager.getText('loading');
		this.rtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		this.setMainView(mainView);
		this.configStore = Ext.create('ExtDoc.stores.extgrid.ExtDocGridStore');
		this.configStore.initStore(configUrl);

		this.configStore.load({
			callback: function(records, operation, success){
				if(success){
					currentGrid.buildGrid();
				}
			}
		});
	},
	initProperties: function(){
		ExtDoc.utils.ExtDocComponentManager.registerComponent(this.configStore.getAt(0).get("name"),this);
		this.setGridHomeService(this.configStore.getAt(0).get("home"));
		this.setOrderby(this.configStore.getAt(0).get("orderBy"));
		this.setGridName(this.configStore.getAt(0).get("name"));
		
	},
	buildGrid: function(){
		this.registerScrollEvents();
		this.initBreadcrumb();
		this.initToolBars();
		this.initMenus();
		this.initProperties();
		this.initStore();
	},
	registerScrollEvents: function(){	
		var grid = this;
		
		try
		{
			var elView = this.view.getEl();
			elView.on('scroll', function(e,t){
				if(this.dom.clientHeight == (t.scrollHeight - t.scrollTop))
				{
					if(!grid.getStore().isLoading() && grid.getStore().loadNextPage != null)
					{
						//check if has selected
						var selected = grid.selModel.getSelected();
						var isAllSelected = grid.getStore().getCount() == selected.length;
						
						var pageSizeRowsHeight = grid.getStore().storePageSize * grid.getView().bufferedRenderer.rowHeight * grid.getStore().storePage;
						
						if (t.scrollHeight >= pageSizeRowsHeight)
						{
							grid.getStore().loadNextPage();
						}
						if (isAllSelected)
						{
							setTimeout(function(){ grid.selModel.selectAll(true); }, 1000);
						}							
					}
				}
			});
		}
		catch (e)
		{
			
		}
	},
	setMainView: function(newMainView){
		this.mainView = newMainView;
	},
	getMainView: function(){
		return this.mainView;
	},
	changeLocation: function(record,actionCaller){
		this.getGridBreadcrumb().changeLocation(record,actionCaller);
	},
	onStoreLoad: function(){
		this.getView().emptyText = '';
		this.getView().refresh();
		//set column location visibility
		ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
		this.mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'),'loading');
		
		if(!Ext.isEmpty(this.getStore().getStorePage) && this.getStore().getStorePage() > 1)
		{
			var scrollByCalc = this.getStore().getRange().length * this.getView().bufferedRenderer.rowHeight;
			scrollByCalc -= this.getView().bufferedRenderer.rowHeight * this.getStore().getLastLoadRecordCount() + 1;
			this.getView().scrollBy(0,scrollByCalc,false);
		}
		
		this.fireEvent('updateToolBars',-1,null,false);
		
		if (BrowserDetectorFactory.getBrowserDetector().isChrome())
		{
			this.getView().scrollBy(0, 0, true);
		}
		
		if (this.newDocumentObjectId)
		{
			var editTool = Ext.ComponentQuery.query('[anchor="editView"]')[0];
			
			for (var i = 0; i < this.getStore().data.length; i++)
			{
			    var record = this.getStore().getAt(i);
			    
			    if (this.newDocumentObjectId === record.get('r_object_id'))
			    {
			    	this.setSelection(record);
			    	editTool.fireEvent('click');
			    	break;
				}
			}
		}
		
		this.newDocumentObjectId = false;
		this.unmask();
		this.callParent(arguments);
	},
	setRegularStore: function (newStore){
		this.regularStore = newStore;
	},
	setClipboardStore: function (newStore){
		this.clipboardStore = newStore;
	},
	getRegularStore: function (){
		return this.regularStore;
	},
	getClipboardStore: function(){
		return this.clipboardStore;
	},
	setCurrentStore: function(storeName){
		this.currentStore = storeName;
	},
	getCurrentStore: function(){
		return this.currentStore;
	},
	getUnitLayerName: function(){
		return this.unitLayerName;
	},
	setUnitLayerName: function(newUnitLayerName){
		this.unitLayerName = newUnitLayerName;
	},
	setDefaultUnitlayer: function(){
		this.unitLayerName = '-1';
	},
	getDefaultUnitlayer: function(){
		return '-1';
	},
	loadColumnsFromCache: function()
	{
		var cacheKey = this.createCacheKey();
		var shouldUseCache = Math.floor((Math.random() * 10)) > 0 && ExtDoc.utils.ExtDocCache.contains(cacheKey);
		if (shouldUseCache)
		{
			return ExtDoc.utils.ExtDocCache.get(cacheKey); 
		
		}
		else
		{
			return null;
		}
	},
	createCacheKey: function(){
		return this.unitLayerName;
	},
	getColumnsSelector:function()
	{
		var grid = this;
		
		if(!this.unitLayerName)
		{
			this.setDefaultUnitlayer();
		}
		
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/getColumnSelected/true/" + this.unitLayerName;
	
		var columns;
		Ext.Ajax.request({
			url: completeUrl,
			method: 'GET',
			async:false,
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts) {
				columns = grid.initColumnSelector(response.responseText);
			//	
			},
			failure: function(){
				Ext.resumeLayouts();
			}
		});
		return columns;
	},
	initColumnsSelected: function(columnSelectedArray)
	{
		header = this.getHeaderContainer();
		header = this.initColumnsFromJson(this.defaultColumnsStore, header);
		
		var columnsToAdd = [];
		
		var width = Ext.getBody().getViewSize().width;
		var setFlex = false;
		if((columnSelectedArray.length * 200 + 120) < width)
		{
			setFlex = true;
		}
		
		columnSelectedArray.forEach(function(arrayConfig)
		{
			
			var newColumn = Ext.create(ExtDoc.utils.ExtDocUtils.getColumnType(arrayConfig[2]));
			
			if(arrayConfig[0] == 'object_name')
				newColumn.setText(ExtDoc.locales.ExtDocLocaleManager.getText('name'));
			else
				newColumn.setText(ExtDoc.locales.ExtDocLocaleManager.getText(arrayConfig[0]));
				
			newColumn.hidden = false;
			newColumn.hideable = true;
			newColumn.sortable = true;
			newColumn.dataIndex = arrayConfig[0];
			newColumn.dirty = false;
			if(setFlex){
				newColumn.flex=1;
			}
			columnsToAdd.push(newColumn);
		});
		
		var vlColumn = Ext.create('ExtDoc.views.extgrid.columns.ExtDocGridVersionLabelColumn');
		vlColumn.setText(ExtDoc.locales.ExtDocLocaleManager.getText('r_version_label'));
		vlColumn.dataIndex = 'r_version_label';
		vlColumn.hidden = true;
		vlColumn.sortable = true;
		vlColumn.initColumn();
		
		if(setFlex)
		{
			vlColumn.flex=1;
		}
		
		columnsToAdd.push(vlColumn);
		
		var newColumn = Ext.create('ExtDoc.views.extgrid.columns.ExtDocGridLocationColumn');
		newColumn.setText(ExtDoc.locales.ExtDocLocaleManager.getText('r_folder_path'));
		newColumn.dataIndex = 'r_folder_path';
		newColumn.hidden = true;
		newColumn.sortable = true;
		
		if(setFlex)
		{
			newColumn.flex=1;
		}
		columnsToAdd.push(newColumn);
		
		header.add(columnsToAdd);
		
		ExtDoc.utils.ExtDocLocationColumnUtils.registerColumn(newColumn);
		ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
		
		
	},
	initColumnSelector: function(newObjectColumns){
		var result = Ext.util.JSON.decode(newObjectColumns);
		var allArrayColumns = [];
		for (var index = 0; index < result.length; index++)
		{
			if (result[index].properties.columns_name != null)
			{
				var arrayColumns = [];
				arrayColumns[0] = result[index].properties.columns_name;
				arrayColumns[1] = result[index].properties.columns_desc;
				arrayColumns[2] = result[index].properties.columns_type;
				allArrayColumns.push(arrayColumns);
			}
		}
		return allArrayColumns;
	},
	changeColumnsSize: function()
	{
		var defaultColumnsCount = 1;
		if(this.defaultColumnsStore != undefined)
		{
			for(var index = 0 ; index <  this.defaultColumnsStore.getAt(0).columns().count() ; index++)
			{
				var columnConfig = this.defaultColumnsStore.getAt(0).columns().getAt(index);
				if(columnConfig.get('hidden') == false)
				{
					defaultColumnsCount++;
				}
			}
			
	         var columnsCount = this.getHeaderContainer().gridVisibleColumns.length;
	         var width = Ext.getBody().getViewSize().width;
	         if(((columnsCount-defaultColumnsCount) * 200 + (defaultColumnsCount * 30)) < width)
	         {
	        	 for(var i=defaultColumnsCount;i<this.getHeaderContainer().gridVisibleColumns.length ;i++)
	        	 {
	        		 this.getHeaderContainer().gridVisibleColumns[i].setFlex(true);
	        	 }
	         }
	         else
	         {
	        	 for(var i=defaultColumnsCount;i<this.getHeaderContainer().gridVisibleColumns.length ;i++)
	        	 {
	        		 this.getHeaderContainer().gridVisibleColumns[i].setFlex(false);
	        	 }
	       	 }
	      	 this.doLayout();
		}
    }
});