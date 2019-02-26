Ext.define('ExtDoc.views.extmenuitems.ExtDocDownloadMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocDownloadController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'downloadController',
	listeners: {
		click:'downloadAction'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		if(ExtDoc.utils.ExtDocUtils.isRecordFolder(record))
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		this.callParent(arguments);
	}
});