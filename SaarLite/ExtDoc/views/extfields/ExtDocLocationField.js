Ext.define('ExtDoc.views.extfields.ExtDocLocationField', {
	requires: ['ExtDoc.views.extlocationwindow.ExtDocLocationWindow'],
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	extend: 'ExtDoc.views.extfields.ExtDocTextField',
	objectLocations: null,
	objectFolderIds: null,
	folderId: null,
	editable: false,
	enforceMaxLength: true,
	maxLength: 8096,
    triggers: {
        openLocator: {
            cls: Ext.baseCSSPrefix + 'form-search-trigger',
            handler: function() {
        		var limitedAccess = ExtDoc.utils.ExtDocLimitedAccess.checkLimitedAccess();
        		if (limitedAccess)
        		{
        			ExtDoc.utils.ExtDocUtils.showAlert('error','action_not_allowed_error');
        			return;
        		}
        		
                var locationWindow = Ext.create('ExtDoc.views.extlocationwindow.ExtDocLocationWindow');
                locationWindow.setObjectFather(this);
                locationWindow.initLocationWindow();
            }
        }
    },	
	updateAfterRender: function(){
		this.getFolderPath();
	},
	getFolderPath: function(){
		if (this.getFieldPanel().getPanelWindow() != null)
		{
			this.setFolderId(this.getFieldPanel().getPanelWindow().getWindowRecord().get('i_folder_id'));
		}
		else
		{
			return;
		}
		
		var currentField = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + this.getFieldProperties().get('dataUrl');			
		Ext.Ajax.request({
			url: completeUrl,
			method: 'POST',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts){ 
				currentField.initObjectLocations(response.responseText);
				currentField.reportLoaded();
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
			},
			jsonData: currentField.buildNewObjectJson()
		});
	},
	getObjectLocations: function(){
		return this.objectLocations;
	},
	getObjectFolderIds: function(){
		return this.objectFolderIds;
	},
	setObjectLocations: function(newLocations) {
		//set new folder_ids selected by the user
		this.objectLocations = newLocations;
		var value = "";
		this.objectFolderIds = new Array();

		for (var index = 0; index < newLocations.length; index++)
		{
			value = value + newLocations[index]["r_folder_path"];
			this.objectFolderIds[index] = newLocations[index]["r_object_id"];
			
			if (index < newLocations.length - 1)
			{
				value = value + ", "; 
			}
		}
		this.setFieldValue(value);
	},
	initObjectLocations: function(newObjectLocations){
		var result = Ext.util.JSON.decode(newObjectLocations);
		var notEmptyIndex = 0;
		var objectLocations = new Array();
		
		for (var index = 0; index < result.length; index++) 
		{
			if (result[index].properties.r_folder_path != null)
			{
				var arrayElement = {};
				arrayElement["r_folder_path"] =  result[index].properties.r_folder_path;
				arrayElement["r_object_id"] =  result[index].properties.r_object_id; //i_folder_id of the folder_path
				objectLocations[notEmptyIndex] = arrayElement;
				notEmptyIndex++;
			}
		}
		this.setObjectLocations(objectLocations);
	},
	setFolderId: function(newFolderId) {
		this.folderId = newFolderId;
	},
	getFolderId: function() {
		return this.folderId;
	},
	getValue: function() {
		return this.getObjectFolderIds();
	},
	buildNewObjectJson: function(){
		var object = {};
		var objectProperties = {};
		objectProperties['folderIds'] = this.getFolderId();
		object['properties'] = objectProperties;
		return Ext.JSON.encode(object);
	},
	reportLoaded: function(){
		this.getFieldPanel().reportLoaded(true);
	}	
});