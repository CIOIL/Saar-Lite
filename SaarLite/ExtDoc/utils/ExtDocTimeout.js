Ext.define('ExtDoc.utils.ExtDocTimeout', {
    singleton: true,
    timeout: ExtDoc.config.ExtDocConfig.timeout * 60 * 1000,
    alert: null,
    checkTimeout: function(){
    	var basicAuth = Ext.util.Cookies.get('basicAuth');
    	if (!basicAuth || basicAuth.length < 10 || ExtDoc.config.ExtDocConfig.authenticationType != 'basic'){
    		return;
    	}
    	var worker = setInterval(function() {
			var authExpiration = Ext.util.Cookies.get("authExpiration");
			var now = new Date().getTime();
			
			if (authExpiration < now || !basicAuth){				
				clearInterval(worker);	
				ExtDoc.utils.ExtDocTimeout.alert.hide();
			} else if (authExpiration < now + 5*60*1000 && ExtDoc.utils.ExtDocTimeout.alert == null){  //less then 5 minutes until timeout
				//show timeout happened window
				ExtDoc.utils.ExtDocTimeout.alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
				ExtDoc.utils.ExtDocTimeout.alert.show('timeout', 'connection_will_be_finished', ExtDoc.utils.ExtDocTimeout.extendAuthCookie);				
			}
		}, 0.2*60*1000);  //every 1 minutes
    }, 
    extendAuthCookie: function(){
    	//ExtDoc.utils.ExtDocTimeout.alert = null;
		Ext.util.Cookies.set('basicAuth', Ext.util.Cookies.get('basicAuth'), new Date(new Date().getTime() + ExtDoc.utils.ExtDocTimeout.timeout));
		Ext.util.Cookies.set('authExpiration', new Date().getTime() + ExtDoc.utils.ExtDocTimeout.timeout);
	},
	reload: function(){
		viewP.destroy();
		window.location.reload();
	}
});  