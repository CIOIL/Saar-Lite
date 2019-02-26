Ext.define('ExtDoc.config.ExtDocSettings', {
	requires  : ['ExtDoc.utils.ExtDocAjax','ExtDoc.locales.ExtDocLocaleManager'],
    singleton: true,
    init: function(){
		ExtDoc.utils.ExtDocAjax.initAjax();
		ExtDoc.locales.ExtDocLocaleManager.initLanguage();
		ExtDoc.utils.ExtDocLoginHandler.initLoginHandler();
	}
});