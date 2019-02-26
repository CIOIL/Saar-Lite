Ext.define('ExtDoc.views.extgrid.ExtDocGridController', {
	requires: ['ExtDoc.tools.controllers.ExtDocEditController'],
    extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.gridController',
	gridPath:null,
	getGridPath: function(){
		return this.gridPath;
	},
	cellClick: function(searchgrid, cellEl, columnIndex, record, rowEl, rowIndex, event){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		//0 - left click
		//1 - middle click
		//2 - right click
        
		Ext.suspendLayouts();
		if(columnIndex != 0 && event.button == 0)
		{
			var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
			var allColumnsLengh = mainGrid.getHeaderContainer().getGridColumns().length;
			var columns = mainGrid.getHeaderContainer().gridVisibleColumns;
			var locationColumnFound = false;
			var locationColumnPressed = false;
			
			if (columns && columns.length > 0)
			{
				var columnId = columns[columns.length - 1].dataIndex;
					
				if(columnId == 'r_folder_path' && !columns[columns.length - 1].isHidden())
				{
					locationColumnFound = true;
				}
			}
			allColumns = mainGrid.getHeaderContainer().getGridColumns();
			
			//if column is hidden it means the order is by column Customization.
			//In column customization module, beginning with column #4 and above, we have the hidden columns 
			var isHidden = allColumns[4].isHidden();
			
			var lastColumnIndex = null;
			if(isHidden == false)
			{
				lastColumnIndex = columns.length ;
			}
			else
			{
				lastColumnIndex = allColumnsLengh - 1;
			}
			if(columnIndex ==  lastColumnIndex)
			{
				locationColumnPressed = true;
			}
			//If last column is location column and user clicked on this last column 
			if(locationColumnFound && locationColumnPressed)
			{	
				var folderIderPath = record.data['r_folder_path'];
				if( ! Ext.isEmpty(folderIderPath))
				{
					ExtDoc.utils.ExtDocLocationColumnUtils.reloadToPathLocation(record , this);
				}
			}
			else if(ExtDoc.utils.ExtDocUtils.isRecordFolder(record))
			{
				//this.getView().getGridBreadcrumb().setNextLocation(record);// produces wrong path in case of folder in search results
				this.getView().getGridBreadcrumb().changeLocation(record, 'favorites');
			}
		}
		Ext.resumeLayouts(true);
	},
	cellDblclick: function(searchgrid, cellEl, columnIndex, record, rowEl, rowIndex, event){
		
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		Ext.suspendLayouts();
		if(record.get('locked_by_me'))
		{
			this.getView().getDockedComponent(2).getToolByName("edittool").fireEvent("click");
		}
		else
		{
			this.getView().getDockedComponent(2).getToolByName("readtool").fireEvent("click");
		}
		Ext.resumeLayouts(true);
	},
	deselect: function(grid,record,rowIndex){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		Ext.suspendLayouts();
		if(!Ext.isEmpty(record.get('r_object_type')))
		{
			var priorityParameter = this.getPriorityParameter(record);
			this.updateSelectedArray(record.get('priority'),-1);
			this.updatePriority(this.getView().getHigherPriority(),record,false);
			if(this.getView().isSelectedArrayEmpty())
			{
				this.getView().setCurrentPriority(-1);
				this.getView().fireEvent('updateToolBars',-1,null,false);
			}
		}
		Ext.resumeLayouts(true);
	},
	select: function(grid,record,rowIndex){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		Ext.suspendLayouts();
		var pdfViewer = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view').getPdfViewer();
		
		if (!pdfViewer.getCollapsed())
		{
			pdfViewer.getPdfStream(record);
		}
		if(record.get('priority') && record.get('priority') != "")
		{
			var priorityParameter = this.getPriorityParameter(record);
			this.updateSelectedArray(record.get('priority'),1);
			this.updatePriority(this.getView().getHigherPriority(), record, true);
		}
		Ext.resumeLayouts(true);
		//console.log (this.getView().selectedArray);
		//console.log(this.getView().getSelection()[0]);
		//console.log(ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());		
	},
	getPriorityParameter: function(record){
		var priorityParameter = record.get('r_object_type');
		if (priorityParameter.split("_").pop() == 'document')
		{
			if (record.get('r_lock_owner') != "")
			{
				priorityParameter = 'locked_doc';
			}
		}
		
		return priorityParameter;
	},
	updateSelectedArray: function(priority,value){
		this.getView().selectedArray[priority] = this.getView().selectedArray[priority] ? this.getView().selectedArray[priority] + value : value;	
	},
	updatePriority: function(newPriority,record,selected){
		this.updateToolBars(newPriority,record,selected == 1);
	},
	rightClickMenu: function(grid, record, domEl, rowIndex, event) {
		event.stopEvent();
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		var contextProperty = this.getView().getGridMenus();
		if (contextProperty!=null)
		{
			contextProperty.context.setMenuRecord(record);
			contextProperty.context.showAt(event.pageX,event.pageY);
		}
	},
	initGridPath: function(){
		this.getView().getGridBreadcrumb().initBreadcrumbPath();
	},
	setBackLocation: function(){
		this.getView().getGridBreadcrumb().setBackLocation();
	},
	reloadCurrentLocation: function(){
		this.getView().reloadStore(this.getView().getGridBreadcrumb().getCurrentLocation().data['r_object_id']);
	},
    convertSelectionPriority: function(selectionTypeName){
		return this.getView().getSelectionPriority()[selectionTypeName];
	},
    updateToolBars: function(priority,record,selected){
    	var gridToolbars = this.getView().getGridToolbars();
    	for(var index = 0; index < gridToolbars.length;index++)
    	{
    		gridToolbars[index].updateToolbar(priority,record,selected);
    	}
    }
});