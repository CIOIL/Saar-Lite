Ext.define('ExtDoc.tools.controllers.ExtDocEditController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.editController',
	objectsToEdit: null,
	errorMessegeArray: null,
	serviceMethod: "content/edit/",
	operation: "Edit",
	getObjectsToEdit: function() {
		return this.objectsToEdit;
	},
	disableView: function() {
		var editViewQuery = Ext.ComponentQuery.query('[anchor="editView"]');
		this.editView = editViewQuery[0];
		this.editView.setDisabled(true);

	},
	enableView: function() {
		//do nothing as we don't want to enable Edit again to opened document
	},
	printAction: function (){
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		this.getView().mask('', 'loading');
		this.objectsToEdit = new Array();
		this.errorMessegeArray = new Array("");
		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();

		for (var index = 0; index < selectedObjects.length; index++)
		{
			var selectedObject = selectedObjects.getAt(index);

			if (this.hasReadPermissions(selectedObject))
			{
				if (!Ext.isEmpty(selectedObject.get('a_content_type')))
				{
					this.getObjectsToEdit()[this.getObjectsToEdit().length] = selectedObject;
				}
			}
		}

		if (this.errorMessegeArray[0] != "")
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'read_permissions_error', this.errorMessegeArray);
		}
		
		this.printNextObject();
	},
	editAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		this.disableView();
		this.getView().mask('', 'loading');
		this.objectsToEdit = new Array();
		this.errorMessegeArray = new Array("");

		var selectedObjects = this.getView().getToolParent().getSelection();

		for (var index = 0; index < selectedObjects.length; index++)
		{
			var selectedObject = selectedObjects[index];

			if (this.hasPermissions(selectedObject))
			{
				if (!Ext.isEmpty(selectedObject.get('a_content_type')))
				{
					this.getObjectsToEdit()[this.getObjectsToEdit().length] = selectedObject;
					if (selectedObject.get('r_lock_owner') != "" && !selectedObject.get('locked_by_me')) {
						
							this.serviceMethod = "content/read/";
							this.operation = "Read";						
					}
				}
			}
		}

		if (this.errorMessegeArray[0] != "")
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'edit_permissions_error', this.errorMessegeArray);			
		}

		this.editNextObject();
	},
	editNextObject: function() {
		if (this.getObjectsToEdit().length > 0)
		{
			this.editObject(this.getObjectsToEdit()[this.getObjectsToEdit().length - 1]);
			this.getObjectsToEdit().splice(-1, 1);
		} else
		{
			this.getView().unmask();
			this.enableView();
			this.getMainGrid().getStore().load();
		}

	},
	editObject: function(objectToDownload) {
		var currentTool = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + this.serviceMethod;

		var objectIds = [ objectToDownload.get('r_object_id') ];
		var json = this.buildJson(objectIds);
		var applet = document.getElementById('fileApplet');
		if (applet && BrowserDetectorFactory.getBrowserDetector().isIE())
		{
			var args = [];
			args.push(this.operation);
			args.push(completeUrl);
			args.push(ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
			args.push(json);
			args.push(objectToDownload.get('locked_by_me'));
			args.push(ExtDoc.config.ExtDocConfig.checkoutScheme);
			args.push(ExtDoc.config.ExtDocConfig.checkoutPath);
			args.push(ExtDoc.config.ExtDocConfig.authenticationType);
			if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
				args.push(ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			}

			try
			{
				if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
					this.sendEmptyRequest();
				} 

				applet.executeOperation(args);
				this.lockObject(objectToDownload);
				//update selection state from doc to locked doc
				var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
				mainGrid.selectedArray[2] = mainGrid.selectedArray[2]-1;
				mainGrid.selectedArray[3] = mainGrid.selectedArray[3]+1;
				// call updateTool here
				this.getObjectsToEdit().splice(-1, 1);
				currentTool.editNextObject();
				Ext.ComponentQuery.query('[anchor="emailView"]')[0].updateTool(3, objectToDownload, true);
				Ext.ComponentQuery.query('[anchor="changeContentView"]')[0].setDisabled(true);
				Ext.ComponentQuery.query('[anchor="deleteView"]')[0].setDisabled(true);
				
				return;
			} catch (error)
			{
				console.log(error.message + ' !!Attention. Fix it!!');
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.responseType = 'blob';

		xhr.onreadystatechange = function(e) {
			if (this.readyState == 4 && this.status == 200)
			{
				var filename = ExtDoc.utils.ExtDocUtils.unicodeToText(xhr.getResponseHeader("Content-Disposition"));
				saveAs(xhr.response, filename);

				currentTool.lockObject(objectToDownload);
				//update selection state from doc to locked doc
				var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
				mainGrid.selectedArray[2] = mainGrid.selectedArray[2]-1;
				mainGrid.selectedArray[3] = mainGrid.selectedArray[3]+1;

				// call updateTool here
				currentTool.editNextObject();
				Ext.ComponentQuery.query('[anchor="emailView"]')[0].updateTool(3, objectToDownload, true);
				Ext.ComponentQuery.query('[anchor="changeContentView"]')[0].setDisabled(true);
				Ext.ComponentQuery.query('[anchor="deleteView"]')[0].setDisabled(true);
				
			} else if (this.readyState == 4 && this.status == 400)
			{
				currentTool.editNextObject();
			}
		};

		xhr.send(json);
	},
	hasPermissions: function(selectedObject) {
		var result = false;

		if(!ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserEditDocPermission(selectedObject))
		{
			this.errorMessegeArray[0] += (ExtDoc.locales.ExtDocLocaleManager.getText('edit_permission_single_error') + selectedObject.get('object_name') + "<br/>");
		}  
		else
		{
			result = true;
		}
		return result;
	},
	buildJson: function(objectIds) {
		var preJson = {
			"properties": {
				"docIds": objectIds
			}
		};
		var json = Ext.JSON.encode(preJson);
		return json;
	},
	lockObject: function(objectToDownload) {
		var objectName = objectToDownload.get('object_name');
		objectToDownload.set('object_name', objectName.replace('\"', ''));
		objectToDownload.set('r_lock_owner', ExtDoc.utils.ExtDocLoginHandler.getUserName());
		objectToDownload.set('locked_by_me', true);
	},
	readAction: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		this.getView().mask('', 'loading');
		this.objectsToEdit = new Array();
		this.errorMessegeArray = new Array("");
		var selectedObjects = this.getView().getToolParent().getSelectionModel().getSelected();

		for (var index = 0; index < selectedObjects.length; index++)
		{
			var selectedObject = selectedObjects.getAt(index);

			if (this.hasReadPermissions(selectedObject))
			{
				if (!Ext.isEmpty(selectedObject.get('a_content_type')))
				{
					this.getObjectsToEdit()[this.getObjectsToEdit().length] = selectedObject;
			  /*	if (selectedObject.get('r_lock_owner') != "" && !selectedObject.get('locked_by_me')) 
					{
							this.serviceMethod = "content/read/";
							this.operation = "Read";						
					}
					*/
				}
			}
		}

		if (this.errorMessegeArray[0] != "")
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'read_permissions_error', this.errorMessegeArray);			
		}
		this.readNextObject();
	},
	readNextObject: function() {
		if (this.getObjectsToEdit().length > 0)
		{
			this.readObject(this.getObjectsToEdit()[this.getObjectsToEdit().length - 1]);
			this.getObjectsToEdit().splice(-1, 1);
		} else
		{
			this.getView().unmask();
			this.enableView();
		}
	},
	printNextObject: function() {
		if (this.getObjectsToEdit().length > 0)
		{
			this.printObject(this.getObjectsToEdit()[this.getObjectsToEdit().length - 1]);
			this.getObjectsToEdit().splice(-1, 1);
		}
		else
		{
			this.getView().unmask();
			this.enableView();
		}
	},
	printObject: function(objectToDownload){
		var currentTool = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + this.serviceMethod;

		var objectIds = [ objectToDownload.get('r_object_id') ];
		var json = this.buildJson(objectIds);
		var applet = document.getElementById('fileApplet');
		if (applet && BrowserDetectorFactory.getBrowserDetector().isIE())
		{
			var args = [];
			args.push(this.operation);
			args.push(completeUrl);
			args.push(ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
			args.push(json);
			args.push(objectToDownload.get('locked_by_me'));
			args.push(ExtDoc.config.ExtDocConfig.checkoutScheme);
			args.push(ExtDoc.config.ExtDocConfig.checkoutPath);
			args.push(ExtDoc.config.ExtDocConfig.authenticationType);
			if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType)
			{
				args.push(ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			}
			
			try
			{
				if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType)
				{
					this.sendEmptyRequest();
				} 

				applet.executeOperation(args);
				// call updateTool here
				this.getObjectsToEdit().splice(-1, 1);
				currentTool.printNextObject();
				return;
			}
			catch (error)
			{
				console.log(error.message + ' !!Attention. Fix it!!');
			}
		}
	},
	// send data to server depending on browser 
	readObject: function(objectToDownload) {
	
		var currentTool = this;
		var serviceName = objectToDownload.get('a_content_type') == 'msg' ? 'content/viewSource/' : this.serviceMethod;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + serviceName;

		var objectIds = [ objectToDownload.get('r_object_id') ];
		var json = this.buildJson(objectIds);
		var applet = document.getElementById('fileApplet');
		if (applet && BrowserDetectorFactory.getBrowserDetector().isIE())
		{
			var args = [];
			args.push(this.operation);
			args.push(completeUrl);
			args.push(ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
			args.push(json);
			args.push(objectToDownload.get('locked_by_me'));
			args.push(ExtDoc.config.ExtDocConfig.checkoutScheme);
			args.push(ExtDoc.config.ExtDocConfig.checkoutPath);
			args.push(ExtDoc.config.ExtDocConfig.authenticationType);
			if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
				args.push(ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			}
			try
			{
				if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
					this.sendEmptyRequest();
				} 

				applet.executeOperation(args);
				// call updateTool here
				this.getObjectsToEdit().splice(-1, 1);
				currentTool.readNextObject();
				return;
			} catch (error)
			{
				console.log(error.message + ' !!Attention. Fix it!!');
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.responseType = 'blob';

		xhr.onreadystatechange = function(e) {
			if (this.readyState == 4 && this.status == 200)
			{
				var filename = ExtDoc.utils.ExtDocUtils.unicodeToText(xhr.getResponseHeader("Content-Disposition"));
				saveAs(xhr.response, filename);
				currentTool.readNextObject();
			} 
			else if (this.readyState == 4 && this.status == 400)
			{
				currentTool.readNextObject();
			}
		};

		xhr.send(json);
	},
	hasReadPermissions: function(selectedObject) {
		var result = false;
		if(!ExtDoc.utils.ExtDocObjectPermissionUtils.hasUserReadDocPermission(selectedObject))
		{
			this.errorMessegeArray[0] += (ExtDoc.locales.ExtDocLocaleManager.getText('read_permission_single_error') + selectedObject.get('object_name') + "<br/>");
		}  
		else
		{
			result = true;
		}
		return result;
	}
});