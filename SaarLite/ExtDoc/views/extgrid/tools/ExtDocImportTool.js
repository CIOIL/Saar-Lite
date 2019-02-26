Ext.define('ExtDoc.views.extgrid.tools.ExtDocImportTool', {
	requires: ['ExtDoc.tools.controllers.ExtDocImportDocController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'ImportDocController',
	anchor: 'importToolView',
	listeners: {
		click:'ImportDocAction'
	},
	initTool: function(){
		this.setIcon('images/Icon-Import.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('import_document'));
	},
	
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];

		if( Ext.isEmpty(objectType) || objectType == 'dm_cabinet' || objectType == 'gov_unit_folder')
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
		else
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
		
		if (objectType == 'clipboard' || objectType == 'links_folder' || objectType == 'versions_folder')
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