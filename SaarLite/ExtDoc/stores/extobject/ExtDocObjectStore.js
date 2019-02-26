Ext.define('ExtDoc.stores.extobject.ExtDocObjectStore', {
	requires:['ExtDoc.models.extobject.ExtDocObjectModel'],
	extend: 'Ext.data.Store',
	model: 'ExtDoc.models.extobject.ExtDocObjectModel',
	jsonToPost: null,
	setJsonToPost: function(newJson){
		this.jsonToPost = newJson;
	},
	getJsonToPost: function(){
		return this.jsonToPost;
	},
	proxy: {
		type: 'ajax',
		reader: {
			type: 'json',
			rootProperty: '',
			record: 'properties'
		}		
	},
	setStoreMethod: function(method){		
		this.getProxy().actionMethods = {
			create: method, 
			read: method, 
			update: method, 
			destroy: method 
		};
		
		this.getProxy().paramsAsJson = false;
		
		if(method == 'POST')
		{
			this.getProxy().extraParams = {
		    	properties: this.getJsonToPost()
			};
			
			this.getProxy().paramsAsJson = true;
		}
	},
	initStore: function(dataUrl){
		this.getProxy().setUrl(dataUrl);
		this.getProxy().setHeaders(ExtDoc.utils.ExtDocAjax.getRequestHeaders());
		this.setStoreMethod('GET');
	}
});