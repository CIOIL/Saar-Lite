Ext.define('ExtDoc.views.extmenuitems.ExtDocVersionsMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocVersionsController']
    ,
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'versionsController',
	listeners: {
		click:'versionsAction'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var selectedObjectType = record.get('r_object_type');

		if(selectedObjectType.indexOf('_incoming_') > 0 
			|| selectedObjectType.indexOf('_outgoing_') > 0 
			|| selectedObjectType.indexOf('folder') > 0 
			|| selectedObjectType.indexOf('_unit_') > 0
		)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		else
		{
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}
		}

		if(this.getSelectedCount() > 1)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		
		this.callParent(arguments);
	}
});