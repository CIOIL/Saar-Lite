Ext.define('ExtDoc.views.extloginwindow.ExtDocLoginPanel', {
	requires: ['ExtDoc.views.extloginwindow.ExtDocLoginPanelController'],
	extend: 'Ext.form.Panel',
	controller: 'panelLoginController',
	region: 'center',
	collapsed: false,
	layout: 'fit',
	loginForm: null,
	viewModel:{
        type : 'extdocvm'
    },	
	listeners: {
		afterrender : 'setWindowRecord',
		saveLoginInfo: 'saveLoginInfo'
	},
	getObjectFather: function(){
		return this;
	},	
	initPanel: function(){
		this.buildPanel();
	},
	buildPanel: function(){
		var panel = this;
		
		this.loginForm = Ext.create('ExtDoc.views.extwindow.ExtDocPanel');
		this.loginForm.initPanel("config/loginform/login_panel.json");
		this.loginForm.setObjectFather(this);

		this.add(this.loginForm);
		
		var toolbar = Ext.create('Ext.toolbar.Toolbar',{dock:'bottom'});
		var buttonId = 'simple_button_' + ExtDoc.utils.ExtDocUtils.getRandomNumber();
		var button = Ext.create('Ext.button.Button',{
			id: buttonId,
			text: ExtDoc.locales.ExtDocLocaleManager.getText('login'),
			handler: function(){
				panel.fireEvent('saveLoginInfo');
			}
		});
		
		toolbar.add(button);
		this.addDocked(toolbar);
	}
});