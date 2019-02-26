Ext.define('ExtDoc.utils.ExtDocLoginHandler', {
	extend: 'Ext.Component',
	requires: ['ExtDoc.locales.ExtDocLocaleManager'],
	singleton: true,
	loginWindow: null,
	authenticationType: null,
	defaultUserName: null,
	handleLogin: function() {
		if ('kerberos' === ExtDoc.config.ExtDocConfig.authenticationType){
			this.kerberosLogin();
		} else {
			this.basicLogin();
		}
		
	},
	getAuthorizationType: function() {
		return this.authenticationType;
	},
	setAuthorizationType: function(authenticationType) {
		this.authenticationType = authenticationType;
	},
	getDefaultUserName: function() {
		return this.defaultUserName;
	},
	setDefaultUserName: function(defaultUserName) {
		this.defaultUserName = defaultUserName;
	},
	basicLogin: function() {
		this.setAuthorizationType("basic");

		if (Ext.isEmpty(this.loginWindow))
		{
			this.loginWindow = Ext.create('ExtDoc.views.extloginwindow.ExtDocLoginWindow');
			this.loginWindow.initWindow("config/loginform/login_form.json");
		}
	},
	kerberosLogin: function() {
		this.setAuthorizationType("kerberos");
        
		if ('true' === ExtDoc.config.ExtDocConfig.kerberosDisplayDocbases){
			if (Ext.isEmpty(this.loginWindow))
			{
				this.loginWindow = Ext.create('ExtDoc.views.extloginwindow.ExtDocKerberosLoginWindow');
				this.loginWindow.initWindow("config/loginform/kerberos_login_form.json");
			}
		} else {
			var docbase = ExtDoc.utils.ExtDocBase64.encode( ExtDoc.config.ExtDocConfig.kerberosDocbase);
			Ext.util.Cookies.set ('docbase', docbase);
			if (isDistribution)
			{
				Distribution.getInstance().openDocument();
			} else
			{
				window.location.reload();
			}
		}
		
		
		

	},
	getAuthorizationHeader: function() {
		return {
			'authentication': this.getAuthorizationHeaderString()
		};
	},
	getAuthorizationHeaderString: function() {
		var authString = null;
		
		if (this.getAuthorizationType() == 'kerberos'){
			return 'kerberos';
		}

		if (this.getAuthorizationType() == 'basic')
		{
			var authCookie = Ext.util.Cookies.get('basicAuth');
			if (authCookie == null)
			{
				authString = "";
			} else
			{
				authString = "Basic " + Ext.decode(Ext.util.Cookies.get('basicAuth'));
				//renew cookie
				Ext.util.Cookies.set('basicAuth', Ext.util.Cookies.get('basicAuth'), new Date(new Date().getTime() + ExtDoc.utils.ExtDocTimeout.timeout));
				Ext.util.Cookies.set('authExpiration', new Date().getTime() + ExtDoc.utils.ExtDocTimeout.timeout);
			}
		} 
        if (this.getAuthorizationType() == 'govsc')
		{
			authString = "govsc";
		}

		return authString;
	},
	getUserName: function() {
		var userName = null;

		if (this.getAuthorizationType() == 'basic')
		{
			var loginString = ExtDoc.utils.ExtDocBase64.decode(Ext.decode(Ext.util.Cookies.get('basicAuth')));
			var loginStringSplit = loginString.split(':');

			userName = loginStringSplit[0];
		}
		else //govsc or kerberos
		{
			userName = this.getDefaultUserName();
		}

		return userName;
	},
	initComponent: function(){
		this.initLoginHandler();
		this.callParent();
	},
	initLoginHandler: function() {
		this.setAuthorizationType(ExtDoc.config.ExtDocConfig.authenticationType);
		this.setDefaultUserName(ExtDoc.locales.ExtDocLocaleManager.getText('you'));
	}
});