Ext.define('ExtDoc.stores.extgrid.ExtDocGridStore', {
	requires:['ExtDoc.models.extgrid.ExtDocGridModel'],
	extend: 'Ext.data.Store',
	model: 'ExtDoc.models.extgrid.ExtDocGridModel',
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