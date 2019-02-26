Ext.define('ExtDoc.views.exttitlebarpanel.ExtDocAdvSearchTool', {
	requires: ['ExtDoc.views.exttoolbar.ExtDocTool', 'Ext.data.Record', 'ExtDoc.utils.ExtDocLimitedAccess'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	style: 'padding:2px;',
	anchor: 'advSearchView',
	id: 'advsearchtool',
	text: ExtDoc.locales.ExtDocLocaleManager.getText('advanced_search'),
	handler: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		
		var limitedAccess = ExtDoc.utils.ExtDocLimitedAccess.checkLimitedAccess();
		if (limitedAccess)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','action_not_allowed_error');
			return;
		}
		
		var advSearchWindow = Ext.create('ExtDoc.views.extadvsearchwindow.ExtDocAdvSearchWindow');
        advSearchWindow.setObjectFather(this);
		//create a WindowRecord, that is needed by ExtDocComboField fields to be initialized 
		advSearchWindow.setWindowRecord(this.getNewDocRecord());
        advSearchWindow.initWindow("config/advsearchform/advsearch_form.json");
	},
	getNewDocRecord: function(){
		var docRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		var currentFolderRecord = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').getCurrentLocation();
		var unit_id = currentFolderRecord.get('unit_id') ? currentFolderRecord.get('unit_id') : '-1';
		docRecord.set('unit_id', unit_id); // '-1' indicates to retreive all unit ids
		docRecord.set('r_object_type',ExtDoc.config.ExtDocConfig.autoUploadType);
		
		return docRecord;
	}, 
	checkLogin: function(){
		if (ExtDoc.config.ExtDocConfig.authenticationType === 'basic')
		{
			var basicAuthCookie = Ext.util.Cookies.get('basicAuth');
			if (basicAuthCookie == null)
			{
				var alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
				alert.show('timeout', 'connection_finished', this.reload);
				//this.reload();
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	},
	reload: function(){
		viewP.destroy();
		window.location.reload();
	},
	initFormField: function(){
		this.setHidden(window.location.href.indexOf('saarFolderId') != -1 && ExtDoc.config.ExtDocConfig.allowLimitedAccess);
		this.callParent(arguments);
	}
});