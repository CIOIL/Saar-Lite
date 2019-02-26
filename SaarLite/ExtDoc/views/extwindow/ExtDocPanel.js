Ext.define('ExtDoc.views.extwindow.ExtDocPanel', {
	requires: [	'ExtDoc.stores.extwindow.ExtDocPanelStore',
				'ExtDoc.views.extfields.ExtDocPasswordField',
				'ExtDoc.views.extfields.ExtDocComboField',
				'ExtDoc.views.extfields.ExtDocImageComboField',
				'ExtDoc.views.extfields.ExtDocTextField',
				'ExtDoc.views.extfields.ExtDocSearchTextField',
				'ExtDoc.views.extfields.ExtDocDateField',
				'ExtDoc.views.extfields.ExtDocFileField',
				'ExtDoc.views.extfields.ExtDocCheckBoxField',
				'ExtDoc.views.exttitlebarpanel.ExtDocSearchTool',
				'ExtDoc.views.exttitlebarpanel.ExtDocAdvSearchTool',
				'ExtDoc.views.extfields.ExtDocTextareaField',
				'ExtDoc.views.extfields.ExtDocStatusComboField',
				'ExtDoc.views.extfields.ExtDocExtendedComboField',
				'ExtDoc.views.extfields.ExtDocContactButtonField1',
				'ExtDoc.views.extfields.ExtDocContactsPanelField',
				'ExtDoc.views.extfields.ExtDocImageComboTextField',
				'ExtDoc.views.extfields.ExtDocPropertiesSenderField',
				'ExtDoc.views.extfields.ExtDocTypesComboField'],
	extend: 'Ext.form.Panel',
	mixins: ['Ext.form.RadioGroup'],
	bodyPadding: 10,
	scrollable: true,
	panelProperties: null,
	panelColumns: 0,
	panelRows: 0,
	panelStyle: null,
	panelValign: null,
	panelLabelWidth: null,
	objectFather: null,
	comboFieldsCounter: 0,
	listeners: {
		afterrender: function(){
			this.waitForComponentsToLoad();
		}
	},	
	layout: {
		type: 'table'
	},
	setPanelId: function(){
		if(!Ext.isEmpty(this.panelProperties.get('name')))
		{
			this.id = this.panelProperties.get('name') + "_" + ExtDoc.utils.ExtDocUtils.getRandomNumber();
		}
	},
	setPanelTitle: function(newTitle){
		this.title = ExtDoc.locales.ExtDocLocaleManager.getText(newTitle);
	},
	setPanelColumns: function(newPanelColumns){
		this.panelColumns = parseInt(newPanelColumns);
	},
	setPanelRows: function(newPanelRows){
		this.panelRows = parseInt(newPanelRows);
	},
	setPanelStyle: function(newPanelStyle){
		this.panelStyle = newPanelStyle;
	},
	setPanelValign: function(newPanelValign){
		this.panelValign = newPanelValign;
	},	
	setObjectFather: function(newObjectFather){
		this.objectFather = newObjectFather;
	},
	setPanelLabelWidth: function(newPanelLabelWidth){
		this.panelLabelWidth = newPanelLabelWidth;
	},
	getObjectFather: function(){
		return this.objectFather;
	},
	getPanelStyle: function(){
		return this.panelStyle;
	},
	getPanelValign: function(){
		return this.panelValign;
	},
	getPanelLabelWidth: function(){
		return this.panelLabelWidth;
	},
	getPanelWindow: function(){
		if(this.getObjectFather() != null)
		{
			if(!Ext.isEmpty(this.getObjectFather().getObjectFather))
			{
				return this.getObjectFather().getObjectFather();
			}
			else
			{
				return null;
			}
		}
		else
		{
			return null;
		}
	},
	updateTableLayout: function(){
		this.getLayout().columns = this.panelColumns;
		this.getLayout().rows = this.panelRows;
		this.getLayout().tdAttrs = {
        	valign: this.getPanelValign(),
        	style: this.getPanelStyle()
    	};
    	
    	if(this.getPanelLabelWidth() != 0)
    	{
	    	this.fieldDefaults = {
	    		labelWidth: this.getPanelLabelWidth()
	    	};
    	}
	},
	findFieldByName: function(fieldName){
		for(var index = 0 ; index < this.items.length ; index++)
		{
			if(this.items.getAt(index).name == fieldName)
			{
				return this.items.getAt(index);
			}
		}
	},
	setFieldValueByName: function(fieldName,newValue){
		for(var index = 0 ; index < this.items.length ; index++)
		{
			if(this.items.getAt(index).name == fieldName)
			{
				this.items.getAt(index).setValue(newValue);
			}
		}
	},
	buildPanel: function(panelProperties){
		this.panelProperties = panelProperties;
		this.setPanelId();
		this.setPanelTitle(panelProperties.get("name"));
		this.name = panelProperties.get("name");
		this.setPanelColumns(panelProperties.get("columns"));
		this.setPanelRows(panelProperties.get("rows"));
		this.setPanelStyle(panelProperties.get("style"));
		this.setPanelValign(panelProperties.get("valign"));
		this.setPanelLabelWidth(panelProperties.get("labelWidth"));
		this.updateTableLayout();
		
		var fields = panelProperties.fields();
		
		for(var index = 0 ; index < fields.count() ; index++)
		{
			this.addField(fields.getAt(index));
		}
	},
	addField: function(fieldProperties){
		var field = Ext.create(fieldProperties.get("type"));
		field.initFormField(this,fieldProperties);
		this.add(field);
		
		if(!Ext.isEmpty(fieldProperties.get("dataUrl")))
		{
			this.comboFieldsCounter++;
		}
	},
	validateField: function(field){
		var validationText = true;
		
		if(	this.getPanelWindow() != null &&
			!Ext.isEmpty(this.getPanelWindow().getValidationErrorObject))
		{
			var validationObject = this.getPanelWindow().getValidationErrorObject();
		
			if(validationObject != null)
			{
				if(validationObject['properties'][field.name] != null)
				{
					validationText = ExtDoc.locales.ExtDocLocaleManager.getText(validationObject['properties'][field.name]);
					validationObject['properties'][field.name] = null;
				}
			}
		}
		
		return validationText;
	},
	initPanel: function(dataUrl){
		if(!Ext.isEmpty(dataUrl))
		{
			var currentPanel = this;
			var newStore = Ext.create('ExtDoc.stores.extwindow.ExtDocPanelStore');
			newStore.initStore(dataUrl);
			
			ExtDoc.utils.ExtDocAjax.setMaskObject(Ext.getBody());
			newStore.load({
				callback: function(records, operation, success){
					if(success == true){
						currentPanel.buildPanel(records[0]);
						
						if(!Ext.isEmpty(currentPanel.getObjectFather().reportLoaded))
						{
							currentPanel.getObjectFather().reportLoaded();
						}
					}
				}
			});
		}
	},
	//Waiting for all combo stores to be loaded
	reportLoaded: function(decrease){
		if(decrease)
		{
			this.comboFieldsCounter--;
		}
		
		if(this.comboFieldsCounter == 0)
		{			
			this.unmask();
			var currentWindow = this.up('window');
		    if (currentWindow){
		       currentWindow.unmask();
		       if (currentWindow.tools && currentWindow.tools.close){
		       		currentWindow.tools.close.enable();
		       }
		       if (currentWindow.getToolbarByName("bottom_toolbar")){
		       	   if (currentWindow.getToolbarByName("bottom_toolbar").getToolByName("okbtn")){
		       		currentWindow.getToolbarByName("bottom_toolbar").getToolByName("okbtn").enable();
		       	   }
		       	   if (currentWindow.getToolbarByName("bottom_toolbar").getToolByName("cancelbtn")){
		       		currentWindow.getToolbarByName("bottom_toolbar").getToolByName("cancelbtn").enable();
		       	   }
		       }
		    }
		}
	},
	waitForComponentsToLoad: function(){
		this.mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'),
				'loading');
		var currentWindow = this.up('window');
		if (currentWindow) {
			currentWindow.mask();
			if (currentWindow.tools && currentWindow.tools.close) {
				currentWindow.tools.close.disable();
			}
			if (currentWindow.getToolbarByName("bottom_toolbar")) {
				if (currentWindow.getToolbarByName("bottom_toolbar").getToolByName("okbtn")) {
					currentWindow.getToolbarByName("bottom_toolbar")
							.getToolByName("okbtn").disable();
				}
				if (currentWindow.getToolbarByName("bottom_toolbar").getToolByName("cancelbtn")) {
					currentWindow.getToolbarByName("bottom_toolbar")
							.getToolByName("cancelbtn").disable();
				}
			}
		}
		this.reportLoaded(false);
	}
});