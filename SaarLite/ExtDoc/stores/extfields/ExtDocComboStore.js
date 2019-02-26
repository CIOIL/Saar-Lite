Ext.define('ExtDoc.stores.extfields.ExtDocComboStore', {
	extend: 'ExtDoc.stores.extobject.ExtDocObjectStore',
	model: 'ExtDoc.models.extfields.ExtDocComboModel',
	storeField: null,
	noCache: false,
	getStoreField: function(){
		return this.storeField;
	},
	setStoreField: function(newStoreField){
		this.storeField = newStoreField;
	},	
	listeners:{
		load: function(){this.updateValues();}
	},
	initStore: function(field,dataUrl){
		this.getProxy().setUrl(dataUrl);
		this.getProxy().setHeaders(ExtDoc.utils.ExtDocAjax.getRequestHeaders());
		this.setStoreMethod('GET');
		this.setStoreField(field);
	},	
	setStoreUrl: function(dataUrl){
		this.getProxy().setUrl(dataUrl);
	},
	getStoreUrl: function(){
		return this.getProxy().getUrl();
	},
	updateValues: function(){
		
		this.setDropdownDelimeters();		
		
		if (this.getStoreField().hasEmptyValue)
		{
			this.insert(0, [{
	            value: '&nbsp;',
	            code: null
	        }]);
		}
		
		if (this.getStoreField().valueFromFolder)
		{
			var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
			var currentFolderRecord = mainGrid.getCurrentLocation();
			this.getStoreField().setValue(currentFolderRecord.get(this.getStoreField().attrName));
			this.getStoreField().reportLoaded();
		}
		else if (this.getStoreField().defaultValue && this.getStoreField().getFieldProperties().get('type')!="ExtDoc.views.extfields.ExtDocImageComboField"){
			this.getStoreField().setValue(this.getStoreField().defaultValue);
			
			if (this.getStoreField().defaultValue == "indexZero")
			{
				this.getStoreField().setValue(this.getAt(0) != null ? this.getAt(0).get("code") : "");
			}
			
			this.getStoreField().reportLoaded();
		}
		else
		{
			if(this.getStoreField().getFieldProperties().get('dataSource') == 'local')
			{
				for(var index = 0 ; index < this.data.length ; index++)
				{
					var newText =  ExtDoc.locales.ExtDocLocaleManager.getText(this.getAt(index).get('value'));
					this.getAt(index).set('value',newText);
				}
			}
			this.getStoreField().reportLoaded();
			this.getStoreField().updateAfterRender();
		}
		var key = this.getStoreField().createCacheKey();
		
		if (key)
		{
			ExtDoc.utils.ExtDocCache.put(key, this.data);
		}
		
		//console.log(ExtDoc.utils.ExtDocCache.cache);
	}, 
	printObject : function(object){
		
	},
	setDropdownDelimeters: function () {
	
		if (this.data.items)
		{
			var tplString = "";
			var newItems = [];
			
			for (var i = 0; i < this.data.items.length; i++)
			{
				var xindex = this.data.items[i].raw.code;
				if (xindex == "xindex")
				{
					var delimiter = this.data.items[i].raw.value;
					tplString = tplString.concat('<tpl if="xindex == '+delimiter+'"><hr /></tpl>');
				}
				else
				{
					newItems.push(this.data.items[i]);
				}
			}
			
			if (tplString.length > 0)
			{
				var tpl = '<tpl for="."><div class="x-boundlist-item">{value}</div>' + tplString + '</tpl>';
				this.getStoreField().tpl = tpl;
			}
			
			this.data.items = newItems;
		}
	}
});