Ext.define('ExtDoc.tools.controllers.ExtDocVersionsController', {
	requires: [ 'ExtDoc.views.extversionswindow.ExtDocVersionsWindow' ],
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.versionsController',


	versionsAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;

		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();

		if (selectedObjects.length == 1)
		{
			var selectedObjectType = selectedObjects.items[0].data.r_object_type;
			var selectedObject = selectedObjects.getAt(0);
			try
			{
				var versionsWindow = Ext.create('ExtDoc.views.extversionswindow.ExtDocVersionsWindow');
				versionsWindow.setWindowRecord(selectedObject);
				versionsWindow.initWindow('config/versionswindow/versions_window.json');
				versionsWindow.getWindowRecord().beginEdit();
			}
			catch (e)
			{
				versionsWindow.destroy();
				ExtDoc.utils.ExtDocUtils.showAlert('warning', 'properties_window_not_available');
			}
		}

	}
});