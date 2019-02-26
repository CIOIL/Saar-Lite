Ext.define('ExtDoc.views.extinfowindow.ExtDocInfoWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowInfoController',
	close: function(){
		this.restoreDefaultDragOver();
		this.closeView();
	}
});