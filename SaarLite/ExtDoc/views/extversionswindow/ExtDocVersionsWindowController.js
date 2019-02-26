Ext.define('ExtDoc.views.extversionswindow.ExtDocVersionsWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowVersionsController',
	close: function(){
		this.closeView();
	}
});