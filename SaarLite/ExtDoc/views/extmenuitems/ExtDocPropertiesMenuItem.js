Ext.define('ExtDoc.views.extmenuitems.ExtDocPropertiesMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocPropertiesController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'propertiesController',
	listeners: {
		click:'propertiesAction'
	},
	anchor: 'propertiesMenuItem',
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		
		var selectedObjectType = record.get('r_object_type'); 

		if(this.getSelectedCount() > 1)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		if(selectedObjectType.indexOf('_incoming_') > 0 || selectedObjectType.indexOf('_outgoing_') > 0 || selectedObjectType.indexOf('_unit_') > 0)
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}

		this.callParent(arguments);
	}
});