Ext.define('ExtDoc.views.extmenuitems.ExtDocShowVersionsMenuItem', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocShowVersionsController' ],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'showVersionsController',
	listeners: {
		click: 'showVersions'
	},
	initItem: function() {
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if (mainGrid.getSelection().length == 1 
			&& record.get('r_object_type').indexOf('document') != -1 
			&& Array.isArray(record.get('r_version_label')) 
			&& record.get('r_version_label').length > 1 
			&& objectType != 'dm_cabinet' 
			&& objectType != 'gov_unit_folder' 
			&& objectType != 'versions_folder')
		{
			if (this.isHidden())
			{
				this.setHidden(false);
			}
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}
		}
		else
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