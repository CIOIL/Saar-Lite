Ext.define('ExtDoc.views.extfields.ExtDocExtendedComboField', {
	requires: [ 'ExtDoc.stores.extfields.ExtDocComboStore' ],
	mixins: [ 'ExtDoc.views.extfields.ExtDocField' ],
	extend: 'Ext.form.field.Tag',
	displayField: 'value',
	valueField: 'code',
	data : [{code: -1, value: '&nbsp;'}],
	queryMode: 'local',
	editable: true,
	folderId: null,
	anyMatch: true,
	//dragdrop extra fields
	objectType: null,
	attrName: null,
	values: null,
	dependencyNames: null,
	dependencyValues: null,
	listeners: {
		afterrender: function(c){
			this.initComboStoreConfig(true);
			Ext.create('Ext.tip.ToolTip', {
				target: c.inputId,
				trackMouse: true,
				renderTo: Ext.getBody(),
				listeners: {
					beforeshow: function updateTipBody(tip){
						if (!c.el.component.rawValue){
							return false;
						}
						tip.update(c.el.component.rawValue);
					}
				}
			});           
		}, 
		select: function (comp, record, index) {
			comp.inputEl.dom.value = '';
			if (this.dependant)
			{
				this.reloadDependant(comp.getValue());
			}			
            if (comp.getValue() == "" || comp.getValue() == "&nbsp;" || comp.getValue() == null){
            	 comp.setValue(null);
            } 

        },
		change: function (field, newValue ,oldValue ,eOpts) {			
            if (this.singleSelect){
            	this.setValue(this.removeOldValueFromNewValue(oldValue, newValue));
			}  
        }
	},
	initComboStoreConfig: function(load, selectedValue){
		if (this.getFieldProperties().get("dataUrl") == "va/dropdown")
		{
			if (this.getFieldPanel().getPanelWindow() != null)
			{
				this.objectType = this.getFieldPanel().getPanelWindow().getWindowRecord().get('r_object_type');
				this.attrName = this.getFieldProperties().get("name");
				this.dependencyNames = this.getFieldProperties().get("dependencyNames");
				if (this.dependencyNames != null)
				{
					this.setDependancyValues();
					if (selectedValue){
						this.dependencyValues[this.dependencyNames.indexOf('doc_type')] = selectedValue;						
					}
				}
			}
		}

		if (load)
		{
			this.loadComboStore();
		}
	},
	loadComboStore: function(){
		this.hasEmptyValue = false;
		var cacheKey = this.createCacheKey();
		var shouldUseCache = Math.floor((Math.random() * 10)) > 0 && ExtDoc.utils.ExtDocCache.contains(cacheKey);

		if(shouldUseCache)
		{
			var newStore = Ext.create('ExtDoc.stores.extfields.ExtDocMemoryComboStore');
			var data = ExtDoc.utils.ExtDocCache.get(cacheKey);
			
			for (var i = 0; i < data.length; i++)
			{
				newStore.add(data.getAt(i));
			}
			
			this.setStore(newStore);			
			this.reportLoaded();
			this.updateAfterRender();
			return;
		}
		
		var newStore = Ext.create('ExtDoc.stores.extfields.ExtDocComboStore');

		if (this.getFieldProperties().get("dataSource") == "local")
		{
			newStore.initStore(this, this.getFieldProperties().get("dataUrl"));
		} else
		{
			newStore.initStore(this, ExtDoc.config.ExtDocConfig.restUrl + this.getFieldProperties().get("dataUrl"));
			this.setFolderId();

			if (this.getFieldProperties().get("dataUrl") == "va/dropdown")
			{
				newStore.setJsonToPost(this.buildNewObjectJson());
				newStore.setStoreMethod("POST");
			} else
			{
				if (this.getFieldPanel().getPanelWindow() != null && !Ext.isEmpty(this.getFieldPanel().getPanelWindow().getWindowRecord()))
				{
					newStore.setStoreUrl(ExtDoc.utils.ExtDocUtils.prepareUrl(newStore.getStoreUrl(), this.getFieldPanel().getPanelWindow()
							.getWindowRecord()));
				}

				newStore.setStoreMethod("GET");
			}
		}

		this.setStore(newStore);
		this.getStore().load();
	},
	buildNewObjectJson: function(){
		var folderId;
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObject = mainGrid.getSelectionModel().getSelected().getAt(0);
		if (selectedObject) {
			folderId = selectedObject.get('i_folder_id');
		}
		var objectProperties = {
			"folderId": this.getFolderId() < 0 && folderId ? folderId : this.getFolderId(),
			"objectType": this.objectType,
			"attrName": this.attrName,
			"values": this.values,
			"dependencyNames": this.dependencyNames,
			"dependencyValues": this.dependencyValues
		};

		return objectProperties;
	},
	//When store is loaded report to the panel
	reportLoaded: function(){
		if (this.getFieldPanel().reportLoaded != null)
		{
			this.getFieldPanel().reportLoaded(true);
		}
	},
	setFolderId: function(){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var currentFolderRecord = mainGrid.getCurrentLocation();
		if (currentFolderRecord.data['r_object_id'] == ExtDoc.utils.ExtDocUtils.getHomeFolderId())
		{
			this.folderId = ExtDoc.utils.ExtDocUtils.getHomeFolderId();
		} else
		{
			this.folderId = currentFolderRecord.data['r_object_id'];
		}
	},
	getFolderId: function(){
		return this.folderId;
	},
	reloadDependant: function(selectedValue){
		var dependantName = this.dependant;
		var dependantField = this.getFieldPanel().getPanelWindow().getFieldByName(dependantName);
		dependantField.reset();
		dependantField.initComboStoreConfig(true, selectedValue);
		while (dependantField.dependant)
		{
			var value = dependantField.getValue();
			dependantField = this.getFieldPanel().getPanelWindow().getFieldByName(dependantField.dependant);
			dependantField.reset();
			dependantField.initComboStoreConfig(true, value);
		}
	},
	createCacheKey: function(){
		var key = '';
		if (this.objectType){
			key = this.objectType;
		}
		if (this.attrName){
			key = key + "_" + this.attrName;
		}		
		if (this.dependencyNames){
			for (var i = 0; i < this.dependencyNames.length; i++){
				
				key = key + "_" + this.dependencyValues[i];
			}
		}
		
		return key;
	}, 
	setDependancyValues: function(){
		this.dependencyValues = new Array();
		for (var index = 0; index < this.dependencyNames.length; index++)
		{
			this.dependencyValues[index] = this.getFieldPanel().getPanelWindow().getWindowRecord().get(
					this.dependencyNames[index]);
		}
		if (!this.dependencyValues[this.dependencyNames.indexOf('unit_id')]){
			var currentFolderRecord = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').getCurrentLocation();						
			this.dependencyValues[this.dependencyNames.indexOf('unit_id')] = currentFolderRecord.get('unit_id');
		}					
	},
	removeOldValueFromNewValue: function(oldValue, newValue){
		if (newValue.length == 1){
			return newValue;
		}
		if (newValue.length > 2){
			return [newValue[newValue.length - 1]];
		}

		newValue = newValue.filter(function(el) {
		    return el !== oldValue[0];
		});
		return newValue;
	}
	
});