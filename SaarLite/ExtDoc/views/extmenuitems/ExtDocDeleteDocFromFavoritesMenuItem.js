Ext.define('ExtDoc.views.extmenuitems.ExtDocDeleteDocFromFavoritesMenuItem', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocFavoritesMenuController' ],
	extend: 'ExtDoc.views.extmenuitems.ExtDocMenuItem',
	controller: 'favoritesMenuController',
	listeners: {
		click: 'deleteFromFavoritesMenuClick'
	},
	initItem: function() {
		this.text = ExtDoc.locales.ExtDocLocaleManager.getText(this.getToolConfig().get('label'));
	},
	prepareItemBeforeShow: function(record) {
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentLocation = mainGrid.getCurrentLocation();
		this.setHidden(false);
		this.setDisabled(false);
		if (currentLocation.data['r_object_type'] != 'favoritedocs')
		{
			this.setHidden(true);
			this.setDisabled(true);
			return;
		}
		if (Ext.isEmpty(record))
		{
			this.setHidden(true);
			this.setDisabled(true);
			return;
		}
		if (!record.get('user_subscribed'))
		{
			this.setHidden(true);
			this.setDisabled(true);
			return;
		}
	}
});