Ext.define('ExtDoc.tools.controllers.ExtDocDeleteController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.deleteController',
	objectsToDeleteArr: [],
	objectsNoDeletePermissions: "",
	getMainGrid: function() {
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		return mainGrid;
	},
	deleteAction: function() {	
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();
        var selectedObjectType = selectedObjects.items[0].data.r_object_type;
        
		if(selectedObjectType.indexOf('folder') > -1)
		{
			var selection = this.getMainGrid().getSelection();
			var obj = selection[0];
			var rObjectId = obj.data.r_object_id;
		   	var currentController = this;
		   	var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/hasItemsInFolder/" + rObjectId;

				Ext.Ajax.request({
					url: completeUrl,
					method: 'GET',
					headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
					success: function(response, opts){
						if(response.responseText == 'true')
						{
							var alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
							alert.show('delete_selected_docs', 'delete_items_in_folder_error', function(){});
						}
						else
						{
							currentController.confirmDeleteAction();
						}
					},
					failure: function(response, opts){
						ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
					}
				});
		}
		else
		{
			this.confirmDeleteAction();
		}
	},
	
	confirmDeleteAction: function()
	{
		var confirmationTitle = ExtDoc.locales.ExtDocLocaleManager.getText("delete_confirmation_title");
		var confirmationMessageText = ExtDoc.locales.ExtDocLocaleManager.getText("delete_confirmation_message_text");
		var noBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_no");
		var yesBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_yes");
		var confirmationRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();

		Ext.override(Ext.window.MessageBox, {
			buttonText: {
				yes: yesBtnText,
				no: noBtnText
			}
		});

		var confirmDelete = Ext.create('Ext.window.MessageBox', {
			rtl: confirmationRtl
		});

		confirmDelete.confirm(confirmationTitle, confirmationMessageText, function(btnText) {
			var currentController = this;
			if (btnText === "no")
			{

			} 
			else if (btnText === "yes")
			{
				var deleteViewQuery = Ext.ComponentQuery.query('[anchor="deleteView"]');
				currentController.deleteView = deleteViewQuery[0];
				currentController.deleteView.setDisabled(true);
				currentController.getView().mask('', 'loading');
				currentController.objectsToDeleteArr = [];
				currentController.objectsNoDeletePermissions = "";

				var selection = currentController.getMainGrid().getSelection();
				var userLoginName = ExtDoc.utils.ExtDocLoginHandler.getUserName();
							
				for (var i = 0; i < selection.length; i++) 
				{
					var obj = selection[i];
					var rObjectId = obj.data.r_object_id;

					if(ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserDeleteDocPermission(obj))
					{
						currentController.objectsToDeleteArr.push(rObjectId);
					}
					else
					{
						currentController.objectsNoDeletePermissions = currentController.objectsNoDeletePermissions.concat(obj.get('object_name')+"<br />");
					}
				}

				currentController.deleteObjects(currentController.objectsToDeleteArr, currentController.objectsNoDeletePermissions);
			}
		}, this);
	},
	deleteObjects: function(objectsToDeleteArr, objectsNoDeletePermissions) {

		var currentTool = this;
		currentTool.getMainGrid().mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'), 'loading');
		var json = this.buildDeleteJson(objectsToDeleteArr);
		if (objectsToDeleteArr.length != 0)
		{
			var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/delete/";
			Ext.Ajax.request({
				url: completeUrl,
				method: 'POST',
				headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
				success: function(response, opts) {
					currentTool.getMainGrid().initSelectionArray();
					currentTool.getMainGrid().unmask();
					currentTool.getView().unmask();
					if (objectsNoDeletePermissions != "")
					{
						currentTool.showNoDeletePermissionsError(objectsNoDeletePermissions);
					}
					currentTool.getMainGrid().fireEvent('reloadCurrent');
					var linkViewQuery = Ext.ComponentQuery.query('[anchor="linkView"]');
					var linkView = linkViewQuery[0];
					linkView.setDisabled(true);
				},
				failure: function(response, opts) {
					//Don't remove this console log
					console.log(response.responseText);
					currentTool.getMainGrid().unmask();
					currentTool.getView().unmask();
					currentTool.getView().setDisabled(false);
					ExtDoc.utils.ExtDocUtils.showAlert('error', 'delete_selected_docs_error');
					currentTool.getMainGrid().fireEvent('reloadCurrent');
				},
				jsonData: json
			});
		}
		else
		{
			currentTool.getMainGrid().unmask();
			currentTool.getView().unmask();
			if (objectsNoDeletePermissions != "")
			{
				this.showNoDeletePermissionsError(objectsNoDeletePermissions);
			}
		}
	},
	showNoDeletePermissionsError: function(objectsNoDeletePermissions){
		var alertTitle = ExtDoc.locales.ExtDocLocaleManager.getText('error');
		var alertText = ExtDoc.locales.ExtDocLocaleManager.getText('delete_selected_docs_no_permissions_error');
		alertText = alertText.concat('<br />' + objectsNoDeletePermissions);
		var alertRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		var message = Ext.create('Ext.window.MessageBox', {rtl: alertRtl, maxWidth: 0.8 * window.innerWidth});
		
		message.alert({
			title: alertTitle,
			msg: alertText
		});
	},
	buildDeleteJson: function(objectsToDeleteArr) {
		var preJson = {
			"properties": {
				"docIds": objectsToDeleteArr
			}
		};
		var json = Ext.JSON.encode(preJson);
		return json;
	}
});