Ext.define('ExtDoc.views.extmenuitems.ExtDocDeleteMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocDeleteController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'deleteController',
	listeners: {
		click:'deleteAction'
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
			if (ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserDeleteDocPermission(record))
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
		else if (priority == 3)
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
		else if (priority == 4)
		{
			if (record.get('r_object_type').indexOf('folder')!=-1 && ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserDeleteDocPermission(record) && mainGrid.getSelection().length == 1)
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
		
		if(objectType == 'dm_cabinet')
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
		
		if (currentFolderRecord.get('r_object_id') == ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId())
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
		
		if (mainGrid.getSelection().length > 1)
		{
			var priorityArray = mainGrid.selectedArray;
			if(priority == 4)
			{
				if(priorityArray[4] > 1 || priorityArray[2] >= 1 || priorityArray[3] >= 1)
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
			}
		}
		
		if(mainGrid.getSelection().length == 1)
		{
			var selectedObjectsArray = mainGrid.getSelection();
			var lockedByMe = selectedObjectsArray[0].get('locked_by_me');
			if(lockedByMe)
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
		}
		
		if(objectType == 'clipboard' || objectType == 'links_folder' || objectType == 'versions_folder')
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