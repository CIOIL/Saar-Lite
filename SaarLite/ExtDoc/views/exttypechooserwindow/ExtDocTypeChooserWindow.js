Ext.define('ExtDoc.views.exttypechooserwindow.ExtDocTypeChooserWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.exttypechooserwindow.ExtDocTypeChooserWindowController'],
	controller: 'typeChooserWindowController',
	anchor: 'typeChooserWindow',
	objectTypes: [],
	actionName : null,
	windowType : null,
	defaultRecords: null,
	setObjectTypes: function (properties){
		this.objectTypes = [];
		for (var property in properties)
		{
			this.objectTypes.push(properties[property]);
		}		
	},
	getObjectTypes: function (){
		return this.objectTypes;
	},
	setWindowType: function (wType){
		this.windowType = wType;
	},
	getWindowType: function (){
		return this.windowType;
	},
	setActionName: function(aName){
		this.actionName = aName;
	},
	getActionName: function(){
		return this.actionName;
	},
	setDefaultRecords: function(dRecords){
		this.defaultRecords = dRecords;
	},
	getDefaultRecords: function(){
		return this.defaultRecords;
	},
	afterRender: function(){
		this.callParent();
	},
	listeners: {
		beforeshow: function(e, eOpts)
		{
			var fields = e.getAllFields();
			{
				var objectTypes = this.getObjectTypes();
				for (var i = 0; i < objectTypes.length; i++)
				{
					e.getFieldByInputValue(this.objectTypes[i]).show();
				}
			}
			
			var fields = e.getAllFields();
			for (var field in fields)
			{
				if (!fields[field].isHidden())
				{
					fields[field].setValue(true);
					break;
				}
			}
		}
	}
});