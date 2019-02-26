Ext.define('ExtDoc.tools.controllers.ExtDocClipboardMoveController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.clipboardMoveController',
	moveAction: function(){
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		mainView.mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'), 'loading');
		var currentLocationId = mainView.getMainGrid().getCurrentLocation().get('r_object_id');
		var selectedRecords = mainView.getMainGrid().getSelection();
		var ids = [];
		var addedFromIds = [];
		
		selectedRecords.forEach(function(record){
			var id = record.get('r_object_id');
			var addedFromId = record.get('added_to_clipboard_from_r_object_id');
			ids.push(id);
			addedFromIds.push(addedFromId);
		});
		
		var json = this.buildJson(ids, addedFromIds, currentLocationId);
		
		completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'os/moveobjects';
		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.onreadystatechange = function(e){
			if (this.readyState == 4 && this.status == 200)
			{
				var response = xhr.response;
				var errors = null;
				
				if (response && response.length > 0)
				{
					errors = JSON.parse(xhr.response);
				}
				
				var objectsToRemove = selectedRecords;
				
				if (errors && errors.length > 0)
				{
					var objectsToRemove = objectsToRemove.filter(function(objectToRemove){
						var objectToRemoveId = objectToRemove.get('r_object_id');
						var foundError = errors.filter(function(error){
							var errorId = error.properties.objectId;
							return objectToRemoveId == errorId; 
						});
						
						return foundError ? false : true; 
					});
				}
				
				var currentController = mainView;
				currentController.unmask();
				currentController.getMainGrid().getClipboardStore().remove(objectsToRemove);
				var clipboardMoveTitle = ExtDoc.locales.ExtDocLocaleManager.getText('move');
				var clipboardMoveWarning = ExtDoc.locales.ExtDocLocaleManager.getText(selectedRecords > 1 ? 'move_success_m' : 'move_success_s');
				var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
				var toastTimeout = errors && errors.length > 0 ? 30000 : ExtDoc.config.ExtDocConfig.toast_timeout;
				
				if (errors && errors.length > 0)
				{
					clipboardMoveWarning += ' ' + ExtDoc.locales.ExtDocLocaleManager.getText('partial') + '<br />' + ExtDoc.locales.ExtDocLocaleManager.getText('clipboard_warning');
					
					for (var i = 0; i < errors.length; i++)
					{
						var number = i + 1;
						var error = errors[i];
						var eDesc = ExtDoc.locales.ExtDocLocaleManager.getText(error.properties.error);
						var eDocName = error.properties.objectName;
						clipboardMoveWarning += '<br />' + number + '. ' + eDesc + ': ' + eDocName;
					}
				}
				
				Ext.toast({
					autoCloseDelay: toastTimeout,
					html: clipboardMoveWarning,
					title: clipboardMoveTitle,
					rtl: toastRtl
				});
			}
			else if (this.readyState == 4 && this.status == 400)
			{
				var currentController = mainView;
				currentController.unmask();
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'servererror');
				return;
			}
		};
		xhr.send(json);
	},
	buildJson: function (ids, addedFromIds, moveToId){
		var preJson = {
			"properties": {
				"objectIds": ids,
				"addedFromIds": addedFromIds,
				"moveToId": moveToId
			}
		}
		var json = Ext.JSON.encode(preJson);
		return json;
	}
});