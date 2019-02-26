Ext.define('ExtDoc.tools.controllers.ExtDocShowVersionsController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.showVersionsController',
	showVersions: function(){
		var loggedIn = this.checkLogin();
		if(!loggedIn)return;
		
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var currentLocation = mainView.getMainGrid().getCurrentLocation();
		var objectId = mainView.getMainGrid().getSelection()[0].get('r_object_id');
		
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/showVersions/" + objectId;
		var versionsStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');

		versionsStore.initStore(completeUrl);
		versionsStore.setStoreMethod('GET');

		mainGrid.setStore(versionsStore);
		mainGrid.fireEvent('initGridPath');
		mainGrid.getStore().load();

		mainGrid.gridBreadcrumb.breadcrumbPath = mainGrid.gridBreadcrumb.breadcrumbPath.splice(0, 1);
		
		var versionsRecord =  Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
		versionsRecord.set('r_object_id', ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId());
		versionsRecord.set('object_name', ExtDoc.locales.ExtDocLocaleManager.getText('versions'));
		versionsRecord.set('no_tooltip',true);
		mainGrid.gridBreadcrumb.breadcrumbPath.push(versionsRecord);
		
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
			returnRecord.set('r_object_type', 'versions_folder');
			returnRecord.set('action_caller','versions');
			returnRecord.set('caller_id', objectId);
			returnRecord.set('no_tooltip',true);
			returnRecord.set('unit_layer_name', mainView.getMainGrid().getUnitLayerName());
			mainGrid.gridBreadcrumb.breadcrumbPath.push(returnRecord);
			
			mainGrid.gridBreadcrumb.reloadBreadcrumn();
			mainGrid.fireEvent('updateToolBars',-1,null,false);
			ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
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
						returnRecord.set('r_object_type', 'versions_folder');
						returnRecord.set('action_caller','versions');
						returnRecord.set('caller_id', objectId);
						returnRecord.set('no_tooltip',true);
						returnRecord.set('unit_layer_name',JSON.parse(xhr.responseText).properties.unit_layer_name);	
						mainGrid.gridBreadcrumb.breadcrumbPath.push(returnRecord);
						
						mainGrid.gridBreadcrumb.reloadBreadcrumn();
						mainGrid.fireEvent('updateToolBars',-1,null,false);
						ExtDoc.utils.ExtDocLocationColumnUtils.setColumnVisibility();
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