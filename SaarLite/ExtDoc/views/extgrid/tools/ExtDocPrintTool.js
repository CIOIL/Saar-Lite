Ext.define('ExtDoc.views.extgrid.tools.ExtDocPrintTool', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocPrintController' ],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'printController',
	anchor: 'printView',
	listeners: {
		click: 'printAction'
	},
	initTool: function(){
		this.setIcon('images/Icon-print.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('print'));
	},
	updateTool: function(priority, record, selected){
		var applet = document.getElementById('fileApplet');
		
		if ((priority == 2 || priority == 3) && applet && BrowserDetectorFactory.getBrowserDetector().isIE())
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