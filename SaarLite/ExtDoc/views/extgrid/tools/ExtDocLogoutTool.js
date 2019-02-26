Ext.define('ExtDoc.views.extgrid.tools.ExtDocLogoutTool', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocLogoutController' ],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'logoutMenuController',
	listeners: {
		click: 'logoutMenuClick'
	},
	initTool: function() {
		this.setIcon('images/exit_icon.png');
		this.setTooltip(ExtDoc.locales.ExtDocLocaleManager.getText('logout'));
	},
	updateTool: function(priority,record,selected){
		if ('kerberos' === ExtDoc.config.ExtDocConfig.authenticationType
				 && 'false' === ExtDoc.config.ExtDocConfig.kerberosDisplayDocbases){
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
			if(!this.isHidden())
			{
				this.setHidden(true);
			}
		} else {
			if (this.isDisabled())
			{
				this.setDisabled(false);
			}
			if(this.isHidden())
			{
				this.setHidden(false);
			}
		}
		
	}
});