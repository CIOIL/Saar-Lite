Ext.define('ExtDoc.tools.controllers.ExtDocFavoritesMenuController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.favoritesMenuController',
	objectsToAdd: null,
	objectsToDelete: null,
	favoritesExitsArray: null,
	getObjectsToAdd: function() {
		return this.objectsToAdd;
	},
	getObjectsToDelete: function(){
		return this.objectsToDelete;
	},
	deleteFromFavoritesMenuClick: function(){
		
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObjects = mainGrid.getSelection();
		this.objectsToDelete = new Array();

		for (var index = 0; index < selectedObjects.length; index++)
		{
			var selectedObject = selectedObjects[index];

			if (!Ext.isEmpty(selectedObject.get('r_object_id')))
			{
				this.getObjectsToDelete().push(selectedObject.get('r_object_id'));
			}
		}
		this.showDeleteFromFavoritesConfirmBox();
	},
	showDeleteFromFavoritesConfirmBox: function(){
		var confirmationTitle = ExtDoc.locales.ExtDocLocaleManager.getText("delete_from_favorites_confirmation_title");
		var confirmationMessageText = ExtDoc.locales.ExtDocLocaleManager.getText("delete_from_favorites_confirmation_message_text");
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
			var currentController = this;
			if (btnText === "no")
			{

			}
			else if (btnText === "yes")
			{
				var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
				var objsToDelete = currentController.getObjectsToDelete();
				var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/updateFavorites/";
				var xhr = new XMLHttpRequest();
				xhr.open('POST', completeUrl, true);
				xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
				xhr.setRequestHeader('Authorization', '');
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
				if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
					xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
				}
				var json = currentController.buildDeleteFavoritesJson(currentController.getObjectsToDelete());
				xhr.onreadystatechange = function(e){
					if (this.readyState == 4 && this.status == 200)
					{
						var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
						var mainGrid = mainView.getMainGrid();
						var currentLocation = mainGrid.getCurrentLocation();
						if (currentLocation.get('r_object_id') == ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId())
						{
							var btn = ExtDoc.utils.ExtDocComponentManager.getComponent('favdocsbutton');
							btn.fireEvent('click');
						}
						else
						{
							//mainGrid.fireEvent('reloadCurrent');
							var selectedRecords = mainView.getMainGrid().getSelection();
							var store = mainView.getMainGrid().getStore();
							store.remove(selectedRecords);// remove the selected row .
						}
						
						currentController.showRemoveSuccessToast();
					}
					else if (this.readyState == 4 && this.status == 400)
					{
						ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
					}
				};

				xhr.send(json);
			}
		}, this);
	},
	showRemoveSuccessToast: function(){
		var toastTitle = ExtDoc.locales.ExtDocLocaleManager.getText('delete_from_favorites_confirmation_title');
		var removeFromFavoritesSuccessful = ExtDoc.locales.ExtDocLocaleManager.getText('delete_from_favorites_success');
		var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
		Ext.toast({
			autoCloseDelay: toastTimeout,
			html: removeFromFavoritesSuccessful,
				title: toastTitle,
				rtl: toastRtl
			});
	},
	showAddSuccessToast: function(){
		var toastTitle = ExtDoc.locales.ExtDocLocaleManager.getText('addtofavorites');
		var addToFavoritesSuccessful = ExtDoc.locales.ExtDocLocaleManager.getText('add_to_favorites_success');
		var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
		Ext.toast({
			autoCloseDelay: toastTimeout,
			html: addToFavoritesSuccessful,
				title: toastTitle,
				rtl: toastRtl
			});
	},
	favoritesMenuClick: function() {
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		this.getView().setDisabled(true);
		this.getView().mask('', 'loading');

		this.initFavoritesList();
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObjects = mainGrid.getSelection();
		this.objectsToAdd = new Array();
		for (var index = 0; index < selectedObjects.length; index++)
		{
			var selectedObject = selectedObjects[index];

			if (!Ext.isEmpty(selectedObject.get('r_object_id')))
			{
				this.getObjectsToAdd().push(selectedObject);
			}
		}
		this.addNextToFavorites();
	},
	addNextToFavorites: function() {
		if (this.getObjectsToAdd().length > 0)
		{
			this.favoritesAdd(this.getObjectsToAdd()[this.getObjectsToAdd().length - 1]);
			this.getObjectsToAdd().splice(-1, 1);
		}
		else
		{
			this.handelFavoritesExistList();
			this.getView().unmask();
			this.getView().setDisabled(false);
			//Refreshing Favorites Toolbar Panel
			ExtDoc.utils.ExtDocComponentManager.getComponent('favoritesToolbar').reloadToolbarStore();
			var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
			var mainGrid = mainView.getMainGrid();
			mainGrid.fireEvent('reloadCurrent');
			this.showAddSuccessToast();
		}
	},
	favoritesAdd: function(objectToAdd) {
		var currentController = this;
		var objectId = objectToAdd.get('r_object_id');
		var objectName = objectToAdd.get('object_name');
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/addFavorite/" + objectId;

		ExtDoc.utils.ExtDocAjax.setMaskObject(null);
		Ext.Ajax.request({
			url: completeUrl,
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
			method: 'POST',
			success: function(response, opts) {
				if(ExtDoc.utils.ExtDocUtils.isFolder(objectToAdd))
				{
					currentController.finalizeAdd(response.status, objectName);
				}
				else
				{
					currentController.addNextToFavorites();
				}
			},
			failure: function(response, opts) {
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'servercommerror', status);
			}
		});
	},
	finalizeAdd: function(status, folderName) {
		var currentFavorites = this;

		if (status == 200)
		{
			currentFavorites.addNextToFavorites();
		} else if (status == 201)
		{
			this.setFavoritesExistList(folderName);
			currentFavorites.addNextToFavorites();
		}
	},
	setFavoritesExistList: function(folderName) {
		var favoritesList = "";

		if (this.favoritesExitsArray.length > 0)
		{
			favoritesList = this.favoritesExitsArray[0];
		}

		favoritesList += ExtDoc.locales.ExtDocLocaleManager.getText('favorites_folder_exist') + folderName + '.<br/>';
		this.favoritesExitsArray[0] = favoritesList;
	},
	handelFavoritesExistList: function() {
		if (this.favoritesExitsArray.length > 0)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('favorites_title', 'favorites_message', this.favoritesExitsArray);
		}
	},
	initFavoritesList: function() {
		this.favoritesExitsArray = new Array();
	},
	buildDeleteFavoritesJson: function(objectsToDelete){
		updateObjects = [];
		deleteObjects = objectsToDelete;
		
		var object = {
			"properties": {
				"updateObjects": updateObjects,
				"deleteObjects": deleteObjects
			}
		};

		return Ext.JSON.encode(object);
	}
});