Ext.define('ExtDoc.views.extmenuitems.ExtDocReadMenuItem', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocReadController' ],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'readController',
	listeners: {
		click: 'readAction'
	},
	initItem: function() {
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record) {
		if (record.get('user_permit') < 3 || ExtDoc.utils.ExtDocUtils.isRecordFolder(record))
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
		this.callParent(arguments);
	}
});