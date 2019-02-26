Ext.define('ExtDoc.views.extmenuitems.ExtDocCancelCheckoutMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocCancelCheckoutController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'cancelCheckoutController',
	listeners: {
		click:'cancelCheckoutAction'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.get('object_type');
		
		var flag = true;
		var hideFlag = false;
		
		if (record.get('locked_by_me'))
		{
			flag = false;
		}
		
		if (currentFolderRecord.get('r_object_id') == ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId())
		{
			flag = true;
		}
		
		if (objectType == 'clipboard' || objectType == 'links_folder' || objectType == 'versions_folder')
		{
			hideFlag = true;
		}
		
		if (this.isDisabled() != flag)
		{
			this.setDisabled(flag);
		}
		
		if (this.isHidden() != flag)
		{
			this.setHidden(hideFlag);
		}
		this.callParent(arguments);
	}
});