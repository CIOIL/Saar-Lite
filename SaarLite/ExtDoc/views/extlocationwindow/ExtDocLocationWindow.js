Ext.define('ExtDoc.views.extlocationwindow.ExtDocLocationWindow', {
	requires: ['ExtDoc.views.extlocationwindow.ExtDocLocationWindowController',
				'ExtDoc.views.extgrid.tools.ExtDocAddLocationTool'],
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	controller: 'windowLocationController',
	mainGrid: null,
	initLocationWindow: function() {
		this.initWindow("config/locationform/location_form.json");
   		var grid = Ext.create('ExtDoc.views.extlocationwindow.ExtDocLocationGrid');
		grid.initGrid("config/locationselectgrid/location_selection_grid.json",this);
		this.setMainGrid(grid);
		this.add(grid);
	},
	getMainGrid: function(){
		return this.mainGrid;
	},
	setMainGrid: function(newMainGrid){
		this.mainGrid = newMainGrid;
	}
});