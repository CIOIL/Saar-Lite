Ext.define('ExtDoc.tools.controllers.ExtDocPropertiesController', {
	requires: [ 'ExtDoc.views.extpropertieswindow.ExtDocPropertiesWindow' ],
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.propertiesController',
	objectsToEdit: null,
	getObjectsToEdit: function() {
		return this.objectsToEdit;
	},
	propertiesAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;

		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();

		if (selectedObjects.length == 1)
		{
			var selectedObjectType = selectedObjects.items[0].data.r_object_type;
			var selectedObject = selectedObjects.getAt(0);
			try
			{
				var propWindow = Ext.create('ExtDoc.views.extpropertieswindow.ExtDocPropertiesWindow');
				propWindow.setWindowRecord(selectedObject);
				var configJsonUrl = "config/propertiesform/properties_" + selectedObjectType + ".json";
				propWindow.initWindow(configJsonUrl);
				propWindow.getWindowRecord().beginEdit();
			}
			catch (e)
			{
				propWindow.destroy();
				ExtDoc.utils.ExtDocUtils.showAlert('warning', 'properties_window_not_available');
			}
		}

	},

	unescapeHtml: function(propertiesWindow) {
		var worker = setInterval(function() {
			if (propertiesWindow.tabbar)
			{
				var objectNameField = propertiesWindow.getFieldByName('object_name');
				var senderNameField = propertiesWindow.getFieldByName('sender_name');
				
				if ((objectNameField && objectNameField.getValue().length > 0) && (senderNameField && senderNameField.getValue().length > 0))
				{
					var unescaped = new DOMParser().parseFromString(objectNameField.getValue(), "text/html").documentElement.textContent;
					objectNameField.setValue(unescaped);

					unescaped = new DOMParser().parseFromString(senderNameField.getValue(), "text/html").documentElement.textContent;
					senderNameField.setValue(unescaped);

					clearInterval(worker);
				}

			}
		}, 100);
	}
});