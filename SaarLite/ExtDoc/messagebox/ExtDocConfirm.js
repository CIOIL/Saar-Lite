Ext.define('ExtDoc.messagebox.ExtDocConfirm', {
	show: function(titleKey, textKey, yesCallback, noCallback){
		var title = ExtDoc.locales.ExtDocLocaleManager.getText(titleKey);
		var text = ExtDoc.locales.ExtDocLocaleManager.getText(textKey);
		var noBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_no");
		var yesBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_yes");
		var confirmationRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();

		Ext.override(Ext.window.MessageBox, {
			buttonText: {
				yes: yesBtnText,
				no: noBtnText
			}
		});
		
		var messageBox = Ext.create('Ext.window.MessageBox', {
			rtl: confirmationRtl
		});
		
		messageBox.confirm(title, text, function(btnText){
			if (btnText === "no")
			{
				noCallback();
			} 
			else if (btnText === "yes")
			{
				yesCallback();
			}
		});
	}
});