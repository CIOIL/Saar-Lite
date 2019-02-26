Ext.define('ExtDoc.tools.controllers.ExtDocAddRemoveCoulmnsController', {
	requires: ['ExtDoc.views.extcolumnselectorwindow.ExtDocColumnsSelectorWindow'],
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.addremovecontroller',
	selectedObject: null,
	selectedObjectId: null,
	objectLocations: null,
	folderId: null,
	addAndRemoveAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		
		this.createColumnSelectorWindow();
	},
	createColumnSelectorWindow: function() {
		var columnSelectorWindow = Ext.create('ExtDoc.views.extcolumnselectorwindow.ExtDocColumnsSelectorWindow');
		columnSelectorWindow.initColumnSelectorWindow();
	
	},
});