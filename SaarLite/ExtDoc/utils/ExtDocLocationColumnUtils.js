Ext.define('ExtDoc.utils.ExtDocLocationColumnUtils',{	
	singleton: true,
	mainGrid: null,
	setColumnVisibility:function(){ 
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view').getMainGrid();
		var locationColumn = this.getColumn();
		var store = mainGrid.getStore();
		var record = store.getAt(0);
		if(Ext.isEmpty(record))
		{
			locationColumn.setHidden(true);
			this.setVersionLabelColumnVisibility(mainGrid);
			return;
		}
		
		var action = record.get('action');
		if(!Ext.isEmpty(locationColumn) && !Ext.isEmpty(action))
		{
			locationColumn.setHidden(false);
		}
		else
		{
			try
			{
				var view = mainGrid.getCurrentLocation().get('r_object_type');
				if(view ==  "lastdocs" || view == 'favoritedocs')
				{
					locationColumn.setHidden(false);
				}
				else 
			    {  
					locationColumn.setHidden(true);
			    }	
			}
			catch(error)
			{
				
			}
		}
		
		this.setVersionLabelColumnVisibility(mainGrid);
	},
	
	setVersionLabelColumnVisibility: function(mainGrid){
		var isVersionsView = mainGrid.getCurrentLocation().get('r_object_type') == 'versions_folder' ? true : false;
		var versionLabelColumn = ExtDoc.utils.ExtDocComponentManager.getComponent('versionLabelColumn');
		
		if (isVersionsView)
		{
			if (versionLabelColumn && versionLabelColumn.isHidden())
			{
				versionLabelColumn.setHidden(false);
			}
		}
		else
		{
			if(versionLabelColumn && !versionLabelColumn.isHidden())
			{
				versionLabelColumn.setHidden(true);
			}
		}
	},
	setActionOnRecord:function()
	{
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view').getMainGrid();
		var locationColumn = this.getColumn();
		var store = mainGrid.getStore();
		var record = store.getAt(0);
		if (record){
			record.set('action' , 'showLocationColumn');
		}
		
	},
	
	registerColumn: function (column){
		ExtDoc.utils.ExtDocComponentManager.registerComponent('locationColumn', column);
	},
	
	getColumn: function()
	{
		var locationColumn = ExtDoc.utils.ExtDocComponentManager.getComponent('locationColumn');
		return locationColumn;
	},
	
	//reload the grid in the selected object path - after user presses on the link in the column.
	reloadToPathLocation: function(record , grid)
	{
		var folderID = record.data['i_folder_id'];
		var newRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		newRecord.set('r_object_id', folderID); /// create new record with the folder id .
		newRecord.set('unit_layer_name', record.data['unit_layer_name']); 
		var breadcrumb = grid.getView().getGridBreadcrumb();
		breadcrumb.changeLocation(newRecord , 'favorites');//change location to the object location folder.
		
	}
});