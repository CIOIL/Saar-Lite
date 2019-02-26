Ext.define('ExtDoc.stores.extwindow.ExtDocPanelStore', {
	requires:[	'ExtDoc.models.extwindow.ExtDocWindowPanelModel',
				'ExtDoc.utils.ExtDocAjax'],
	extend: 'Ext.data.Store',
	model: 'ExtDoc.models.extwindow.ExtDocWindowPanelModel',
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