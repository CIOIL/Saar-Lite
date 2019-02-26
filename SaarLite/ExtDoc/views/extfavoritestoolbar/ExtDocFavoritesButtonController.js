Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesButtonController', {
	extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.favoritesButtonController',
	favoritesToolbarButtonClick: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		mainGrid.getSelectionModel().clearSelections();
		ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').changeLocation(this.getView().getRecord(),'favorites');
		mainGrid.fireEvent('updateToolBars',-1,null,false);
	}
});