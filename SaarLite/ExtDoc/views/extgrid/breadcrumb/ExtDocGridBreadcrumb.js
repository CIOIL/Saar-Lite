Ext.define('ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumb', {
	extend: 'Ext.toolbar.Toolbar',
	requires: [	'ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumbTool',
				'ExtDoc.views.extgrid.breadcrumb.ExtDocToolbarBreadcrumbSeparator'],
	cls: 'panelbreadcrumb',
	layout: {
		overflowHandler: 'Menu'
	}, 
	homeRecord: null,
	breadcrumbGrid: null,
	breadcrumbPath: null,
    initBreadcrumb: function(breadcrumbGrid){
    	this.breadcrumbGrid = breadcrumbGrid;
    	this.setHomeRecord();
    	this.initBreadcrumbPath();
    	this.reloadBreadcrumn();
    },
    initBreadcrumbPath: function(){
		this.breadcrumbPath = new Array();
		this.breadcrumbPath[0] = this.getHomeRecord(); //Home
    },
    getBreadcrumbGrid: function(){
    	return this.breadcrumbGrid;
    },
    getBreadcrumbPath: function(){
    	return this.breadcrumbPath;
    },
    setBreadcrumbPath: function(breadcrumbPath){
    	this.breadcrumbPath = breadcrumbPath;
    },
    setHomeRecord: function(){
    	this.homeRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
    	this.homeRecord.set('r_object_id',ExtDoc.utils.ExtDocUtils.getHomeFolderId());
    	this.homeRecord.set('unit_id','-1');
    	this.homeRecord.set('object_name','<img src="images/home_icon.gif">');
    	this.homeRecord.set('no_tooltip', true);
    },
    getHomeRecord: function(){    	
    	return this.homeRecord;
    },
	getCurrentLocation: function(){
		return this.getBreadcrumbPath()[this.getBreadcrumbPath().length - 1];
	},    
	setNextLocation: function(record){
		this.getBreadcrumbPath()[this.getBreadcrumbPath().length] = record;
		this.getBreadcrumbGrid().reloadStore(record.data['r_object_id']);
		this.reloadBreadcrumn();
	},
	getBackLocation: function(){
		return this.getBreadcrumbPath()[this.getBreadcrumbPath().length - 2];
	},	
	setBackLocation: function(){
		if(this.getCurrentLocation().data['r_object_id'] != ExtDoc.utils.ExtDocUtils.getHomeFolderId())
		{
			var backLocation = this.getBackLocation();
				
			if(backLocation.data['r_object_id'] == ExtDoc.utils.ExtDocUtils.getHomeFolderId())
			{
				this.getBreadcrumbGrid().initStore();
			}
			else
			{
				this.getBreadcrumbGrid().reloadStore(backLocation.data['r_object_id']);
			}
			
			this.getBreadcrumbPath().splice(this.getBreadcrumbPath().length - 1,1);
			this.reloadBreadcrumn();
		}
	},	
	changeLocation: function(record,actionCaller){
		if (!ExtDoc.utils.ExtDocVaLoader.va)
		{
			ExtDoc.utils.ExtDocVaLoader.loadVa();
		}
	
		if (record.get('action_caller'))
		{
			actionCaller = record.get('action_caller');
		}
		
		if(record.data['r_object_id'] == ExtDoc.utils.ExtDocUtils.getRecentDocsFolderId()
			|| record.data['r_object_id'] == ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId()
			|| record.data['r_object_id'] == ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId())
		{
			return;
		}
		
		if (ExtDoc.utils.ExtDocLimitedAccess.checkLimitedAccess())
		{
			var limitedAccessObjectId = ExtDoc.utils.ExtDocLimitedAccess.limitedAccessObjectId;
			var allowNavigation = limitedAccessObjectId == record.data['r_object_id'];
			
			if (!allowNavigation)
			{
				var ids = record.data['i_ancestor_id'];
				for (var id in ids)
				{
					if (limitedAccessObjectId == ids[id])
					{
						allowNavigation = true;
						break;
					}
				}
			}
			
			if (!allowNavigation)
			{
				ExtDoc.utils.ExtDocUtils.showAlert('error','action_not_allowed_error');
				return;
			}
			
			var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
			var mainGrid = mainView.getMainGrid();
			currentStore = mainGrid.getCurrentStore();
			var navigationFromClipBoard = false;
			
			if(currentStore == 'clipboardStore')
			{
				mainGrid.setCurrentStore('gridStore');
				mainGrid.setStore(mainGrid.getRegularStore());
				navigationFromClipBoard = true;
			}
		}
		
		var newPath = new Array();
		var foundLocation = false;

		if(actionCaller == 'toolbar')
		{
			for(var index = 0 ; index < this.getBreadcrumbPath().length ; index++)
			{
				newPath[index] = this.getBreadcrumbPath()[index];
				
				if(this.getBreadcrumbPath()[index].data['r_object_id'] == record.data['r_object_id'])
				{
					foundLocation = true;
					break;	
				}
			}
			this.setBreadcrumbPath(newPath);
			this.reloadBreadcrumn();
			
			if(record.data['r_object_id'] == -1)
			{
				this.getBreadcrumbGrid().initStore();
				//mainGrid.setDefaultUnitId();
				//mainGrid.initColumns();
			}
			else
			{
				if (!navigationFromClipBoard)
				{
					this.getBreadcrumbGrid().reloadStore(record.data['r_object_id']);
				}
			}
		}
		if(actionCaller == 'favorites' || actionCaller == 'search' || actionCaller == 'clipboard' || actionCaller == 'versions' || actionCaller == 'links')
		{
			this.getBreadCrumbObject(record.get('r_object_id'));
			this.getBreadcrumbPath()[this.getBreadcrumbPath().length] = record;
			
			if (!navigationFromClipBoard)
			{
				this.getBreadcrumbGrid().reloadStore(record.data['r_object_id']);
			}
		}
	},
    reloadBreadcrumn: function(){
    	this.removeAll();
    	
    	if(!Ext.isEmpty(this.getBreadcrumbPath()[1]) && this.getBreadcrumbPath()[1].get('action') == 'search')
    	{
			this.getBreadCrumbObject(this.getBreadcrumbPath()[1].get('r_object_id'));
			this.initBreadcrumbPath();
    	}
    		
		for(var index = 0 ; index < this.getBreadcrumbPath().length ; index++)
		{	
			if(index >= 1)
			{
				this.add(Ext.create('ExtDoc.views.extgrid.breadcrumb.ExtDocToolbarBreadcrumbSeparator'));
			}
			
			var location = Ext.create('ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumbTool');
			location.setToolRecord(this.getBreadcrumbPath()[index]);
			location.setToolParent(this);
			location.initTool();
			location.initToolTip(this.getBreadcrumbPath());
			this.add(location);
		}
    },
    getBreadCrumbObject: function(folderId){
    	var currentField = this;
    	var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/getFoldersAncestor/" + folderId;

		Ext.Ajax.request({
			url: completeUrl,
			method: 'GET',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
			success: function(response, opts){
				var newBreadcrumbArray = currentField.initBreadCrumbObjects(response.responseText);
				currentField.setBreadcrumbPath(newBreadcrumbArray);
				currentField.reloadBreadcrumn();
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
			}
		});
    },
    initBreadCrumbObjects: function(newObject){
		var result = Ext.util.JSON.decode(newObject);
		var objectBreadCrumb = new Array();
		
		objectBreadCrumb[0] = this.getHomeRecord();
		
		for (var index = result.length - 1,indexArray = 1; index >= 0; index--,indexArray++) 
		{		var record = this.setToRecord(result[index].properties)
				objectBreadCrumb[indexArray] = record;
		}
		
		return objectBreadCrumb;
	},
	setToRecord: function(newRecord){
		var record = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
    	record.set('r_object_id',newRecord.r_object_id);
    	record.set('object_name',newRecord.object_name);
    	record.set('i_ancestor_id',newRecord.i_ancestor_id);
    	record.set('i_folder_id',newRecord.i_folder_id);
    	record.set('r_folder_path',newRecord.r_folder_path);
    	record.set('r_lock_owner',newRecord.r_lock_owner);
    	record.set('r_modify_date',newRecord.r_modify_date);
    	record.set('r_object_type',newRecord.r_object_type);
    	record.set('user_permit',newRecord.user_permit);
    	record.set('sensitivity',newRecord.sensitivity);
    	record.set('classification',newRecord.classification);
    	record.set('unit_id', newRecord.unit_id);
    	
    	var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');  		
    	record.set('unit_layer_name', newRecord.unit_layer_name == null ? mainGrid.getDefaultUnitlayer(): newRecord.unit_layer_name);
    	
    	return record;
	}
});