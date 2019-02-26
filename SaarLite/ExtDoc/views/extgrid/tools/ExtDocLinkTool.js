Ext.define('ExtDoc.views.extgrid.tools.ExtDocLinkTool', {
	requires: ['ExtDoc.tools.controllers.ExtDocLinkController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'linkController',
	anchor: 'linkView',
	listeners: {
		click:'linkAction'
	},
	initTool: function(){
		this.setIcon('images/Icon-Filing.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('linking'));
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if(priority == 2)
		{
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		else if(priority == 3 || priority == 4)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		
		if (mainGrid.getSelection().length > 1)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		
		if (mainGrid.getSelection().length == 0)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		if (Ext.isEmpty(record))
		{
			if (!this.isDisabled())
			{	
				this.setDisabled(true);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		if(!Ext.isEmpty(record) && objectType == 'dm_cabinet')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		
		if(!Ext.isEmpty(record) && objectType == 'gov_unit_folder')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		
		if (Ext.isEmpty(objectType) && Ext.isEmpty(record))
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		
		if (objectType == 'clipboard' || objectType == 'versions_folder')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if(!this.isHidden())
			{
				this.setHidden(true);
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