Ext.define('ExtDoc.views.extmenuitems.ExtDocChangeContentMenuItem', {
	requires: ['ExtDoc.tools.controllers.ExtDocChangeContentController'],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'changeContentController',
	listeners: {
		click:'changeContentAction'
	},
	initItem: function(){
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		var selectionCount = mainGrid.getSelection().length;
		var isEmptyRecord = Ext.isEmpty(record);
		var flagIsHidden = null;
		var flagIsDisabled = null;
		
		if (!Ext.isEmpty(objectType))
 		{
			if (objectType == 'dm_cabinet' || 
				objectType == 'gov_unit_folder')
 			{
				flagIsHidden = false;
				flagIsDisabled = true;
 			}
			else if (objectType == 'clipboard' || 
					objectType == 'links_folder' || 
					objectType == 'versions_folder')
 			{
				flagIsHidden = true;
				flagIsDisabled = true;
 			}
 		}
 		
		if (flagIsHidden == null && flagIsDisabled == null)
 		{
			if (isEmptyRecord)
 			{
				flagIsHidden = false;
				flagIsDisabled = true;
 			}
			else
 			{
				var priority = record.get('priority');
				var selectedRecord = mainGrid.getSelection()[0];
				if (selectionCount == 1 &&
					priority == 2 && 
					ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserEditDocPermission(record))
				{
					flagIsHidden = false;
					flagIsDisabled = false;
				}
				else if ((priority == 2 && selectionCount != 1) ||
						(priority >= 3 && priority <= 5))
				{
					flagIsHidden = false;
					flagIsDisabled = true;
				}
 			}
 		}
 		
		if (flagIsHidden != null)
 		{
			var isHidden = flagIsHidden == 1;
			if ((isHidden && !this.isHidden()) ||
				(!isHidden && this.isHidden()))
 			{
				this.setHidden(isHidden);
 			}
 		}
		if (flagIsDisabled != null)
 		{
			var isDisabled = flagIsDisabled == 1;
			if ((isDisabled && !this.isDisabled()) ||
				(!isDisabled && this.isDisabled()))
 			{
				this.setDisabled(isDisabled);
 			}
 		}	
		
		this.callParent(arguments);
	}
});