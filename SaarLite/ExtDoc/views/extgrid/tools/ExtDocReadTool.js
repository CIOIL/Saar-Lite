Ext.define('ExtDoc.views.extgrid.tools.ExtDocReadTool', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocReadController' ],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'readController',
	anchor: 'readView',
	listeners: {
		click: 'readAction'
	},
	initTool: function() {
		this.setIcon('images/Icon-PDF.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('readpdf'));
	},
	updateTool: function(priority, record, selected) {
		if (priority == 2 || priority == 3)
		{
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}
		}
		else
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		
		this.callParent(arguments);
	}
});