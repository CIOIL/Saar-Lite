Ext.define('ExtDoc.views.extgrid.tools.ExtDocColumnsSelectorTool', {
	requires:['ExtDoc.tools.controllers.ExtDocAddRemoveCoulmnsController',
	           'ExtDoc.views.extcolumnselectorwindow.ExtDocColumnSelectorButton'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'addremovecontroller',
	initTool: function(){
		this.setIcon('images/Icon_Columns_Selector.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('add_columns_button'));
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var actionCaller = currentFolderRecord.data['action_caller'];
		if(actionCaller == 'search' || actionCaller == 'clipboard' || actionCaller == 'versions' || actionCaller == 'links')
		{
			this.setDisabled(true);
		}
		else if (this.isDisabled())
		{
			this.setDisabled(false);
		}
	},
	listeners: {
		click:'addAndRemoveAction'
	}
});