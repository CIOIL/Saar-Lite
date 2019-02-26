Ext.define('ExtDoc.tools.controllers.ExtDocAbstractActionController', {
	extend: 'Ext.app.ViewController',

	checkLogin: function(){
		if (ExtDoc.config.ExtDocConfig.authenticationType === 'basic')
		{
			var basicAuthCookie = Ext.util.Cookies.get('basicAuth');
			if (!basicAuthCookie || basicAuthCookie.length < 10)
			{
				this.saveCurrentLocation();
				var alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
				alert.show('timeout', 'connection_finished', this.reload);
				//this.reload();
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	},
	reload: function(){
//		viewP.destroy();
//		window.location.reload();
		ExtDoc.utils.ExtDocLoginHandler.handleLogin();
	},
	saveCurrentLocation: function(){
		ExtDoc.utils.ExtDocLocation.saveLocation();
	},
	sendEmptyRequest: function(callback) {
		var abstractController = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'es/doNothing';
		var authorized = false;
		var requestAttemptsNumber = 0; 
        while (!authorized){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', completeUrl, false);
			xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
			xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
			xhr.setRequestHeader('cache-control', 'max-age=0');
			xhr.setRequestHeader('expires', '0');
			xhr.setRequestHeader('expires', new Date());
			xhr.setRequestHeader('pragma', 'no-cache');
			var docbase;
			try
			{
				docbase = ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase'));
			} catch (error)
			{
				docbase = Ext.util.Cookies.get('docbase');
			}
			xhr.setRequestHeader('docbase', docbase);
			xhr.onreadystatechange = function(e) {
				if (this.readyState == 4 && this.status == 200)
				{
					authorized = true;				
				}
			}
			xhr.send();
			requestAttemptsNumber++;
			if (requestAttemptsNumber > 100){
				var alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
				alert.show('error', 'servererror', this.reload);				
			}
        }
		// save location
		this.saveCurrentLocation();
	},
	getMainGrid: function() {
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		return mainGrid;
	}
	
})