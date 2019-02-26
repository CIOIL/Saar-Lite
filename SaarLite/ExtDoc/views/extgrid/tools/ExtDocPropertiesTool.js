Ext.define('ExtDoc.views.extgrid.tools.ExtDocPropertiesTool', {
	requires: ['ExtDoc.views.extwindow.ExtDocWindow'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	width: 24,
	height: 24,
	initTool: function(){
		this.setText(ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label')));
	},
	handler: function(){
		Ext.create('ExtDoc.views.extwindow.ExtDocWindow').initWindow("config/formexample/form_example.json");
	}
});