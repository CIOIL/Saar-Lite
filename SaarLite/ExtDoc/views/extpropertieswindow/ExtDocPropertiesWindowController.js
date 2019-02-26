Ext.define('ExtDoc.views.extpropertieswindow.ExtDocPropertiesWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowPropertiesController',
	isTemplate : false,
	buildWindowDataJson: function(){
		var object = {};
		var objectProperties = {};
		
		objectProperties['validationClass'] = this.getView().validationClass;
		objectProperties['r_object_type'] = this.getView().objectType;
		
		if(!Ext.isEmpty(this.getView().getWindowRecord().get('r_object_id')))
		{
			objectProperties['r_object_id'] = this.getView().getWindowRecord().get('r_object_id');
		}
		
		for(var index = 0 ; index < this.getView().tabbar.getTbPanels().length ; index++)
		{
			var form = this.getView().tabbar.getTbPanels()[index];
			
			for(var indexItems = 0 ; indexItems < form.items.length ; indexItems++)
			{
				//if below must be added to each window that contains contacts panel
				if (form.items.get(indexItems).getName().indexOf('to') > -1 || 
					form.items.get(indexItems).getName().indexOf('cc') > -1 ||
					form.items.get(indexItems).getName().indexOf('from') > -1){
					continue;
				}
				if(form.items.get(indexItems).getValue() != null)
				{
					objectProperties[form.items.get(indexItems).getName()] = form.items.get(indexItems).getValue();
				}
				else
				{
					objectProperties[form.items.get(indexItems).getName()] = "";
				}
				
				if (form.items.get(indexItems).getName() == "object_name")
				{
					var objectName = form.items.get(indexItems).getValue() ? form.items.get(indexItems).getValue().trim() : form.items.get(indexItems).getValue();
					objectProperties[form.items.get(indexItems).getName()] = objectName;
					form.items.get(indexItems).setValue(objectName);
				}
				
				if (form.items.get(indexItems).getXTypes().indexOf('datefield') != -1)
				{
					objectProperties[form.items.get(indexItems).getName()] = form.items.get(indexItems).getRawValue();	
				}
				
				if (this.isTemplate){
					objectProperties['is_template'] = true;
				}
			}
		}
		
		object['properties'] = objectProperties;
		
		//this.addContactsToProperties(object);
		//code below must be added to each window that contains contacts tab 
		var to_panel = this.getView().getFieldByName('to_panel');
		if (to_panel){
			to_panel.addContactsToProperties(object);
		}
		var cc_panel = this.getView().getFieldByName('cc_panel');
		if (cc_panel){
			cc_panel.addContactsToProperties(object);
		}
		var from_panel = this.getView().getFieldByName('from_panel');
		if (from_panel){
			from_panel.addContactsToProperties(object);
		}
		return Ext.JSON.encode(object);
	},

	addContactsToProperties: function(object){
		//object.properties.addressee_names = this.getView().getFieldByName()
		object.properties.addressee_name = [];
		object.properties.addressee_id = [];
		var to_panel = this.getView().getFieldByName('to_panel');
		for (var i = 0; i < to_panel.getContacts().length; i++){
			object.properties.addressee_name.push(to_panel.getContacts()[i].Name);
			object.properties.addressee_id.push(to_panel.getContacts()[i].Email);
		}
		
		object.properties.cc_name = [];
		object.properties.cc_id = [];
		var cc_panel = this.getView().getFieldByName('cc_panel');
		for (var i = 0; i < cc_panel.getContacts().length; i++){
			object.properties.cc_name.push(cc_panel.getContacts()[i].Name);
			object.properties.cc_id.push(cc_panel.getContacts()[i].Email);
		}
		
		object.properties.sender_name = [];
		object.properties.sender_id = [];
		var from_panel = this.getView().getFieldByName('from_panel');
		for (var i = 0; i < from_panel.getContacts().length; i++){
			object.properties.sender_name.push(from_panel.getContacts()[i].Name);
			object.properties.sender_id.push(from_panel.getContacts()[i].Email);
		}
	},
	saveWindowAction: function() {
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		
		var flag = true;
		if (this.view.objectType == "gov_giyur_folder")
		{
			var chkbox = this.getFieldByName('id_type');
			
			if (chkbox && chkbox.checked)
			{
				var txt = this.getFieldByName('object_name');
				var val = txt.rawValue;
				
				if (!ExtDoc.utils.ExtDocObjectPermissionUtils.validateIdOrPassport(val)) {
					flag = false;
					txt.markInvalid(ExtDoc.locales.ExtDocLocaleManager.getText('invalid_id_or_passport'));
				}
			}
		}
		
		if (flag)
		{
			if (mainGrid.getCurrentStore() != 'gridStore')
			{
				this.submitWindowToServer(false);
			}
			else
			{
				this.submitWindowToServer(true);
			}
		}
		
	}, 
	updateTemplate: function() {
		this.isTemplate = true;
		this.submitWindowToServer(true);
	},
	submitSuccess: function(){
		var objectName = this.getView().getFieldByName('object_name').getValue();
		this.getView().getFieldByName('object_name').setValue(objectName.replace('\"', ''));
		this.getView().getWindowRecord().endEdit();
		
		if (this.isTemplate){
			//open document
			var editViewQuery = Ext.ComponentQuery.query('[anchor="editView"]');
			var editView = editViewQuery[0];
			editView.fireEvent('click');
			//reload maingrid			
			var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
			mainGrid.getStore().load();
		}
		this.callParent(arguments);
	}
});