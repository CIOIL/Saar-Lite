Ext.define('ExtDoc.utils.ExtDocAjax', {
	requires: [ 'ExtDoc.utils.ExtDocLoginHandler', 'ExtDoc.utils.ExtDocBase64' ],
	singleton: true,
	maskObject: null,
	getMaskObject: function() {
		if (Ext.isEmpty(this.maskObject))
		{
			return Ext.getBody();
		} else
		{
			return this.maskObject;
		}
	},
	setMaskObject: function(newMaskObject) {
		this.maskObject = newMaskObject;
	},
	getRequestHeaders: function(contentType) {
		//var headers = ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeader();
        var headers = {};
		if (!Ext.isEmpty(contentType))
		{
			headers['Content-Type'] = contentType;
		}
		
		if ('basic' === ExtDoc.config.ExtDocConfig.authenticationType){
			headers['authentication'] = ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString();
		}
		
		if ('kerberos' === ExtDoc.config.ExtDocConfig.authenticationType){
			headers['Authorization'] = 'Negotiate ';
			try {
				headers['docbase'] = ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase'));
				
			} catch (error){
				headers['docbase'] = null;
			}		
		}
		
		headers['authenticationType'] = ExtDoc.config.ExtDocConfig.authenticationType;

		return headers;
	},
	initAjax: function() {
		Ext.Ajax.setTimeout(1800000);
		Ext.override(Ext.data.proxy.Ajax, {
			timeout: 1800000
		});
		Ext.override(Ext.data.Connection, {
			timeout: 1800000
		});
		Ext.Ajax.on('beforerequest', this.beforerequest);
		Ext.Ajax.on('requestcomplete', this.requestcomplete);
		Ext.Ajax.on('requestexception', this.requestexception);
	},
	beforerequest: function() {
		//ExtDoc.utils.ExtDocAjax.getMaskObject().mask('...טוען', 'loading');
	},
	requestcomplete: function() {
		//ExtDoc.utils.ExtDocAjax.getMaskObject().unmask();
	},
	requestexception: function(iConnection, iResponse, iOptions) {
		if (0 == iResponse.status)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'servercommerror');
		} else if (401 == iResponse.status)
		{
			ExtDoc.utils.ExtDocLoginHandler.handleLogin();
		}

		ExtDoc.utils.ExtDocAjax.getMaskObject().unmask();
	}
});