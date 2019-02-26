Ext.define('ExtDoc.views.extgrid.tools.ExtDocAddLocationTool', {
	//This button is used to edit locations of the current document
	requires: ['ExtDoc.tools.controllers.ExtDocAddController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'addController',
	listeners: {
		click:'addAction'
	},
	initTool: function(){
		this.setIcon('images/add.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('add_location'));
	},
	updateTool: function(priority,record,selected){
		if(Ext.isEmpty(record) || record.get('r_object_type') == 'dm_cabinet' || record.get('r_object_type') == 'gov_unit_folder')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
		else 
		{
			if(ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserEditDocPermission(record))
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
				if(selected)
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','write_folder_permissions_error');
				}
			}
		}
	}
});