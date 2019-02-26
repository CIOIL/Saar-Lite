Ext.define('ExtDoc.stores.extobject.ExtDocObjectBufferedStore', {
	requires:['ExtDoc.models.extobject.ExtDocObjectModel'],
	extend: 'Ext.data.Store',
	model: 'ExtDoc.models.extobject.ExtDocObjectModel',
	storePage: 0,
	storeInitUrl: null,
	bufferedData: null,
	bufferedMode: false,
	storePageSize: 100,
	lastLoadRecordCount: 0,
	listeners: {
		load: function(store, records, successful, eOpts){
			if(this.bufferedMode && this.storePage > 1)
			{
				var currentRange = this.getData().getRange();
				this.lastLoadRecordCount = currentRange.length;

				this.add(this.bufferedData);
				this.add(currentRange);
				
				if(currentRange.length < this.storePageSize)
				{
					//Stop asking from pages
					this.bufferedMode = false;
					this.storePage = 2;
				}
			}
		}
	},
	proxy: {
		type: 'ajax',
		method: 'GET',
		reader: {
			type: 'json',
			rootProperty: '',
			record: 'properties'
		}		
	},
	getStorePage: function(){
		return this.storePage;
	},
	getLastLoadRecordCount: function(){
		return this.lastLoadRecordCount;
	},
	initStore: function(dataUrl){
		this.storePage = 0;
		this.bufferedData = null;
		this.storeInitUrl = dataUrl;
		this.getProxy().setHeaders(ExtDoc.utils.ExtDocAjax.getRequestHeaders());
		this.setBufferedMode();
	},
	loadNextPage: function(currentGrid){
		this.storePage++;
		var urlRecord = Ext.create('Ext.data.Model');
		urlRecord.set('page',this.storePage);
		this.getProxy().setUrl(ExtDoc.utils.ExtDocUtils.prepareUrl(this.storeInitUrl,urlRecord));
		
		if(this.bufferedMode)
		{
			if(this.storePage > 1)
			{
				this.bufferedData = ExtDoc.utils.ExtDocUtils.cloneRange(this.getData().getRange());
			}
			
			this.load({
				callback: function(records, operation, success){
					if (currentGrid && (!records || records.length === 0)){
						currentGrid.getView().emptyText = ExtDoc.locales.ExtDocLocaleManager.getText('no_data_grid');
						currentGrid.getView().refresh();
			    	}
				}
			});
		}
		else if(this.storePage == 1)
		{
			this.load({
				callback: function(records, operation, success){				
					if (currentGrid && (!records || records.length === 0)){
						currentGrid.getView().emptyText = ExtDoc.locales.ExtDocLocaleManager.getText('no_data_grid');
						currentGrid.getView().refresh();
			    	}
				}
			});
		}
		
	},
	setBufferedMode: function(){
		var urlRecord = Ext.create('Ext.data.Model');
		urlRecord.set('page',0);
		
		if(ExtDoc.utils.ExtDocUtils.prepareUrl(this.storeInitUrl,urlRecord) == this.storeInitUrl)
		{
			this.bufferedMode = false;
		}
		else
		{
			this.bufferedMode = true;
		}
	}
});