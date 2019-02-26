Ext.define('ExtDoc.tools.controllers.ExtDocRefreshController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.refreshMenuController',
	refreshMenuClick: function() {
		this.saveCurrentLocation();
		this.reload();
	},
	reload: function(){
		viewP.destroy();
		window.location.reload();
	}
});