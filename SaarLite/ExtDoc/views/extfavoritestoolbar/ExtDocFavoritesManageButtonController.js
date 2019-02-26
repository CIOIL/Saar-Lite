Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesManageButtonController', {
	requires: ['ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesWindow'],
	extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.favoritesManageController',
	manageFavorites: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		var mfWindow = Ext.create('ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesWindow');
		mfWindow.initMFWindow();
	}
});