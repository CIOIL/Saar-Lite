Ext.define('ExtDoc.utils.ExtDocVaLoader',{
	extend: 'Ext.Component',
	requires: ['ExtDoc.utils.ExtDocLoginHandler'],
	singleton: true,
	va: null,
	loadVa: function (){
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "va/allva";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			var docbase;
			try {
				docbase = ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies
						.get('docbase'));
			} catch (error) {
				docbase = Ext.util.Cookies.get('docbase');
			}
			xhr.setRequestHeader('docbase', docbase);
			xhr.setRequestHeader('Authorization', '');
		}

		xhr.setRequestHeader('Content-Type', 'application/json');	
		xhr.onreadystatechange = function(){
			if (xhr.readyState == XMLHttpRequest.DONE)
			{
				if (xhr.status == 200)
				{
					ExtDoc.utils.ExtDocVaLoader.va = JSON.parse(xhr.response);
				}
				else if (xhr.status == 400)
				{
					
				}
			}
		};
		xhr.send();
	},
	initComponent: function(){
		this.loadVa();
		this.callParent();
	}
});