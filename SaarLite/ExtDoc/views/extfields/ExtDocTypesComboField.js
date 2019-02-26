Ext.define('ExtDoc.views.extfields.ExtDocTypesComboField', {
	extend: 'ExtDoc.views.extfields.ExtDocComboField',
	
	listeners: {
		afterrender: function(e, eOpts ){
	          this.on("change", this.onChangedDocType);
		}
	},
	onChangedDocType : function(cb, newValue, oldValue)
    { 		
		/** The name of the json should be built in a convention: 
		  * name of type + "_advsearch_form"  */
		
	    if (cb.getValue() == "" || cb.getValue() == "&nbsp;" || cb.getValue() == null){
        	 cb.setValue("gov_document");
        } 
	    else if(newValue != "gov_document")
		{
			if(oldValue != newValue)
			{
				if(this.getFieldPanel().getPanelWindow().tabbar.items.length > "1")
				{
					this.removeTabs();
				}
				var dataUrl =  "config/advsearchform/"+newValue+"_advsearch_form.json";
				this.insertNewTab(dataUrl);
			}
		}
		else
		{
			if(this.getFieldPanel().getPanelWindow().tabbar.items.length > "1")
			{
				this.removeTabs();
			}
		}
	 },
	 insertNewTab: function(dataUrl){
			var currentPanel = this;
			var newStore = Ext.create('ExtDoc.stores.extwindow.ExtDocPanelStore');
			newStore.initStore(dataUrl);
			
			newStore.load({
				callback: function(records, operation, success){
					if(success == true){
						currentPanel.addTab(records[0]);
					}
				}
			});
	 },
	 removeTabs: function()
	 {
		 this.getFieldPanel().getPanelWindow().tabbar.remove(this.getFieldPanel().getPanelWindow().tabbar.items.items[1]);
		 this.getFieldPanel().getPanelWindow().tabbar.tbPanels.splice(1, 1);
	 },
	 addTab: function(panelProp)
	 {
			var tabPanel = Ext.create('ExtDoc.views.extwindow.ExtDocPanel');
			tabPanel.buildPanel(panelProp);
			tabPanel.setObjectFather(this.getFieldPanel().getPanelWindow().tabbar);
			this.getFieldPanel().getPanelWindow().tabbar.savePanel(tabPanel);
	 },
	 buildJson: function() {
			var folderId;
			var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
			var selectedObject = mainGrid.getSelectionModel().getSelected().getAt(0);
			if (selectedObject) {
				folderId = selectedObject.get('i_folder_id');
			}
			
			var objectProperties = {
				"folderId": this.getFolderId() < 0 && folderId ? folderId : this.getFolderId(),
			};
			return objectProperties;
		},
	 loadComboStore: function(){
		 var newStore = Ext.create('ExtDoc.stores.extfields.ExtDocComboStore');

		 newStore.initStore(this, ExtDoc.config.ExtDocConfig.restUrl + this.getFieldProperties().get("dataUrl"));
		 this.setFolderId();
		 newStore.setJsonToPost(this.buildJson());
		 newStore.setStoreMethod("POST");
				
		 var combo = this;
		 this.setStore(newStore);
		 this.getStore().load({
				callback: function(records,operation,success)
				{
					if(success)
					{
						if(records.length <= 1)
							combo.setVisible(false);
					}
					else
						combo.setVisible(false);
				}
			});
	 }
});