Ext.define('ExtDoc.views.extgrid.tools.ExtDocChangeContentTool', {
	requires: ['ExtDoc.tools.controllers.ExtDocChangeContentController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	anchor: 'changeContentView',
	dropzone: null,
	controller: 'changeContentController',
	listeners: {
		click:'changeContentAction'
	},
	initTool: function(){
		this.setIcon('images/Icon_Change_Content.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('change_content'));
	},
	updateTool: function(priority,record,selected){
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