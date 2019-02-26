Ext.define('ExtDoc.views.extgrid.tools.ExtDocMailTool',
{
	requires : [ 'ExtDoc.tools.controllers.ExtDocMailController' ],
	extend : 'ExtDoc.views.exttoolbar.ExtDocTool',
	anchor : 'emailView',
	controller : 'mailMenuController',
	listeners :
	{
		click : 'mailMenuClick'
	},
	initTool : function()
	{
		this.setIcon('images/Icon-Email.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('email'));
	},
	updateTool : function(priority, record, selected)
	{
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		this.setDisabled(false); // enable button
		if (priority == 2 || priority == 3)
		{
			if(ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserReadDocPermission(record))
			{
				if (this.isDisabled())
				{
					this.setDisabled(false);
				}
			}
		}
		else if ( priority == 4)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}

		if (!mainGrid.getSelection() || mainGrid.getSelection().length == 0)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}

		if (!record || !record.data || record.data['r_object_type'] == 'dm_cabinet')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}

		if (!Ext.isEmpty(record) && objectType == 'dm_cabinet')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}

		this.callParent(arguments);
	}
});