Ext.define('ExtDoc.views.extgrid.tools.ExtDocRefreshTool', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocRefreshController' ],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'refreshMenuController',
	listeners: {
		click: 'refreshMenuClick'
	},
	initTool: function() {
		this.setIcon('images/refresh_icon.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('refresh'));
	},
	updateTool: function(priority,record,selected){
		if (this.isDisabled())
		{
			this.setDisabled(false);
		}
	}
});