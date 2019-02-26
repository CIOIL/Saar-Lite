Ext.define('ExtDoc.messagebox.ExtDocAlert', {
	messageBox: null,
	show: function(titleKey, textKey, callback){
		var title = ExtDoc.locales.ExtDocLocaleManager.getText(titleKey);
		var text = ExtDoc.locales.ExtDocLocaleManager.getText(textKey);
		var okText = ExtDoc.locales.ExtDocLocaleManager.getText("ok");
		var rtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();

		Ext.override(Ext.window.MessageBox, {
			buttonText: {
				ok: okText
			}
		});

		this.messageBox = Ext.create('Ext.window.MessageBox', {
			rtl: rtl
		});

		this.messageBox.alert(title, text, function(btnText){
			if (btnText === "ok")
			{
				callback();
			}
		});
	}, 
	hide: function(){
		this.messageBox.hide();
	}
});