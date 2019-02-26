/** 
 * This js is utility to store  fields default values. 
 */
Ext.define('ExtDoc.utils.ExtDocDefaultValuesUtil', {
	singleton: true,
	windowObject:null,
	initWindowBasicDefaultValues:function(records , currentRecord , objectType)
	{
		records.set('unit_id', currentRecord.get('unit_id'));
		records.set('r_object_id', currentRecord.get('r_object_id'));
		records.set('i_folder_id', currentRecord.get('r_object_id'));
		records.set('r_object_type', objectType);
	},	
	initWindowDefaultValues:function(windowObj)
	{
		if(Ext.isEmpty(windowObj))
		{
			return;
		}
		this.windowObject = windowObj;
		this.setDefaultValuesFromJSONfile(windowObj);
	},

	//Go Over the JSON fields to set default values.
	setDefaultValuesFromJSONfile:function(windowObj)
	{
		//get the JSON file window data 
		var windowStore = windowObj.getWindowConfigStore();
		//get the window model store
		var windowModel = windowObj.windowConfigStore.getAt(0);
		if(windowModel == null)
			return;
		var nummberOfPannels = windowStore.getAt(0).panels().count();
		for(var index = 0; index < nummberOfPannels ; index++)
		{
			var panel = windowStore.getAt(0).panels().getAt(index);
			var nummberOfFields = panel.fields().count();
			for(var fieldsIndex = 0 ; fieldsIndex < nummberOfFields ; fieldsIndex++)
			{
				var field = panel.fields().getAt(fieldsIndex);
				this.setFieldDefaultValueFromJSON(field);
			}		
		}
	},
	//this method checks if fields in JSON holds attribute of method to initiate - 
	// default values . If yes call this method to initiate the default value.
	setFieldDefaultValueFromJSON:function(field)
	{
		var methodName = field.get('defaultValueMethod');
		//if it has default value method , it means that the field has a default value.
		if(Ext.isEmpty(methodName))
		{
			return; 
		}
	    
		var currentRecord = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').getCurrentLocation();
		var docRecord = this.windowObject.getWindowRecord();
		var fieldName = field.get('name');	
		var defaultValue = field.get('defaultValue');
		
		//initDefault method must have default parameters from JSON.
		if(methodName == 'initDefault' && Ext.isEmpty(defaultValue))
		{
			return;
		}
		else if(methodName == 'initDefault')
		{
			if(defaultValue == 'curentDate')
			{
				//setting the date to current date:
				defaultValue = new Date();	
			}
			//calling method - 'initDefault' to initiate the current date.
			this.initDefault(docRecord ,fieldName ,defaultValue);
			return;
		}	
		//calling method for initiate default value.
		this[methodName](docRecord , currentRecord ,defaultValue);
		
	},
	
	/**
	 * The next methods are used for setting the default values.
	 * The methods are triggered from inside the JSON fields , or from JS methods.
	 */
	
	//General method for setting default values by field name
	initDefault:function(docRecord , fieldName , defaultVal)
    {
    	docRecord.set(fieldName , defaultVal);
    },
    
    //The next methods are implicit fields methods ,for setting default values
    initDefaultObjectID:function(docRecord, currentRecord , defaultVal)
    {
        var objID = currentRecord.get('r_object_id');
    	docRecord.set('r_object_id', currentRecord.get(objID));
    },
    initDefaultObjectType:function(docRecord, currentRecord ,defaultVal)
    {
    	
    	docRecord.set('r_object_type',currentRecord.get('r_object_type'));
    },
    initDefaultUnitID:function(docRecord, currentRecord , defaultVal)
    {
    	var currentRecordUnitID = currentRecord.get('unit_id');
    	if( ! Ext.isEmpty(currentRecordUnitID)) 
    	{
    		docRecord.set('unit_id', currentRecordUnitID);
    	}
    	else if( ! Ext.isEmpty(defaultVal))// only if unit id on currentRecord is null.
    	{
    		docRecord.set('unit_id', defaultVal);
    	}	
    },
    initDefaultFolderID:function(docRecord, currentRecord, defaultVal)
    {
        
    	if(!Ext.isEmpty(defaultVal))
        {
    		docRecord.set('i_folder_id', currentRecord.get(defaultVal));
    		return;
        }
    	var objID = currentRecord.get('r_object_id');
    	docRecord.set('i_folder_id', objID);
    },
    
    //The next methods are used for setting values from the parent object if exists.
    //If not exists will take the input default value .
    initDefaultClassification:function(docRecord, currentRecord , defaultVal)
    {
    	this.initDefaultVal('classification' , docRecord, currentRecord, defaultVal, '1');
    },
    initDefaultSensitivity:function(docRecord, currentRecord , defaultVal)
    {
        this.initDefaultVal('sensitivity' , docRecord, currentRecord, defaultVal, '1');
    },
    initDefaultStatusDate:function(docRecord, currentRecord , defaultVal)
    {
        this.initDefaultVal('status_date',  docRecord, currentRecord, defaultVal , new Date())
    },
    
    initDefaultVal:function(fieldName, docRecord, currentRecord, JSONdefaultVal , val)
    {
    	if (!Ext.isEmpty(JSONdefaultVal))
		{
    		docRecord.set(fieldName, JSONdefaultVal); 
		}
    	if (!Ext.isEmpty(currentRecord.get(fieldName)))
		{
			docRecord.set(fieldName, currentRecord.get(fieldName));
		}
		else
		{
			docRecord.set(fieldName, val);
		}
    }
})