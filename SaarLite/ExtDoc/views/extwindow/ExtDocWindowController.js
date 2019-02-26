Ext.define('ExtDoc.views.extwindow.ExtDocWindowController', {
    extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.windowController',
    saveWindowAction: function(){
		this.submitWindowToServer();
	},
	submitWindowToServer: function(isReloadGrid){
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		var currentController = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + this.getView().getSubmitUrl();

		///check form is valid before submit
		if (this.validateWindowOnClient()) {
			if(this.getView().getObjectType() == "gov_folder") {
				this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('uploading_folder'));
			}
			else {
				this.getView().mask(ExtDoc.locales.ExtDocLocaleManager.getText('uploading_document'));
			}
			this.setBottomToolbar(this.getView().getToolbarByName("bottom_toolbar"), false);
			
			var windowController = this;
			ExtDoc.utils.ExtDocAjax.setMaskObject(this.getView()); 
			Ext.Ajax.request({
				url: completeUrl,
				timeout: false,
				method: 'POST',
				headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
				success: function(response, opts){
					currentController.submitSuccess(response.responseText);
					var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
					if (isReloadGrid)
					{
						//reload grid store
						if (mainGrid.getStore().loadNextPage)
						{
							mainGrid.getStore().initStore(mainGrid.getStore().storeInitUrl);
							mainGrid.getStore().removeAll();
							mainGrid.getStore().loadNextPage(mainGrid);
						}
						else
						{
							mainGrid.getStore().load();
						}
						//mainGrid.reloadStore(mainGrid.getGridBreadcrumb().getCurrentLocation().data['r_object_id']);
					}
					else
					{
						mainGrid.update();
					}
				},
				failure: function(response, opts){
					currentController.getView().unmask();
					windowController.setBottomToolbar(currentController.getView().getToolbarByName("bottom_toolbar"), true);
					currentController.handleFailure(response);
				},
				jsonData: currentController.buildWindowDataJson()
			});
		}
	},
	buildWindowDataJson: function(){
		var object = {};
		var objectProperties = {};
		var objectName;
		objectProperties['validationClass'] = this.getView().validationClass;
		objectProperties['r_object_type'] = this.getView().objectType;
		
		for(var index = 0 ; index < this.getView().tabbar.getTbPanels().length ; index++)
		{
			var form = this.getView().tabbar.getTbPanels()[index];
			
			for(var indexItems = 0 ; indexItems < form.items.length ; indexItems++)
			{
				if (form.items.get(indexItems).getName().indexOf('from') > -1 
						|| form.items.get(indexItems).getName().indexOf('to') > -1 
						|| form.items.get(indexItems).getName().indexOf('cc') > -1){
					continue;
				}
				if(form.items.get(indexItems).getName() == "object_name")
				{
					objectName = Ext.String.trim(form.items.get(indexItems).getValue().trim());
					objectProperties[form.items.get(indexItems).getName()] = objectName;
				}
				else if (form.items.get(indexItems).getName() == "template_id")
				{
					var template_id = Ext.String.trim(form.items.get(indexItems).getValue());
					var template_name = Ext.DomQuery.select('input[name="template_id"]');
					
					objectProperties["template_id"] = template_id;
					objectProperties["template_name"] = template_name[0].value;
				}
				else if (form.items.get(indexItems).getXTypes().indexOf('datefield') != -1)
				{
					objectProperties[form.items.get(indexItems).getName()] = form.items.get(indexItems).getRawValue();
				}
				else
				{
					objectProperties[form.items.get(indexItems).getName()] = form.items.get(indexItems).getValue();
				}
			}
		}
		
		object['properties'] = objectProperties;
		var from_panel = this.getView().getFieldByName('from_panel');
		if (from_panel){
			from_panel.addContactsToProperties(object);
		}
		var to_panel = this.getView().getFieldByName('to_panel');
		if (to_panel){
			to_panel.addContactsToProperties(object);
		}
		var cc_panel = this.getView().getFieldByName('cc_panel');
		if (cc_panel){
			cc_panel.addContactsToProperties(object);
		}
		return Ext.JSON.encode(object);
	},	
	handleFailure: function(response){
		//Validation error
		if(response.status == 400 && ExtDoc.utils.ExtDocUtils.isTextJson(response.responseText))
		{
			this.setValidationError(response.responseText);
		}
		else
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
		}
	},	
	setValidationError: function(validationsErrorResponse){
		if(!Ext.isEmpty(validationsErrorResponse))
		{
			this.getView().setValidationErrorObject(Ext.util.JSON.decode(validationsErrorResponse));
			this.validateWindowOnClient();
		}
	},
	validateWindowOnClient: function(){
		var isValid = true;
		for(var index = 0 ; index < this.getView().tabbar.getTbPanels().length ; index++)
		{
			var form = this.getView().tabbar.getTbPanels()[index];
			
			if(!form.isValid())
			{
				isValid = false;
				this.getView().tabbar.setActiveTab(index);
			}
		}
		return isValid;
	},	
	getFieldByName: function(fieldName){
		var fieldToReturn = null;
		
		for(var index = 0 ; index < this.getView().tabbar.getTbPanels().length ; index++)
		{
			var form = this.getView().tabbar.getTbPanels()[index];
			
			for(var indexItems = 0 ; indexItems < form.items.length ; indexItems++)
			{
				if(form.items.get(indexItems).getName() == fieldName)
				{
					fieldToReturn = form.items.get(indexItems);
				}
			}
		}		
		
		return fieldToReturn;
	},
	submitSuccess: function(){
		this.restoreDefaultDragOver();
		this.closeView();
	},	
	closeWindowAction: function(){
		
		this.restoreDefaultDragOver();
		
		if(!Ext.isEmpty(this.getView().getWindowRecord()))
		{
			this.getView().getWindowRecord().cancelEdit();
		}
		this.closeView();
	},
	clearForm: function(){
		for(var index = 0 ; index < this.getView().tabbar.getTbPanels().length ; index++)
		{
			var form = this.getView().tabbar.getTbPanels()[index];
			form.reset();
		}		
		if(this.getView().tabbar.items.length > "1")
		{
			this.getView().tabbar.remove(this.getView().tabbar.items.items[1]);
			this.getView().tabbar.tbPanels.splice(1, 1);
		}
	},
	setBottomToolbar: function(toolbar, isEnable) {
		if (toolbar) {
			var btn = toolbar.getToolByName("okbtn");
			if (btn) {
				if (isEnable) {
					btn.enable();
				}
				else {
					btn.disable();
				}
			}
			btn = toolbar.getToolByName("cancelbtn")
			if (btn) {
				if (isEnable) {
					btn.enable();
				}
				else {
					btn.disable();
				}
			}
		}
	},
	// this method retrieves the original drug method of the grid
	// that is overrided by this window.
	restoreDefaultDragOver : function()
	{
		var drugOver = this.getView().getPerivousOnDragOver();
		if(! Ext.isEmpty(drugOver)){
			document.body.ondragover = drugOver;	
		}
	}
});