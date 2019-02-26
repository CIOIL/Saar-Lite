Ext.define('ExtDoc.views.extloginwindow.ExtDocKerberosLoginWindowController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.windowLoginController',
	saveWindowAction: function() {
		var docbase = "";
		var remember_me = "";

		

		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.docbase))
		{
			docbase = this.getView().getViewModel().getData().rec.data.docbase;
		}		
		
		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.remember_me))
		{
			remember_me = this.getView().getViewModel().getData().rec.data.remember_me;
		}

		docbase = ExtDoc.utils.ExtDocBase64.encode(docbase);

		Ext.util.Cookies.set ('docbase', docbase, new Date(new Date().getTime() + ExtDoc.utils.ExtDocTimeout.timeout));
		
		this.closeView();
		if (isDistribution)
		{
			Distribution.getInstance().openDocument();
		} else
		{
			window.location.reload();
		}
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
		this.getView().toggleMaximize();
		
		//set Default Repository in login screen dropdown
		var field = this.view.tabbar.tbPanels[0].items.items[0];
		var store = field.getStore();
		store.on("load", function(){
			try
			{
				store.storeField.setValue(store.data.items[0].data.value);
			}
			catch (e)
			{
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'docbase_not_available');
			}
		});
		
		
	}
});