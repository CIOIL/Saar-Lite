Ext.define('ExtDoc.tools.controllers.ExtDocChangeContentController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.changeContentController',
	getMainGrid: function() {
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		return mainGrid;
	},
	changeContentAction: function() {
		var loggedIn = this.checkLogin();
		if(!loggedIn)return;
		
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var selectedRecord = mainView.getMainGrid().getSelection()[0];
		if (ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserEditDocPermission(selectedRecord))
		{
			ChangeContent = true;
			mainView.getDropZone().setCollapsed(false);
			mainView.getMainGrid().mask();
			var changeContentTitle = ExtDoc.locales.ExtDocLocaleManager.getText('change_content');
			var contentChangeWarning = ExtDoc.locales.ExtDocLocaleManager.getText('change_content_window_header');
			var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
			var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
			Ext.toast({
					autoCloseDelay: toastTimeout,
    				html: contentChangeWarning,
   					title: changeContentTitle,
     				rtl: toastRtl
 				});
		}
		else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','upload_change_content_window_write_permit_error');
		}
	}
});