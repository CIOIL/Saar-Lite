Ext.define('ExtDoc.views.extmanagefavoriteswindow.tools.ExtDocDeleteFavoriteToolController', {
    extend : 'Ext.app.ViewController',
	alias: 'controller.deleteFavoritesToolController',
	deleteFavorites: function(){
		var mfGrid = this.getView().getToolParent();
    	var selection = mfGrid.getSelectionModel().getSelection();

		mfGrid.getStore().remove(selection);		
	}
});