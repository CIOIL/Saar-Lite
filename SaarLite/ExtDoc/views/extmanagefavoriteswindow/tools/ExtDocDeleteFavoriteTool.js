Ext.define('ExtDoc.views.extmanagefavoriteswindow.tools.ExtDocDeleteFavoriteTool', {
	requires: ['ExtDoc.views.extmanagefavoriteswindow.tools.ExtDocDeleteFavoriteToolController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'deleteFavoritesToolController',
	initTool: function(){
		this.text = "<img src = 'images/Icon-X-Red.png' title = '" + ExtDoc.locales.ExtDocLocaleManager.getText('delete_text') + "'>";
	},	
	listeners: {
		click: 'deleteFavorites'
	},
	updateTool: function(priority,record,selected){
		var manageFavoritesGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('manage_favorites_grid');
		
		if(!manageFavoritesGrid.isSelectedArrayEmpty())
		{
			this.setDisabled(false);
		}
		else
		{
			this.setDisabled(true);
		}
	}
});