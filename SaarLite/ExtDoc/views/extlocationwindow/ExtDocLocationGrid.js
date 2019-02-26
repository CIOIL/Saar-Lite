Ext.define('ExtDoc.views.extlocationwindow.ExtDocLocationGrid', {
	requires: ['ExtDoc.views.extlocationwindow.ExtDocLocationGridController',
				'ExtDoc.views.extgrid.tools.ExtDocDeleteTriggerField'],
	extend: 'ExtDoc.views.extgrid.ExtDocGrid',
	controller: 'locationGridController',
	locationsToolBar: null,
	gridReloadService: 'os/folderOnlyObjects/',
	listeners: {
		cellclick: 'cellClick',
		backclick: 'setBackLocation',
    	reloadCurrent: 'reloadCurrentLocation',
    	initGridPath: 'initGridPath'
	},
	buildGrid: function(){
		this.callParent(arguments);
		this.initColumns();
	},
	initColumns: function()
	{
		var header = this.getHeaderContainer();
		this.initColumnsFromJson(this.configStore, header);
	},
	initToolBars: function(){
		this.callParent(arguments);
		this.locationsToolBar = Ext.create('Ext.toolbar.Toolbar');
		this.locationsToolBar.setOverflowXY('auto','auto');
		
		for(var index = 0 ; index < this.getMainView().getObjectFather().getObjectLocations().length ; index++)
		{
			var value = this.getMainView().getObjectFather().getObjectLocations()[index];
			this.addLocationField(value);	
		}
		this.addDocked(this.locationsToolBar);
		this.updateToolTip();
	},
	getLocationsToolBar: function(){
		return this.locationsToolBar;
	},
	addLocationField: function(value){
		var check = this.checkIfRecordIsNotSelected(value.r_folder_path);
		if (check == true)
		{
			//'value' argument is an object of the type: {"r_folder_path","i_folder_id"}
			var newTool = Ext.create("ExtDoc.views.extgrid.tools.ExtDocDeleteTriggerField");
			newTool.setToolParent(this);
			newTool.setValue(value.r_folder_path);
			newTool.setFolderId(value.r_object_id);
			this.locationsToolBar.add(newTool);
		}
		else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','link_chosen_error');
		}
	},
	checkIfRecordIsNotSelected: function(path){
		var result = true;
		var locations = this.locationsToolBar.items.items;
		if (locations == null || locations == 'undefined')
		{
			
		}
		else
		{
			for (var i = 0; i < locations.length; i++)
			{
				if (path == locations[i].value)
				{
					result = false;
					break;
				}
			}
		}
		return result;
	},
	getCurrentLocations: function() {
		var locationObjects = new Array();

		for (var index = 0; index < this.locationsToolBar.items.length; index++) {
			var locationData = {};	
			locationData["r_folder_path"] = this.locationsToolBar.items.get(index).getValue();
			locationData["r_object_id"] =  this.locationsToolBar.items.get(index).getFolderId();
			locationObjects[index] = locationData;
		}
		
		return locationObjects;
	},
	getCurrentLocationsString: function() {
		var locationsString = '';

		for (var index = 0; index < this.locationsToolBar.items.length; index++) {			
			locationsString = locationsString + (locationsString.length === 0 ? '' : '<br>') 
			                          + this.locationsToolBar.items.get(index).getValue();
		}
		
		return locationsString;
	},
    updateToolTip: function(){ 
    	var currentView = this;
        this.locationsToolBar.tip = Ext.create('Ext.tip.ToolTip', {
	        target: this.locationsToolBar.el,
	        delegate: this.locationsToolBar.itemSelector,
	        trackMouse: true,
	        renderTo: Ext.getBody(),
	        listeners: {
     		     beforeshow: function updateTipBody(tip) {
     			     tip.update(currentView.getCurrentLocationsString());
     		     }
            }
       });
    },
	reloadHomeStore: function(){
		this.getStore().initStore(ExtDoc.config.ExtDocConfig.restUrl + this.getGridHomeService());
		this.setCurrentStore('gridStore');
		this.getView().emptyText = '';
		this.getView().refresh();
		this.getStore().loadNextPage();
	},
	reloadStore: function(objectId){
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
});