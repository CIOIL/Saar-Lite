Ext.define('ExtDoc.views.extgrid.tools.ExtDocBackTool', {
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	initTool: function(){
		this.setIcon('images/Icon-Back.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('back'));
	},	
	handler: function(){
		this.getToolParent().fireEvent('backclick');
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		var objectType = currentFolderRecord.data['r_object_type'];
		
		if( objectType == 'dm_cabinet' || Ext.isEmpty(objectType))
		{
			if (!this.isDisabled())
			{	
				this.setDisabled(true);
			}
		}
/*		if(Ext.isEmpty(record))
		{
			this.setDisabled(true);
		}
		else if(record.get('r_object_type') != 'dm_cabinet')
		{
			this.setDisabled(false);
		}*/
//	  this.callParent(arguments);
	}
});