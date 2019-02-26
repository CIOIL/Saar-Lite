Ext.define('ExtDoc.views.extgrid.tools.ExtDocAddToClipboardTool', {
	requires:['ExtDoc.tools.controllers.ExtDocClipboardController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	anchor: 'addToClipboardView',
	controller: 'clipboardController',
	listeners: {
		click:'addToClipboard'
	},
	initTool: function(){
		this.setIcon('images/Icon_Add_To_Clipboard.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('add_to_clipboard'));
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if (mainGrid.getSelection().length > 0 && objectType != 'dm_cabinet' && objectType != 'gov_unit_folder' && objectType != 'clipboard' && objectType != 'versions_folder')
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
		else if (objectType == 'clipboard' || objectType == 'versions_folder')
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
		else
		{
			if (!this.isHidden())
			{
				this.setHidden(false);
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