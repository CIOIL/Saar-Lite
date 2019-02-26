Ext.define('ExtDoc.saar.tools.controllers.SaarLiteDistributionTool', {
    extend : 'Ext.app.ViewController',
	alias: 'controller.distributionController',
	initUrl: function(){
		this.setUrl(ExtDoc.config.ExtDocConfig.restUrl + "mail/create/");
	}
});