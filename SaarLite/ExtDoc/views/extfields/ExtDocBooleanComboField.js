Ext.define('ExtDoc.views.extfields.ExtDocBooleanComboField', {
	extend: 'ExtDoc.views.extfields.ExtDocComboField',
	
	 loadComboStore: function(){
		 var newStore = Ext.create('ExtDoc.stores.extfields.ExtDocComboStore');

		 newStore.initStore(this, ExtDoc.config.ExtDocConfig.restUrl + this.getFieldProperties().get("dataUrl"));
		 this.setFolderId();
		 newStore.setJsonToPost(this.buildNewObjectJson());
		 newStore.setStoreMethod("POST");
				
		 var combo = this;
		 this.setStore(newStore);
		 this.getStore().load({
				callback: function(records,operation,success)
				{
					if(success)
					{
						records.forEach(function(element) {
							  if(element.data.code == 'T')
								  element.data.code = 'true';
							  if(element.data.code == 'F')
								  element.data.code = 'false';
							});
					}
				}
			});
	 }
});