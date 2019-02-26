Ext.define('ExtDoc.views.extgrid.tools.ExtDocLinksTool', {
	requires:['ExtDoc.tools.controllers.ExtDocLinksController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	anchor: 'linksView',
	controller: 'linksController',
	listeners: {
		click:'linksAction'
	},
	initTool: function(){
		this.setIcon('images/Icon_Links.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('links_submit'));
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if (mainGrid.getSelection().length > 1 && objectType != 'dm_cabinet' && objectType != 'gov_unit_folder' && objectType != 'links_folder')
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