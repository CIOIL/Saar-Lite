Ext.define('ExtDoc.views.extlocationwindow.ExtDocLocationWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowLocationController',
	saveWindowAction: function(){
		//get new locations from toolbar and set the properties window's location field
		this.getView().getObjectFather().setObjectLocations(this.getView().getMainGrid().getCurrentLocations());
		this.getView().destroy();
	}
});