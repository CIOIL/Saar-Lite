Ext.define('ExtDoc.views.extgrid.tools.ExtDocDownloadTool', {
	requires: ['ExtDoc.tools.controllers.ExtDocDownloadController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'downloadController',
	listeners: {
		click:'downloadAction'
	},
	initTool: function(){
		this.setText(ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label')));
	}
});