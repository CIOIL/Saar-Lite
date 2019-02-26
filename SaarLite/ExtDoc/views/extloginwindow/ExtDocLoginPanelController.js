Ext.define('ExtDoc.views.extloginwindow.ExtDocLoginPanelController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.panelLoginController',
	saveLoginInfo: function() {
		var username = "";
		var password = "";
		var docbase = "";
		var domain = "";

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

		var connectionString = username + ":" + password + ":" + domain + ":" + docbase;

		connectionString = ExtDoc.utils.ExtDocBase64.encode(connectionString);
		//var oneMinute = 1 * 60 * 1000; // one minute for test
		//var fifteenMinute = 15 * 60 * 1000; // fifteen minute for production
		var timeout = ExtDoc.config.ExtDocConfig.timeout * 60 * 1000;
		Ext.util.Cookies.set('basicAuth', Ext.util.Cookies.get('basicAuth'), new Date(new Date().getTime() + timeout));
		Ext.util.Cookies.set('authExpiration', new Date().getTime() + timeout);
		window.location.reload();
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
	}
});