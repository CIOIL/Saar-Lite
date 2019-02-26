Ext.define('ExtDoc.tools.controllers.ExtDocLogoutController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.logoutMenuController',
	logoutMenuClick: function() {
		this.saveCurrentLocation();
		document.cookie = 'basicAuth=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'docbase=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		window.location.reload();
	}
});