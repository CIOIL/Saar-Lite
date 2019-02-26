Ext.define('ExtDoc.tools.controllers.ExtDocCheckinController', {
	requires: [ 'ExtDoc.views.extcheckinwindow.ExtDocCheckinWindow' ],
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.checkinController',
	nextMinor: "1",
	nextMajor: "0",
	sameVersion: "2",
	checkinNextMinor: function(){
		this.checkin(this.nextMinor);
	},
	checkinSameVersion: function(){
		this.checkin(this.sameVersion);
	},
	checkin: function(versionPolicy) {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();

		if (selectedObjects.length == 1)
		{
			var selectedObject = selectedObjects.getAt(0);
			var lockByMe = selectedObject.get('locked_by_me');

			if (lockByMe)
			{
				var appletError = '';

				var applet = document.getElementById('fileApplet');
				if (applet && BrowserDetectorFactory.getBrowserDetector().isIE())
				{
					var r_object_id = selectedObject.get('r_object_id');
					var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/checkinWVP/";

					var args = [];
					args.push("Checkin");
					args.push(completeUrl);
					args.push(ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
					args.push(r_object_id);
					args.push(ExtDoc.config.ExtDocConfig.checkoutScheme);
					args.push(ExtDoc.config.ExtDocConfig.checkoutPath);
					args.push(ExtDoc.config.ExtDocConfig.authenticationType);
					var docBase = "";
					
					if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType)
					{
						docBase = ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase'));
					}
					
					args.push(docBase);
					args.push(versionPolicy);
					
					try
					{
						if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
							this.sendEmptyRequest();
						}
						var newRobjectId = applet.executeOperation(args);
						if (newRobjectId && newRobjectId.indexOf('error') == -1)
						{
							var objectName = selectedObject.get('object_name');
							selectedObject.set('object_name', objectName.replace('\"', ''));
							selectedObject.set('r_object_id', newRobjectId);
							selectedObject.set('r_lock_owner', "");
							selectedObject.set('locked_by_me', null);
							this.resolveNewObjectLabel(selectedObject);
							var grid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
							grid.getStore().load();
							/*
							var editViewQuery = Ext.ComponentQuery.query('[anchor="editView"]');
							var editView = editViewQuery[0];
							editView.setDisabled(false);
							grid.selectedArray[3] = grid.selectedArray[3]-1;
							grid.selectedArray[2] = grid.selectedArray[2]+1;
							
							Ext.ComponentQuery.query('[anchor="emailView"]')[0].setDisabled(false);
							Ext.ComponentQuery.query('[anchor="changeContentView"]')[0].setDisabled(false);
							Ext.ComponentQuery.query('[anchor="deleteView"]')[0].setDisabled(false);
							*/
							
							return;
						}
						else
						{
							appletError = 'File not found in default location. Please choose file manually.';
						}
					}
					catch (error)
					{
						console.log(error.message + ' !!Attention. Fix it!!');
						//appletError = error.message;
					}
				}
				
				var checkinWindow = Ext.create('ExtDoc.views.extcheckinwindow.ExtDocCheckinWindow');
				var objectName = selectedObject.get('object_name');
				selectedObject.set('object_name', objectName.replace('\"', ''));
				checkinWindow.setWindowRecord(selectedObject);
				checkinWindow.initWindow("config/checkinform/checkin_form.json");
				
				if (appletError.length > 0)
				{
					var worker = setInterval(function() {
						if (checkinWindow.tabbar)
						{
							checkinWindow.getFieldByName('file').markInvalid(ExtDoc.locales.ExtDocLocaleManager.getText('file_not_found'));
							clearInterval(worker);
						}
					}, 100);
				}
			}
		}
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