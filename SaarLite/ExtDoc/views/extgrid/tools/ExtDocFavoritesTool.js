Ext.define('ExtDoc.views.extgrid.tools.ExtDocFavoritesTool', {
	requires: ['ExtDoc.tools.controllers.ExtDocFavoritesMenuController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'favoritesMenuController',
	width: 24,
	height: 24,
	listeners: {
		click:'favoritesMenuClick'
	},
	initTool: function(){
		this.setIcon('images/Icon-Favorites.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('addtofavorites'));
	},
	updateTool: function(priority,record,selected){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentLocation = mainGrid.getCurrentLocation();
		var objectType = currentLocation.get('r_object_type');

		if(Ext.isEmpty(record))
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if (this.isHidden())
			{
				this.setHidden(false);
			}
		}
		else if (currentLocation.get('r_object_id') != ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId() && currentLocation.get('r_object_type') != 'favoritedocs' && (ExtDoc.utils.ExtDocUtils.isFolder(record) || ExtDoc.utils.ExtDocUtils.isRecordDocument(record)))
		{
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}
			
			if (this.isHidden())
			{
				this.setHidden(false);
			}
		}
		else
		{
			if (!this.isDisabled())
			{	
				this.setDisabled(true);
			}
			
			if (this.isHidden())
			{
				this.setHidden(false);
			}
		}
		
		if (objectType == 'versions_folder')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			
			if (!this.isHidden())
			{
				this.setHidden(true);
			}
		}
	}
});