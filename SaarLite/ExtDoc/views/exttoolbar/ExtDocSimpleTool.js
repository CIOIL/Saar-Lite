Ext.define('ExtDoc.views.exttoolbar.ExtDocSimpleTool', {
	requires: [	'ExtDoc.views.exttoolbar.ExtDocTool'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	initTool: function(){
		this.setText(ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label')));
		this.setHandler(this.getToolConfig().get('handler'));
		
		if(!Ext.isEmpty(this.getToolConfig().get('class_style')))
		{	
			this.cls = this.getToolConfig().get('class_style');
		}
		
		this.setToolId();
		this.callParent();
	},
	setToolId: function(){
		this.id = "simple_button_" + ExtDoc.utils.ExtDocUtils.getRandomNumber();
	}
});