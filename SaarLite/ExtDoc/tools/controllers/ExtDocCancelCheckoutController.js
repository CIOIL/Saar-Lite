Ext.define('ExtDoc.tools.controllers.ExtDocCancelCheckoutController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.cancelCheckoutController',
	serviceMethod: "content/cancelCheckout/",
	getMainGrid: function() {
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		return mainGrid;
	},
	cancelCheckoutAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		
		var currentController = this;
		var mainGrid = this.getMainGrid();
		var selectedRecords = mainGrid.getSelection();
		var lockedByMe = this.selectedDocsLockedByMe(selectedRecords);
		if (selectedRecords && lockedByMe)
		{
			var is_new_document = this.isNewDocument(selectedRecords);
			var is_present_warning = this.isPresentWarning();
			if (is_new_document && is_present_warning)
			{
				var confirmationTitle = ExtDoc.locales.ExtDocLocaleManager.getText("cancel_checkout");
				var confirmationMessageText = ExtDoc.locales.ExtDocLocaleManager.getText("cancel_checkout_warning_message_text");
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
					var controller = currentController;
					if (btnText === "no")
					{

					} 
					else if (btnText === "yes")
					{
						var checkbox = document.getElementById("notPresentCancelCheckoutWarningCheckbox").checked;
						if (checkbox)
						{
							var oneYear = 31556952000;
							Ext.util.Cookies.set( "notPresentCancelCheckoutWarningCookie", "no", new Date(new Date().getTime() + oneYear));
						}
						controller.cancelCheckoutFromConfirm();
					}
				}, this);
			}
			else
			{
				this.cancelCheckoutFromConfirm();
			}
		}
	},
	selectedDocsLockedByMe: function(selectedRecords){
		var lockedByMe = true;
		for (var i; i< selectedRecords.length; i++)
		{
			if (!selectedRecords[i].get('locked_by_me'))
			lockedByMe = false;
			break;
		}
		return lockedByMe;
	},
	cancelCheckoutFromConfirm: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		
		var currentController = this;
		var mainGrid = this.getMainGrid();
		var docsToCancelCheckout = 0;		
		var selectedRecords = mainGrid.getSelection();
		for (var i = 0; i < selectedRecords.length; i++)
		{
			if (selectedRecords[i] && selectedRecords[i].get('locked_by_me'))
			{
				mainGrid.mask('', 'loading');
				var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + this.serviceMethod + selectedRecords[i].get('r_object_id');
				var applet = document.getElementById('fileApplet');
				if (applet && BrowserDetectorFactory.getBrowserDetector().isIE())
				{
					try
					{
						var args = [];
						args.push("CancelCheckout");
						args.push(completeUrl);
						args.push(ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
						args.push(selectedRecords[i].get('r_object_id'));				
						args.push(ExtDoc.config.ExtDocConfig.checkoutScheme);
						args.push(ExtDoc.config.ExtDocConfig.checkoutPath);
						args.push(ExtDoc.config.ExtDocConfig.authenticationType);
						if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
							args.push(ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
						}
				
						if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
							this.sendEmptyRequest();
						} 
						applet.executeOperation(args);
											
					}
					catch (e)
					{
						mainGrid.unmask();
						///alert to client
						ExtDoc.utils.ExtDocUtils.showAlert('cancel_checkout', 'cancel_checkout_error');
						return;
					}
				}
			}
		}
		
		if (applet && BrowserDetectorFactory.getBrowserDetector().isIE())
		{
			var editViewQuery = Ext.ComponentQuery.query('[anchor="editView"]');
			var editView = editViewQuery[0];
			editView.setDisabled(false);
			mainGrid.unmask();
			
			if (mainGrid.getCurrentLocation().get('r_object_type') == 'lastdocs')
			{
				ExtDoc.utils.ExtDocComponentManager.getComponent('lastDocsMenuItem').fireEvent('click');
			}
			else if (mainGrid.getCurrentLocation().get('r_object_type') == 'favoritedocs')
			{
				ExtDoc.utils.ExtDocComponentManager.getComponent('favdocsbutton').fireEvent('click');
			}
			else
			{
				mainGrid.fireEvent('reloadCurrent');
			}
			return;		
		}

		for (var i = 0; i < selectedRecords.length; i++)
		{
			completeUrl = ExtDoc.config.ExtDocConfig.restUrl + this.serviceMethod + selectedRecords[i].get('r_object_id');
			var xhr = new XMLHttpRequest();
			xhr.open('POST', completeUrl, true);
			xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
			xhr.setRequestHeader('Authorization', '');
			xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
			if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
				xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			}
			xhr.onreadystatechange = function(e){
				var mainGrid = currentController.getMainGrid();
				///success
				if (this.readyState == 4 && this.status == 200)
				{
					docsToCancelCheckout++;
					//update grid
					if (docsToCancelCheckout==selectedRecords.length)
					{
						var editViewQuery = Ext.ComponentQuery.query('[anchor="editView"]');
						var editView = editViewQuery[0];
						editView.setDisabled(false);
						mainGrid.unmask();
						
						if (mainGrid.getCurrentLocation().get('r_object_type') == 'lastdocs')
						{
							ExtDoc.utils.ExtDocComponentManager.getComponent('lastDocsMenuItem').fireEvent('click');
						}
						else
						{
							mainGrid.fireEvent('reloadCurrent');
						}
					}
				}
				///failure
				else if (this.readyState == 4 && this.status == 400)
				{
					docsToCancelCheckout++;
					if (docsToCancelCheckout==selectedRecords.length)
					{
						mainGrid.unmask();
						///alert to client
						ExtDoc.utils.ExtDocUtils.showAlert('cancel_checkout', 'cancel_checkout_error');
						return;
					}
				}
			};
			xhr.send();
		}
	},
	isNewDocument: function(selectedRecords) {
		var is_new_document = false;
		
		bigloop:
		for (var i = 0; i < selectedRecords.length; i++)
		{
			var versionLabels = selectedRecords[i].get('r_version_label');
			if (versionLabels && Array.isArray(versionLabels))
			{
				for (var index in versionLabels)
				{
					if (versionLabels[index] == '_NEW_')
					{
						is_new_document = true;
						break bigloop;
					}
				}
			}
		}
		return is_new_document;
	},
	isPresentWarning: function() {
		var is_present_warning = true;
		var not_present_cancel_checkout_warning_cookie = Ext.util.Cookies.get("notPresentCancelCheckoutWarningCookie");
		if(not_present_cancel_checkout_warning_cookie)
		{
			is_present_warning = false;
		}
		return is_present_warning;
	}
});