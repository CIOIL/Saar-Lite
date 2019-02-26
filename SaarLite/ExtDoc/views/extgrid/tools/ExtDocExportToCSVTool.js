Ext.define('ExtDoc.views.extgrid.tools.ExtDocExportToCSVTool', {
	requires: ['ExtDoc.tools.controllers.ExtDocExportToCSVController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'exportToCSVController',
	anchor: 'exportToCSVView',
	listeners: {
		click: 'exportToCSV'
	},
	initTool: function(){
		this.setIcon('images/Icon-export-to-csv.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('export_to_csv'));
	},
	updateTool: function(priority, record, selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedItems = mainGrid.getSelection();
		
		if (selectedItems.length > 0)
		{
			if (this.isDisabled())
			{
				this.setDisabled(false)
			}
		}
		else
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true)
			}
		}
		
		this.callParent(arguments);
	}
});