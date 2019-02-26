Ext.define('ExtDoc.views.extmenuitems.ExtDocLinkMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocLinkController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'linkController',
	listeners: {
		click:'linkAction'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var priority =  record.get('priority');

		var recordType = record.get('r_object_type');
		if(recordType.split("_").pop() == 'document' && priority == 2 || priority == 3)
		{
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}

			if(record.get('user_permit') < 6 || !Ext.isEmpty(record.get('r_lock_owner')) )
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
		
		if (ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').getSelection().length != 1)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		
		this.callParent(arguments);
	}
});