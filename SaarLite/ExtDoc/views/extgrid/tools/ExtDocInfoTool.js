Ext.define('ExtDoc.views.extgrid.tools.ExtDocInfoTool', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocInfoController' ],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'infoMenuController',
	anchor: 'infoToolView',
	width: 24,
	height: 24,
	listeners: {
		click: 'infoMenuClick'
	},
	initTool: function() {
		this.setIcon('images/info_icon.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('info'));
	},
	updateTool: function(priority,record,selected){
		if (this.isDisabled())
		{
			this.setDisabled(false);
		}
	}
});