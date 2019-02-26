Ext.define('ExtDoc.tools.controllers.ExtDocLinksController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.linksController',
	linksAction: function() {
		var loggedIn = this.checkLogin();
		if(!loggedIn)return;
		
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var selectedRecords = mainView.getMainGrid().getSelection();
		
		if(selectedRecords.length < 2)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error', 'selected_items_count_error');
			return;
		}
		
		mainView.mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'), 'loading');
		
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/linkObjects/";
		var xhr = new XMLHttpRequest();
		var objectIds = selectedRecords.map(function(record){return record.get('r_object_id')});
		var json = this.buildJson(objectIds);
		xhr.open("POST", completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.onreadystatechange = function(){
			
			if (xhr.readyState == XMLHttpRequest.DONE)
			{
				if (xhr.status == 200)
				{
					mainView.unmask();
					var objectIds = selectedRecords.forEach(function(record){record.set('relation_count','1')});
					
					if (mainView.getMainGrid().getCurrentStore() == 'clipboardStore')
					{
						mainView.getMainGrid().getStore().remove(selectedRecords);
					}
					
					var linksTitle = ExtDoc.locales.ExtDocLocaleManager.getText('links');
					var linksWarning = ExtDoc.locales.ExtDocLocaleManager.getText('links_warning');
					var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
					var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
					Ext.toast({
						autoCloseDelay: toastTimeout,
						html: linksWarning,
						title: linksTitle,
						rtl: toastRtl
					});
				}
				else if (xhr.status == 400)
				{
					mainView.unmask();
					ExtDoc.utils.ExtDocUtils.showAlert('error','server_error');
				}
			}
		};
		xhr.send(json);
		
	},
	buildJson: function(objectIds){
		var preJson = {
			"properties": {
				"objectIds": objectIds
			}
		};
		var json = Ext.JSON.encode(preJson);
		return json;
	},
	showLinks: function(){
		var loggedIn = this.checkLogin();
		if(!loggedIn)return;
		
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var currentLocation = mainView.getMainGrid().getCurrentLocation();
		var objectId = mainView.getMainGrid().getSelection()[0].get('r_object_id');
		
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/showLinks/" + objectId;
		var linksStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');

		linksStore.initStore(completeUrl);
		linksStore.setStoreMethod('GET');

		mainGrid.setStore(linksStore);
		mainGrid.fireEvent('initGridPath');
		mainGrid.getStore().load();

		mainGrid.gridBreadcrumb.breadcrumbPath = mainGrid.gridBreadcrumb.breadcrumbPath.splice(0, 1);
		
		var linksRecord =  Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		linksRecord.set('r_object_id', ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId());
		linksRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText('links'));
		linksRecord.set('no_tooltip',true);
		mainGrid.gridBreadcrumb.breadcrumbPath.push(linksRecord);
		
		var actionCallerRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		actionCallerRecord.set('r_object_id', ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId());
		var recordName = mainView.getMainGrid().getSelection()[0].get('object_name').length > 50 ? mainView.getMainGrid().getSelection()[0].get('object_name').substring(0, 50) : mainView.getMainGrid().getSelection()[0].get('object_name');
		var imageName = mainView.getMainGrid().getSelection()[0].get('a_content_type') ? mainView.getMainGrid().getSelection()[0].get('a_content_type') : mainView.getMainGrid().getSelection()[0].get('r_object_type');
		actionCallerRecord.set('object_name', '<img src="images/icons/' + imageName + '.gif" ></img>' + mainView.getMainGrid().getSelection()[0].get('object_name'));
		actionCallerRecord.set('no_tooltip',true);
		mainGrid.gridBreadcrumb.breadcrumbPath.push(actionCallerRecord);
		
		var returnFolderId = this.getReturnFolderId();
		this.buildReturnFolderBreadcrumbAndUpdateToolbar(returnFolderId, objectId);
	},
	deleteLinks: function(){
		var loggedIn = this.checkLogin();
		if(!loggedIn)return;
		
		var currentController = this;
		var confirmationTitle = ExtDoc.locales.ExtDocLocaleManager.getText("delete_links");
		var confirmationMessageText = ExtDoc.locales.ExtDocLocaleManager.getText("delete_links_warning_message_text");
		var noBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_no");
		var yesBtnText = ExtDoc.locales.ExtDocLocaleManager.getText("confirmation_yes");
		var confirmationRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();

		Ext.override(Ext.window.MessageBox, {
			buttonText: {
				yes: yesBtnText,
				no: noBtnText
			}
		});

		var confirmDelete = Ext.create('Ext.window.MessageBox', {
			rtl: confirmationRtl
		});

		confirmDelete.confirm(confirmationTitle, confirmationMessageText, function(btnText) {
			var controller = currentController;
			if (btnText === "no")
			{

			} 
			else if (btnText === "yes")
			{
				controller.deleteLinksConfirm();
			}
		}, this);		
	},
	deleteLinksConfirm: function()
	{
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var callerId = mainView.getMainGrid().getCurrentLocation().get('caller_id');
		var objectId = mainView.getMainGrid().getSelection()[0].get('r_object_id');
		var ids = [];
		ids.push(callerId);
		ids.push(objectId);
		
		mainView.mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'), 'loading');
		
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/deleteLinks/";
		var xhr = new XMLHttpRequest();
		var json = this.buildJson(ids);
		xhr.open("POST", completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		xhr.onreadystatechange = function(){
			if (xhr.readyState == XMLHttpRequest.DONE)
			{
				if (xhr.status == 200)
				{
					mainView.unmask();
					mainView.getMainGrid().getStore().remove(mainView.getMainGrid().getSelection()[0]);
				}
				else if (xhr.status == 400)
				{
					mainView.unmask();
					ExtDoc.utils.ExtDocUtils.showAlert('error','server_error');
				}
			}
		};
		xhr.send(json);
	},
	getReturnFolderId: function (){
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var currentLocationId = mainView.getMainGrid().getCurrentLocation().get('r_object_id');
		var selectedObjectFolderIds = mainView.getMainGrid().getSelection()[0].get('i_folder_id');
		var result;
		
		if (Array.isArray(selectedObjectFolderIds))
		{
			if(currentLocationId in selectedObjectFolderIds)
			{
				result = currentLocationId;
			}
			else
			{
				result = selectedObjectFolderIds[0];
			}
		}
		else
		{
			if(currentLocationId == selectedObjectFolderIds)
			{
				result = currentLocationId;
			}
			else
			{
				result = selectedObjectFolderIds;
			}
		}
		
		return result;
	},
	buildReturnFolderBreadcrumbAndUpdateToolbar: function (returnFolderId, objectId){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var currentLocationId = mainView.getMainGrid().getCurrentLocation().get('r_object_id');
		if(returnFolderId == currentLocationId)
		{
			var returnFolderName = mainView.getMainGrid().getCurrentLocation().get('object_name');
			var returnRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			returnRecord.set('r_object_id', returnFolderId);
			returnRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText("return_to_folder") + returnFolderName);
			returnRecord.set('r_object_type', 'links_folder');
			returnRecord.set('action_caller','links');
			returnRecord.set('caller_id', objectId);
			returnRecord.set('no_tooltip',true);
			returnRecord.set('unit_layer_name', mainView.getMainGrid().getUnitLayerName());	
			mainGrid.gridBreadcrumb.breadcrumbPath.push(returnRecord);
			
			mainGrid.gridBreadcrumb.reloadBreadcrumn();
			mainGrid.fireEvent('updateToolBars',-1,null,false);
		}
		else
		{
			var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/get/gov_folder/" + returnFolderId;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", completeUrl, true);
			xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
			xhr.setRequestHeader('Authorization', '');
			xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
			if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
				xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			}
			xhr.onreadystatechange = function(){
				if (xhr.readyState == XMLHttpRequest.DONE)
				{
					if (xhr.status == 200)
					{
						var returnFolderName = JSON.parse(xhr.responseText).properties.object_name;
						var returnRecord = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
						returnRecord.set('r_object_id', returnFolderId);
						returnRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText("return_to_folder") + returnFolderName);
						returnRecord.set('r_object_type', 'links_folder');
						returnRecord.set('action_caller','links');
						returnRecord.set('caller_id', objectId);
						returnRecord.set('no_tooltip',true);
						returnRecord.set('unit_layer_name',JSON.parse(xhr.responseText).properties.unit_layer_name);	
						mainGrid.gridBreadcrumb.breadcrumbPath.push(returnRecord);
						
						mainGrid.gridBreadcrumb.reloadBreadcrumn();
						mainGrid.fireEvent('updateToolBars',-1,null,false);
					}
					else if (xhr.status == 400)
					{
						ExtDoc.utils.ExtDocUtils.showAlert('error','server_error');
					}
				}
			};
			xhr.send();
		}
	}
});