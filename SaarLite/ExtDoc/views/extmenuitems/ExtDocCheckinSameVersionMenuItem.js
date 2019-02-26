Ext.define('ExtDoc.views.extmenuitems.ExtDocCheckinSameVersionMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocCheckinController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'checkinController',
	anchor: 'checkinSameVersionMenuItem',
	listeners: {
		click:'checkinSameVersion'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if(!ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserEditDocPermission(record) || ExtDoc.utils.ExtDocUtils.isRecordFolder(record) || !record.get('locked_by_me'))
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
		if (this.getSelectedCount() > 1)
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