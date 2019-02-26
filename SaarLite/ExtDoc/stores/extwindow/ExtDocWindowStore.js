Ext.define('ExtDoc.stores.extwindow.ExtDocWindowStore', {
	requires:[	'ExtDoc.models.extwindow.ExtDocWindowModel',
				'ExtDoc.utils.ExtDocAjax'],
	extend: 'Ext.data.Store',
	model: 'ExtDoc.models.extwindow.ExtDocWindowModel',
	proxy: {
		type: 'ajax',
		method: 'GET',
		reader: {
			type: 'json',
			rootProperty: ''
		}
	},
	initStore: function(dataUrl){
		this.getProxy().setUrl(dataUrl);
		this.getProxy().setHeaders(ExtDoc.utils.ExtDocAjax.getRequestHeaders());
	}
});