Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocNewFolderButton', {
	requires: ['ExtDoc.views.extfavoritestoolbar.ExtDocNewFolderButtonController'],
	extend: 'Ext.button.Button',
	controller: 'newFolderButtonController',
	icon: 'images/new_folder.png',
	listeners:{
		click: 'newDocAction'
	},
	initComponent: function(){
		this.callParent(arguments);
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText("new_folder"));
	}
});