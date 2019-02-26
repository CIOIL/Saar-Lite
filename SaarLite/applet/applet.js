function addApplet() {
	if (!BrowserDetectorFactory.getBrowserDetector().isIE())
	{
		return;
	}
	var fileApplet = document.getElementById('fileApplet');
	if (fileApplet)
	{
		return;
	}
	var app = document.createElement('applet');
	app.id = 'fileApplet';
	//app.name = 'fileApplet';
	app.archive = 'applet/FileApplet.jar';
	app.code = 'controller.FileManagerApplet.class';

	app.jnlp_href = "applet/applet.jnlp";
	document.getElementsByTagName('body')[0].appendChild(app);
	console.log('applet added');
}

function updateUseAppletState(appletState){
		var oneYear = 31556952000;
		Ext.util.Cookies.set( "useAppletCookie", appletState, new Date(new Date().getTime() + oneYear));
}

function useApplet(mainview){
	if (!BrowserDetectorFactory.getBrowserDetector().isIE())
	{
		return;
	}
	var useAppletCookie = Ext.util.Cookies.get("useAppletCookie");
	if(!useAppletCookie)
	{
		var confirmationTitle = ExtDoc.locales.ExtDocLocaleManager.getText("use_applet_title");
		var confirmationMessageText = ExtDoc.locales.ExtDocLocaleManager.getText("use_applet_message");
		var noBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_no");
		var yesBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_yes");
		var confirmationRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();

		Ext.override(Ext.window.MessageBox, {
			buttonText: {
				yes: yesBtnText,
				no: noBtnText
			}
		});
		
		var confirmApplet = Ext.create('Ext.window.MessageBox', {
			rtl: confirmationRtl
		});
		
		confirmApplet.confirm(confirmationTitle, confirmationMessageText, function(btnText){
			if (btnText === "no")
			{
				var checkbox = document.getElementById("useAppletCheckbox").checked;
				if (checkbox)
				{
					appletState = "0";
					updateUseAppletState(appletState);
				}
			} 
			else if (btnText === "yes")
			{
				addApplet();
				var checkbox = document.getElementById("useAppletCheckbox").checked;
				if (checkbox)
				{
					appletState = "1";
					updateUseAppletState(appletState);
				}
			}
		});
		
	}
	else if (useAppletCookie == "1")
	{
		//add applet
		addApplet();
	}
	else if (useAppletCookie == "0")
	{
		//don't add applet
	}
}
