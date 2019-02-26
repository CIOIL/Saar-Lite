Ext.define('ExtDoc.views.extfields.ExtDocField', {
	extend: 'Ext.Mixin',
	fieldProperties: null,
	fieldPanel: null,
	validateBlank: true,
	getFieldProperties: function() {
		return this.fieldProperties;
	},
	getFieldPanel: function() {
		return this.fieldPanel;
	},
	setFieldWidth: function(width) {
		if (Ext.isEmpty(width))
		{
			this.width = '100%';
		} else
		{
			this.width = width;
		}
	},
	setFieldValue: function(value) {
		if (!Ext.isEmpty(value))
		{
			this.setValue(value);
		}
	},
	initFormField: function(fieldPanel, fieldProp){
		this.fieldProperties = fieldProp;
		this.fieldPanel = fieldPanel;
		this.setFieldWidth(this.fieldProperties.get("width"));
		this.fieldLabel = ExtDoc.locales.ExtDocLocaleManager.getText(this.fieldProperties.get("label"));
		this.msgTarget = this.fieldProperties.get("msgTarget");
		this.name = this.fieldProperties.get("name");
		this.fieldStyle = this.fieldProperties.get("style");
		this.allowBlank = this.fieldProperties.get("allowBlank");
		this.readOnly = this.fieldProperties.get("readOnly");
		this.disabled = this.fieldProperties.get("disabled");
		this.blankText = this.fieldProperties.get("blankText");
		var classOfWrappingElement = this.fieldProperties.get("inputWrapCls");
		if (classOfWrappingElement && classOfWrappingElement.length > 0){
			this.inputWrapCls = classOfWrappingElement;
		}
		if (this.fieldProperties.get("maxLength"))
		{
			this.maxLength = this.fieldProperties.get("maxLength");
		}
		this.onfocus = this.fieldProperties.get("onfocus");
		this.onclick = this.fieldProperties.get("onclick");
		this.dependant = this.fieldProperties.get("dependant");
		this.dependantRequired = this.fieldProperties.get("dependantRequired");
		this.dependantRequiredErrorMSG = this.fieldProperties.get("dependantRequiredErrorMSG");
		this.dependantFunction = this.fieldProperties.get("dependantFunction");
		this.hasEmptyValue = this.fieldProperties.get("hasEmptyValue") === false || this.fieldProperties.get("allowBlank") === false ? false : true;
		this.defaultValue = this.fieldProperties.get("defaultValue");
		this.valueFromFolder = this.fieldProperties.get("valueFromFolder");
		this.createNewOnEnter = this.fieldProperties.get("createNewOnEnter");  //tagfield 
		this.createNewOnBlur = this.fieldProperties.get("createNewOnBlur");  //tagfield 
		this.multiSelect = this.fieldProperties.get("multiSelect");  //tagfield 
		this.singleSelect = this.fieldProperties.get("singleSelect");  //tagfield 
		this.enableKeyEvents = this.fieldProperties.get("enableKeyEvents");  //tagfield 
		this.filterPickList = this.fieldProperties.get("filterPickList");  //tagfield 
		this.forceSelection = this.fieldProperties.get("forceSelection");  //tagfield 
		this.hideHeaders = this.fieldProperties.get("hideHeaders");  //gridfield 
		this.boxLabel = this.fieldProperties.get("boxLabel");
		this.inputValue = this.fieldProperties.get("inputValue");
		this.isRepeating = this.fieldProperties.get("isRepeating");
		this.allowDecimals = this.fieldProperties.get("allowDecimals");
		this.typeAttribute = this.fieldProperties.get("typeAttribute");
		this.operator = this.fieldProperties.get("operator");
		this.defaultValue = this.fieldProperties.get("defaultValue");
		this.defaultValueMethod = this.fieldProperties.get("defaultValueMethod");
		if (this.fieldProperties.get("hidden"))
		{
			this.hidden = this.fieldProperties.get("hidden");
		}
		if(this.isXType('panel'))
		{
			this.name = this.fieldProperties.get("name");
			this.autoScroll = this.fieldProperties.get("autoScroll");
			this.header = this.fieldProperties.get("header");
			this.height = this.fieldProperties.get("height");
			this.minHeight = this.fieldProperties.get("minHeight");
			this.style = this.fieldProperties.get("style");
			this.bodyStyle = this.fieldProperties.get("bodyStyle");
			this.html = this.fieldProperties.get("html");
			this.dontRequest = this.fieldProperties.get("dontRequest");
			this.html = this.fieldProperties.get("html");
			this.title = this.fieldProperties.get("title");
			this.collapsible = this.fieldProperties.get("collapsible");
			this.collapsed = this.fieldProperties.get("collapsed");
		}
		this.fireEvent('afterinit');
	},
	updateAfterRender: function() {
		this.setFieldValue(this.fieldProperties.get("defaultValue"));

		if (this.getFieldPanel().getPanelWindow != null && this.getFieldPanel().getPanelWindow() != null)
		{
			this.setBind('{rec.' + this.fieldProperties.get("name") + '}');
		}

		if (this.fieldPanel.validateField != null)
		{
			this.validator = function() {
				return this.fieldPanel.validateField(this);
			};
		}
	}
});