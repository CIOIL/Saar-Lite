Ext.define('ExtDoc.views.extmenuitems.ExtDocRemoveFromClipboardMenuItem', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocClipboardController' ],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'clipboardController',
	listeners: {
		click: 'removeFromClipboard'
	},
	initItem: function() {
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if (mainGrid.getSelection().length > 0 && objectType == 'clipboard')
		{
			if (this.isHidden())
			{
				this.setHidden(false);
			}
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}
		}
		else
		{
			if (!this.isHidden())
			{
				this.setHidden(true);
			}
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		
		this.callParent(arguments);
	}
});