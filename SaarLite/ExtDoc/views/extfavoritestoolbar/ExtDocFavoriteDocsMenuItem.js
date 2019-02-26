Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocFavoriteDocsMenuItem', {
	requires: ['ExtDoc.views.extfavoritestoolbar.ExtDocFavoriteDocsMenuItemController'],
	controller: 'favoriteDocsController',
	extend: 'Ext.menu.Item',
	icon: 'images/icons/subscriptions.gif',
	text: ExtDoc.locales.ExtDocLocaleManager.getText("favorite_documents"),
	listeners:{
		click: 'showFavoriteDocs'
	},
	initComponent: function(){
		ExtDoc.utils.ExtDocComponentManager.registerComponent('favdocsbutton', this);
		this.callParent(arguments);
	}
});