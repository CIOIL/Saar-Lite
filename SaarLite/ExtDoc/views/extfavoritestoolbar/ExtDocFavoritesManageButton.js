Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesManageButton', {
	requires: ['ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesManageButtonController'],
	extend: 'Ext.button.Button',
	controller: 'favoritesManageController',
	icon:'images/Icon_Manage_Favorites.gif',
	listeners:{
		click: 'manageFavorites'
	},
	initComponent: function(){
		this.callParent(arguments);
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('manage_favorites'));
	}
});