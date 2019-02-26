Ext.define('ExtDoc.tools.controllers.ExtDocMailController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.mailMenuController',
	objectIds: [],
	errorMessage: "",
	lockedDocsArray: [],
	lockedDocsError: "",
	mailMenuClick: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
	   
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObjects = mainGrid.getSelectionModel().getSelected();
		
		this.objectIds = [];
		this.errorMessage = "";
		this.lockedDocsError = "";
		this.lockedDocsArray = [];
		
		for (var index = 0; index < selectedObjects.length; index++)
		{
			var selectedObject = selectedObjects.getAt(index);

			if (this.hasPermissions(selectedObject))
			{
				if (!Ext.isEmpty(selectedObject.get('a_content_type')))
				{
					this.objectIds.push(selectedObject.get('r_object_id'));
				}
			}
		}
		
		if (this.errorMessage != "")
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'email_permissions_error', this.errorMessage);
		}
		if (this.objectIds.length == 0)
		{
			return;
		}
		
		if (this.lockedDocsArray.length!=0)
		{
			var confirmationTitle = ExtDoc.locales.ExtDocLocaleManager.getText("email");
			var confirmationMessageText = ExtDoc.locales.ExtDocLocaleManager.getText("locked_doc_email_confirmation_message_text")+"<br />"+ ExtDoc.locales.ExtDocLocaleManager.getText("doclist") + this.lockedDocsError;
			var noBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_no");
			var yesBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_yes");
			var confirmationRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();

			Ext.override(Ext.window.MessageBox, {
				buttonText: {
					yes: yesBtnText,
					no: noBtnText
				}
			});

			var confirmLockedMail = Ext.create('Ext.window.MessageBox', {
				rtl: confirmationRtl,
				constrain: true
			});
			confirmLockedMail.confirm(confirmationTitle, confirmationMessageText, function(btnText) {
				currentController = this;
				if (btnText === "no")
				{
					for (var i = 0; i < currentController.lockedDocsArray.length; i++)
					{
						var index = currentController.objectIds.indexOf(currentController.lockedDocsArray[i]);
						if (index!=-1)
						{
							currentController.objectIds.splice(index, 1);
						}
					}
					if (currentController.objectIds.length == 0)
					{
						return;
					}
					
					var window = Ext.create('ExtDoc.views.extmailwindow.ExtDocMailWindow');
					window.setWindowRecord(currentController.getNewDocRecord());
					window.initWindow("config/mailwindow/mail_window.json");
					window.setObjectFather(currentController.getView().getToolParent());
					window.setObjectIds(currentController.objectIds);
				}
				else if (btnText === "yes")
				{
					var window = Ext.create('ExtDoc.views.extmailwindow.ExtDocMailWindow');
					window.setWindowRecord(currentController.getNewDocRecord());
					window.initWindow("config/mailwindow/mail_window.json");
					window.setObjectFather(currentController.getView().getToolParent());
					window.setObjectIds(currentController.objectIds);
				}
			}, this);
			
		}
		else
		{
			var window = Ext.create('ExtDoc.views.extmailwindow.ExtDocMailWindow');
			window.setWindowRecord(this.getNewDocRecord());
			window.initWindow("config/mailwindow/mail_window.json");
			window.setObjectFather(this.getView().getToolParent());
			window.setObjectIds(this.objectIds);
		}
	}, 
	getNewDocRecord: function() {
		var docRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		return docRecord;
	},
	hasPermissions: function(selectedObject) {
		var result = false;

		if (!ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserReadDocPermission(selectedObject))
		{
			this.errorMessage += ExtDoc.locales.ExtDocLocaleManager.getText('email_permission_single_error') + selectedObject.get('object_name') + "<br/>";
		}
		else if (ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserReadDocPermission(selectedObject) && selectedObject.get('r_lock_owner') != "")
		{
			if (!Ext.isEmpty(selectedObject.get('a_content_type')))
			{
				this.lockedDocsError += selectedObject.get('object_name') + "<br/>";
				this.lockedDocsArray.push(selectedObject.get('r_object_id'));
			}
			result = true;
		}
		else
		{
			result = true;
		}
		return result;
	}

});