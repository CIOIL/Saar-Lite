Ext.define('ExtDoc.views.extcheckinwindow.ExtDocCheckinWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowCheckinController',
	submitWindowToServer: function(){
		this.uploadContent();
	},
	uploadContent: function(){
		var fileField = this.getFieldByName('file');
		
		var currentController = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/checkinContent/" + this.getView().getWindowRecord().get('r_object_id');
		//var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/checkinWVP";
		
		var formData = new FormData();
		var xhr = new XMLHttpRequest();
		
		formData.append('file', fileField.fileInputEl.dom.files[0]);
		//formData.append('objectId', this.getView().getWindowRecord().get('r_object_id'));
		//formData.append('versionPolicy', '2'); //2 same, 1 minor, 0 major
		
		xhr.open('POST', completeUrl);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			xhr.setRequestHeader('Authorization', '');
		}
		
		var controler  = this;
		
		xhr.onloadend = function (evt){
			if(evt.target.status === 200)
			{
				currentController.getView().getWindowRecord().set('r_object_id',evt.target.responseText);
				currentController.getView().getWindowRecord().set('r_lock_owner',"");
				currentController.getView().getWindowRecord().set('locked_by_me',null);
				currentController.resolveNewObjectLabel(currentController.getView().getWindowRecord());
				
				controler.restoreDefaultDragOver();
				currentController.closeView();
				
				//reselect grid row
				var grid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
				grid.selectedArray[3] = grid.selectedArray[3]-1;
				grid.selectedArray[2] = grid.selectedArray[2]+1;
				if (grid != null) 
				{
					var selectionModel = grid.getSelectionModel();
					var selection = selectionModel.getSelection();
					var record = selection.length > 0 ? selection[0] : null;
					if (record != null) 
					{
						var rowIndex = grid.getStore().indexOf(record);
						selectionModel.deselect(rowIndex);
						selectionModel.select(rowIndex);
					}					
				}
			}
			else
			{
				currentController.getView().unmask();
				currentController.handleFailure(evt.target);
			}
		};

		xhr.send(formData);
		this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'),'loading');
	},
	resolveNewObjectLabel: function(selectedObject) {
		var versionLabels = selectedObject.get('r_version_label');
		if (versionLabels && Array.isArray(versionLabels))
		{
			for (var index in versionLabels)
			{
				if (versionLabels[index] == '_NEW_')
				{
					versionLabels.splice(index,1);
					break;
				}
			}
			selectedObject.set('r_version_label', versionLabels);
		}
	}
});