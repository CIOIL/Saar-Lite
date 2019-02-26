Ext.define('ExtDoc.views.extloginwindow.ExtDocLoginWindowController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.windowLoginController',
	saveWindowAction: function() {
		var username = "";
		var password = "";
		var docbase = "";
		var domain = "";
		var remember_me = "";

		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.username))
		{
			username = this.getView().getViewModel().getData().rec.data.username;
		}

		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.password))
		{
			password = this.getView().getViewModel().getData().rec.data.password;
		}

		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.docbase))
		{
			docbase = this.getView().getViewModel().getData().rec.data.docbase;
		}

		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.domain))
		{
			domain = this.getView().getViewModel().getData().rec.data.domain;
		}
		
		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.remember_me))
		{
			remember_me = this.getView().getViewModel().getData().rec.data.remember_me;
		}

		var connectionString = username + ":" + password + ":" + domain + ":" + docbase;

		connectionString = ExtDoc.utils.ExtDocBase64.encode(connectionString);
		//below is related to remember_me checkbox, currently commented out
//		if (remember_me){
//			ExtDoc.utils.ExtDocTimeout.timeout = ExtDoc.config.ExtDocConfig.remember_me_timeout * 60 * 60 * 1000;		
//		} else {
//			ExtDoc.utils.ExtDocTimeout.timeout = ExtDoc.config.ExtDocConfig.timeout * 60 * 1000;
//		}
		ExtDoc.utils.ExtDocTimeout.timeout = ExtDoc.config.ExtDocConfig.timeout * 60 * 1000;
		Ext.util.Cookies.set('basicAuth', Ext.encode(connectionString), new Date(new Date().getTime() + ExtDoc.utils.ExtDocTimeout.timeout));		
		Ext.util.Cookies.set('authExpiration', new Date().getTime() + ExtDoc.utils.ExtDocTimeout.timeout);
		
		Ext.util.Cookies.set ('docbase', docbase);
		
		this.closeView();
		if (isDistribution)
		{
			Distribution.getInstance().openDocument();
		} else
		{
			window.location.reload();
		}
	},
	setWindowRecord: function() {
		var record = Ext.create('Ext.data.Record');
		
		if (Ext.util.Cookies.get('basicAuth') != null)
		{
			var loginString = ExtDoc.utils.ExtDocBase64.decode(Ext.decode(Ext.util.Cookies.get('basicAuth')));
			var loginStringSplit = loginString.split(':');

			record.set('username', loginStringSplit[0]);
			record.set('password', loginStringSplit[1]);
			record.set('domain', loginStringSplit[2]);

			if (!Ext.isEmpty(loginStringSplit[3]) && loginStringSplit[3] != 'null')
			{
				record.set('docbase', loginStringSplit[3]);
			}
			
			
		}

		this.getView().getViewModel().setData({
			rec: record
		});
		this.getView().toggleMaximize();
		
		//set Default Repository in login screen dropdown
		var field = this.view.tabbar.tbPanels[0].items.items[3];
		var store = field.getStore();
		store.on("load", function(){
			try
			{
				store.storeField.setValue(store.data.items[0].data.value);
			}
			catch (e)
			{
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'docbase_not_available');
			}
		});
		
		//wrong password error presentation
		if(loginStringSplit && loginStringSplit.length > 1)
		{
			var login_error = ExtDoc.locales.ExtDocLocaleManager.getText('login_error');
			record.set('username', login_error);
			var usernameInput = Ext.dom.Query.select('input[name="username"]')[0];
			usernameInput.style.color="red";
			usernameInput.style.fontWeight="bold";
			usernameInput.addEventListener("click", function(){usernameInput.value=""; usernameInput.style.color="black"; usernameInput.style.fontWeight="normal";});
		}
	}
});