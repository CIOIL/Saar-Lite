Ext.define('ExtDoc.views.extgrid.tools.ExtDocShowClipboardTool', {
	requires:['ExtDoc.tools.controllers.ExtDocClipboardController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	anchor: 'showClipboardView',
	controller: 'clipboardController',
	listeners: {
		click:'showClipboard'
	},
	initTool: function(){
		this.setIcon('images/Icon_Show_Clipboard.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('show_clipboard'));
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if (objectType != 'clipboard' && objectType != 'versions_folder' && objectType != 'dm_cabinet' && objectType != 'gov_unit_folder')
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
		
		
		if (ExtDoc.utils.ExtDocLimitedAccess.checkLimitedAccess())
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