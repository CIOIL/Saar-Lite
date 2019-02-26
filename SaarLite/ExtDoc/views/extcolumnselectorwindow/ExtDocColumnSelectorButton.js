Ext.define('ExtDoc.views.extcolumnselectorwindow.ExtDocColumnSelectorButton', {
		requires: ['ExtDoc.views.exttoolbar.ExtDocSimpleTool'],
		extend: 'ExtDoc.views.exttoolbar.ExtDocSimpleTool',
		width:30,
		height: 20,
		style: {
	         border: 'none',
	         marginTop: '10px',
	         marginRight: '35px',
	         outline: 0
		},
		initTool: function(){
			this.setIcon(this.getToolConfig().get('icon'));
			
			this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('text')));
			
			this.setHandler(this.getToolConfig().get('handler'));
			
		}
});