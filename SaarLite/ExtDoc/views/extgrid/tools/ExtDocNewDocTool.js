Ext.define('ExtDoc.views.extgrid.tools.ExtDocNewDocTool', {
	requires: ['ExtDoc.tools.controllers.ExtDocNewDocController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'newDocController',
	listeners: {
		click:'newDocAction'
	},
	initTool: function(){
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('new_document'));
		this.setIcon('images/Icon-New.png');
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if(Ext.isEmpty(objectType) || objectType == 'dm_cabinet' || objectType == 'gov_unit_folder' )
		{
			if (this.isHidden())
			{
				this.setHidden(false);
			}
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		else
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
		
		if (objectType == 'clipboard' || objectType == 'links_folder' || objectType == 'versions_folder')
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