function Distribution()
{
	var url = ExtDoc.config.ExtDocConfig.restUrl + "content/read/";
	this.openDocument = function(){checkLogin(checkApplet);}

	function checkApplet(isLoggedIn)
	{
		if (!isLoggedIn)
		{
			ExtDoc.utils.ExtDocLoginHandler.handleLogin();
			return;
		}

		var useAppletCookie = Ext.util.Cookies.get("useAppletCookie");
		
		if (useAppletCookie && useAppletCookie == "1")
		{
			addApplet();
			var applet = document.getElementById('fileApplet');
		}
		
		if (applet)
		{
			openDocumentWithApplet(applet);
		}
		else
		{
			openDocumentWithBrowser();
		}
	}

	function openDocumentWithApplet(applet)
	{
		var completeUrl = url;
		var args = [];
		args.push("Read");
		args.push(completeUrl);
		args.push(ExtDoc.utils.ExtDocLoginHandler
				.getAuthorizationHeaderString());
		args.push(buildJson([ rObjectId4Distribution ]));
		args.push('false');
		args.push(ExtDoc.config.ExtDocConfig.checkoutScheme);
		args.push(ExtDoc.config.ExtDocConfig.checkoutPath);
		args.push(ExtDoc.config.ExtDocConfig.authenticationType);

		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType)
		{
			var docbase;
			
			try
			{
				docbase = ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies
						.get('docbase'));
			}
			catch (error)
			{
				docbase = Ext.util.Cookies.get('docbase');
			}
			
			args.push(docbase);
		}
		
		sendEmptyRequest();
		applet.executeOperation(args);
		viewport.destroy();
		window.open('', '_self', ''); window.close();
	}

	function openDocumentWithBrowser()
	{
		var completeUrl = url;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler
				.getAuthorizationHeaderString());
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType',
				ExtDoc.config.ExtDocConfig.authenticationType);
		
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType)
		{
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64
					.decode(Ext.util.Cookies.get('docbase')));
		}
		
		xhr.responseType = 'blob';

		xhr.onreadystatechange = function(e){
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				var filename = ExtDoc.utils.ExtDocUtils.unicodeToText(xhr
						.getResponseHeader("Content-Disposition"));
				saveAs(xhr.response, filename);
				viewport.destroy();
				window.open('', '_self', ''); window.close();
			}
			else if (xhr.readyState == 4 && xhr.status == 401)
			{
				ExtDoc.utils.ExtDocLoginHandler.handleLogin();
			}
		};

		try
		{
			xhr.send(buildJson([ rObjectId4Distribution ]));
		}
		catch (error)
		{
			ExtDoc.utils.ExtDocLoginHandler.handleLogin();
		}
	}

	function checkLogin(callback)
	{
		var completeUrl = url;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler
				.getAuthorizationHeaderString());
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType',
				ExtDoc.config.ExtDocConfig.authenticationType);
		
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType)
		{
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64
					.decode(Ext.util.Cookies.get('docbase')));
		}
		
		xhr.responseType = 'blob';
		
		xhr.onreadystatechange = function(e){
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				callback(true);
			}
			else if (xhr.readyState == 4 && xhr.status == 401)
			{
				callback(false);
			}
		};
		
		xhr.send(buildJson([ rObjectId4Distribution ]));
	}

	function sendEmptyRequest() {
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'es/doNothing';
		var xhr = new XMLHttpRequest();
		xhr.open('GET', completeUrl, false);
		xhr.setRequestHeader('authenticationType',
				ExtDoc.config.ExtDocConfig.authenticationType);
		var docbase;
		try
		{
			docbase = ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies
					.get('docbase'));
		}
		catch (error)
		{
			docbase = Ext.util.Cookies.get('docbase');
		}
		
		xhr.setRequestHeader('docbase', docbase);
		xhr.send();
	}
}

function buildJson(objectIds) {
	var preJson = {
		"properties" : {
			"docIds" : objectIds
		}
	};
	var json = Ext.JSON.encode(preJson);
	return json;
}

Distribution.distribution;

Distribution.getInstance = function() {
	if (!Distribution.distribution)
	{
		Distribution.distribution = new Distribution();
	}
	
	return Distribution.distribution;
}