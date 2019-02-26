Ext.define('ExtDoc.views.extmenuitems.ExtDocMailMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocMailController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'mailMenuController',
	listeners: {
		click:'mailMenuClick'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var priority = record.get('priority');
		var recordType = record.get('r_object_type');
		
		if(Ext.isEmpty(record))
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		else if(recordType.split("_").pop()  == 'document' && priority == 2 || priority == 3)
		{
			
			if(ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserReadDocPermission(record))
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