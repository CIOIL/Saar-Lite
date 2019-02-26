Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocLastDocsMenuItem', {
	requires: ['ExtDoc.views.extfavoritestoolbar.ExtDocLastDocsMenuItemController'],
	controller: 'lastDocsController',
	extend: 'Ext.menu.Item',
	icon: 'images/Icon_Last_Documents_18.png',
	text: ExtDoc.locales.ExtDocLocaleManager.getText("recent_documents"),
	listeners:{
		click: 'showLastDocs'
	},
	initComponent: function(){
		ExtDoc.utils.ExtDocComponentManager.registerComponent('lastDocsMenuItem', this);
		this.callParent(arguments);
	}
});