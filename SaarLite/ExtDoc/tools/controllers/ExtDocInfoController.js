Ext.define('ExtDoc.tools.controllers.ExtDocInfoController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.infoMenuController',
	infoMenuClick: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
	   
		var window = Ext.create('ExtDoc.views.extinfowindow.ExtDocInfoWindow');
		window.setWindowRecord(this.getNewDocRecord());
		window.initWindow("config/infowindow/info_window.json");
		window.setObjectFather(this.getView().getToolParent());
	}, 
	getNewDocRecord: function() {
		var docRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');

		docRecord.set('version', ExtDoc.config.ExtDocConfig.version);
		var docbase;
		try {
			docbase = ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase'));
		} catch (error){
			docbase = Ext.util.Cookies.get('docbase');
		}
		docRecord.set('docbase', docbase);
		docRecord.set('url', ExtDoc.config.ExtDocConfig.url);
		docRecord.set('guide', ExtDoc.locales.ExtDocLocaleManager.getText('open'));
		

		return docRecord;
	}

});