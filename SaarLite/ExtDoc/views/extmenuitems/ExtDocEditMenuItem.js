Ext.define('ExtDoc.views.extmenuitems.ExtDocEditMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocEditController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'editController',
	listeners: {
		click:'editAction'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		var priority = record.get('priority');

		if(priority == 2)
		{	
			if(ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserEditDocPermission(record))
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
		}
		
		else if (priority == 3 || priority == 4)
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
		
		if (mainGrid.getSelection().length < 1)
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
		
		if(!Ext.isEmpty(record) && objectType == 'dm_cabinet')
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
		
		if (Ext.isEmpty(record))
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
		
		if(objectType == 'dm_cabinet' || objectType == 'gov_unit_folder')
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