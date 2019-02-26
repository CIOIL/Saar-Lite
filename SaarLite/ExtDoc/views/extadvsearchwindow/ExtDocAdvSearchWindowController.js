Ext.define('ExtDoc.views.extadvsearchwindow.ExtDocAdvSearchWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowAdvSearchController',
	objectProperties : null,
	emptySearchProperties : true,
	doAdvSearch: function(){
		var properties = this.getSearchProperties();
		
		if (this.emptySearchProperties == true)
		{
			document.getElementsByName('searchValue')[0].value="";
			ExtDoc.utils.ExtDocUtils.showAlert('error','serach_empty_error','rtl');
		}
		else
		{
			this.getMainGrid().getView().emptyText = ExtDoc.locales.ExtDocLocaleManager.getText('wait_system_searches');
  		    this.getMainGrid().getView().refresh();
			document.getElementsByName('searchValue')[0].value="";
			var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "ss/advsearch/";		
			var searchStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');
			this.getMainGrid().setCurrentStore('gridStore');
			searchStore.initStore(completeUrl);
			searchStore.setJsonToPost(this.objectProperties);
			searchStore.setStoreMethod('POST');

			var oldUnitLayerName = this.getMainGrid().getUnitLayerName();
			this.getMainGrid().setDefaultUnitlayer();
	    	this.getMainGrid().initColumns();
	    	  
			this.getMainGrid().setStore(searchStore);
			ExtDoc.utils.ExtDocSearchAbortionManager.setActiveSearchAjax(this.getMainGrid().getStore());
			this.getMainGrid().getStore().load({
			    scope: this,
			    callback: function(records, operation, success) {
			    	  if (!records || records.length === 0){
			    		  this.getMainGrid().getView().emptyText = ExtDoc.locales.ExtDocLocaleManager.getText('no_data_grid');
			    		  this.getMainGrid().getView().refresh();
			    	  }
			    	  ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
			    	}
				}
			);
			
			var currentLocation = this.getMainGrid().getCurrentLocation();
			
			this.getMainGrid().gridBreadcrumb.breadcrumbPath = this.getMainGrid().gridBreadcrumb.breadcrumbPath.splice(0, 1);
			var searchResultsRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			searchResultsRecord.set('r_object_id',ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId());
			searchResultsRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText("search_results"));
			this.getMainGrid().gridBreadcrumb.breadcrumbPath.push(searchResultsRecord);

			var returnRecordId = ExtDoc.utils.ExtDocUtils.getReturnRecordId(currentLocation.get('r_object_id'));
			var returnRecordName = ExtDoc.utils.ExtDocUtils.getReturnRecordName(currentLocation);
			var returnRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			returnRecord.set('r_object_id', returnRecordId);
			returnRecord.set('object_name', returnRecordName);
			returnRecord.set('unit_layer_name', oldUnitLayerName);
			
			if (returnRecordId != ExtDoc.utils.ExtDocUtils.getHomeFolderId())
			{
				returnRecord.set('action_caller','search');
			}
			
			returnRecord.set('no_tooltip',true);
			this.getMainGrid().gridBreadcrumb.breadcrumbPath.push(returnRecord);
			
			this.getMainGrid().gridBreadcrumb.reloadBreadcrumn();
			this.getMainGrid().fireEvent('updateToolBars',-1,null,false);
			this.getMainGrid().getStore().on('load', function(){ExtDoc.utils.ExtDocSearchAbortionManager.clearActiveSearchAjax();});
			this.restoreDefaultDragOver();
			this.closeView();
		}
	},
	getMainView: function(){
		return ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
	},
	getMainGrid: function(){
	    return this.getMainView().getMainGrid();
	},
	getSearchProperties: function(){
		this.objectProperties = {};
		var allFields = this.getView().getAllFields();
		var singleProperties = {};
		var repeatingProperties = {};
		var typeAttributeProperties = {};

		this.emptySearchProperties = true;
		
		for (var i = 0; i < allFields.length; i++){
			if ('to' == allFields[i].getName() || 
				'cc' == allFields[i].getName() ||
				'from' == allFields[i].getName()){
				continue;
			}
			if ('to_panel' == allFields[i].getName() || 
				'cc_panel' == allFields[i].getName() || 
				'from_panel' == allFields[i].getName()){
				this.addContactsToProperties(this.objectProperties, allFields[i]);
				continue;
			}
			if(allFields[i].getValue() != null &&  allFields[i].getValue() != "")
			{
				if(allFields[i].getName() != "r_object_type")
				{
					this.emptySearchProperties = false;
				}
				if(allFields[i].getName() == "r_object_type" || allFields[i].getName() =="search_textual")
				{
					this.objectProperties[allFields[i].getName()] =  allFields[i].getValue();
				}
				else if(allFields[i].typeAttribute)
				{
					var value = allFields[i].getXTypes().indexOf('datefield') != -1 ? allFields[i].getRawValue() : allFields[i].getValue();
					typeAttributeProperties[allFields[i].getName()] = value + "__" + allFields[i].typeAttribute + "__" + allFields[i].operator;
				}
				else if(!allFields[i].isRepeating || allFields[i].isRepeating == false)
				{
					singleProperties[allFields[i].getName()] = allFields[i].getValue();
				}
				else
				{
					repeatingProperties[allFields[i].getName()] = allFields[i].getValue();
				}
			}
		}
		this.objectProperties["singleProperties"] = singleProperties;
		this.objectProperties["repeatingProperties"] = repeatingProperties;
		this.objectProperties["typeAttributeProperties"] = typeAttributeProperties;

		return 	this.objectProperties;
	}, 
	addContactsToProperties: function(objectProperties, contactPanel){
		var outlookProperties = {};
		if (contactPanel.getName() == 'to_panel')
		{
			outlookProperties["addressee_name"] = [];
			outlookProperties["addressee_id"] = [];
			for (var i = 0; i < contactPanel.getContacts().length; i++)
			{
				this.emptySearchProperties = false;
				outlookProperties["addressee_name"].push(contactPanel.getContacts()[i].Name);
				outlookProperties["addressee_id"].push(contactPanel.getContacts()[i].Email);
			}
		}
		if (contactPanel.getName() == 'cc_panel')
		{
			outlookProperties["cc_name"] = [];
			outlookProperties["cc_id"]  = [];
			for (var i = 0; i < contactPanel.getContacts().length; i++)
			{
				this.emptySearchProperties = false;
				outlookProperties["cc_name"].push(contactPanel.getContacts()[i].Name);
				outlookProperties["cc_id"].push(contactPanel.getContacts()[i].Email);
			}
		}
		if (contactPanel.getName() == 'from_panel')
		{
			outlookProperties["sender_name"] = [];
			outlookProperties["sender_id"] = [];
			for (var i = 0; i < contactPanel.getContacts().length; i++)
			{
				this.emptySearchProperties = false;
				outlookProperties["sender_name"].push(contactPanel.getContacts()[i].Name);
				outlookProperties["sender_id"].push(contactPanel.getContacts()[i].Email);
			}
		}
		this.objectProperties["outlookProperties"] = outlookProperties;
	}
});