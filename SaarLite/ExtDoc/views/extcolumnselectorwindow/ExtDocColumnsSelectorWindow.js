Ext.define('ExtDoc.views.extcolumnselectorwindow.ExtDocColumnsSelectorWindow', {
	extend : 'ExtDoc.views.extwindow.ExtDocWindow',
	requires : ['ExtDoc.views.extcolumnselectorwindow.ExtDocColumnsSelectorWindowController'],
	controller: 'columnsSelectorController',
	columnsAvilableGrid: null,
	columnSelectedGrid:null,
	panelButtons:null,
	layout: {
        type: 'hbox',
        align: 'stretch'
    },
	listeners: {
		afterrender: function(){
			this.updateAfterRender();
		}
	},
	updateAfterRender: function(){
		this.doMaskView(ExtDoc.locales.ExtDocLocaleManager.getText('loading_columns'));
	},
	initColumnSelectorWindow: function() {
		this.initWindow("config/columnselector/column_selector_form.json");
		
		var gridSelected = Ext.create('ExtDoc.views.extcolumnselectorwindow.ExtDocColumnSelectorGrid');
		this.setColumnSelectedGrid(gridSelected);
				
		var grid = Ext.create('ExtDoc.views.extcolumnselectorwindow.ExtDocColumnSelectorGrid');
		grid.initGrid("config/columnselector/column_avilable_grid.json",this);
		this.setColumnsAvilableGrid(grid);
	
	
		this.panelButtons = Ext.create('ExtDoc.views.extcolumnselectorwindow.ExtDocPanelButtons');
		this.panelButtons.initPanel('config/columnselector/column_selector_buttons_panel.json');
		this.panelButtons.setObjectFather(this);
		this.setPanelButtons(this.panelButtons);
		
		this.add(this.columnsAvilableGrid, this.panelButtons, this.columnSelectedGrid);
		this.columnSelectedGrid.hidden = true;
		this.columnsAvilableGrid.hidden = true;
		this.panelButtons.hidden = true;
		
	},
	getColumnsAvilableGrid: function(){
		return this.columnsAvilableGrid;
	},
	setColumnsAvilableGrid: function(newColumnsAvilableGrid){
		this.columnsAvilableGrid = newColumnsAvilableGrid;
	},
	getColumnSelectedGrid: function(){
		return this.columnSelectedGrid;
	},
	setColumnSelectedGrid: function(newColumnSelectedGrid){
		this.columnSelectedGrid = newColumnSelectedGrid;
	},
	getPanelButtons: function(){
		return this.panelButtons;
	},
	setPanelButtons: function(newPanelButtons){
		this.panelButtons = newPanelButtons;
	},
	initColumnSelectedGrid: function(){
		this.getColumnSelectedGrid().initGrid("config/columnselector/column_selected_grid.json",this);
	}
});