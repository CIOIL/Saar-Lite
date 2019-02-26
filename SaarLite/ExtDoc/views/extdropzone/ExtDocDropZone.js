Ext.define('ExtDoc.views.extdropzone.ExtDocDropZone', {
	requires: ['ExtDoc.tools.ExtDocFileUpload'],
	extend: 'Ext.form.Panel',
	header: false,
	region: 'south',
	floatable: false,
	autoScroll: true,
	height: 170,
	minHeight: 100,
	maxHeight: 170,
	collapsed: true,
	mainView: null,
	dropEnable: false,
	uploadFilesCounter: 0,
	initDropZone: function(newMainView){
		this.setMainView(newMainView);
		this.setDropZoneId();
		this.setDropZoneTitle();
	},
	setDropZoneId: function(){
		this.id = "dropzone" + "_" + ExtDoc.locales.ExtDocLocaleManager.getLanguage() + "_" + ExtDoc.utils.ExtDocUtils.getRandomNumber();
	},
	setDropZoneTitle: function(){
		this.title = ExtDoc.locales.ExtDocLocaleManager.getText("dropzone");
	},
	setMainView: function(newMainView){
		this.mainView = newMainView;
	},
	getMainView: function(){
		return this.mainView;
	},
	getUploadFilesCounter: function(){
		return this.uploadFilesCounter;
	},
	setUploadFilesCounter: function(newCounter){
		this.uploadFilesCounter = newCounter;
	},
	listeners:{
		afterrender: function(){
			
			var elDrop = this.getEl().dom;
			var currentPanel = this;
			var onDD = false;
			elDrop.addEventListener('dragover', function(event) {
				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';
				currentPanel.showDropping();
			});

			elDrop.addEventListener('dragleave', function(event) {
				currentPanel.hideDropping();
			});
		
			document.body.ondragover = function (event){
				if(onDD)
				{
					document.body.style.opacity = "1";
				}
				else
				{
					document.body.style.opacity = "0.4";
				}
			}
			document.body.ondragleave = function (event){
				document.body.style.opacity = "1";
				onDD = false;
			}
			elDrop.ondragover = function (event){
				onDD = true;
			}
			elDrop.ondragleave = function (event){
				onDD = false;
			}
			elDrop.addEventListener('drop', function(event) {
				event.preventDefault();
				document.body.style.opacity = "1";
				onDD = true;
				currentPanel.onDropEvent(event);
			});
			document.body.ondrop = function (event){
				event.preventDefault();
				document.body.style.opacity = "1";
				if(!onDD)
				{
					Ext.toast({
						html: ExtDoc.locales.ExtDocLocaleManager.getText('cannot_drop_here_alert'), 
						title: ExtDoc.locales.ExtDocLocaleManager.getText('warning'),				
				    });
				}
				onDD = false;
			};
		},
		collapse: function(){
			if (ChangeContent)
			{
				var changeContentTitle = ExtDoc.locales.ExtDocLocaleManager.getText('change_content');
				var contentChangeCancelled = ExtDoc.locales.ExtDocLocaleManager.getText('content_change_cancelled');
				var toastRtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
				var toastTimeout = ExtDoc.config.ExtDocConfig.toast_timeout;
				Ext.toast({
					autoCloseDelay: toastTimeout,
    				html: contentChangeCancelled,
   					title: changeContentTitle,
     				rtl: toastRtl
 				});
			}
			ChangeContent = false;
			this.getMainView().getMainGrid().unmask();
		}
	},
	showDropping: function(){
		this.setBodyStyle('background-color','lightblue');
		this.dropEnable = true;
	},
	hideDropping: function(){
		this.setBodyStyle('background-color','white');
		this.dropEnable = false;
	},
	onDropEvent: function(event){
		this.setBodyStyle('background-color','white');
		var currentFolderObjectType = this.getMainView().getMainGrid().getCurrentLocation().get('r_object_type');
		
		if (ChangeContent)
		{
			if(this.dropEnable && this.getUploadFilesCounter() == 0 && event.dataTransfer.files.length == 1)
			{
				this.handleFiles(event.dataTransfer.files);
			}
			else if (event.dataTransfer.files.length != 1 || this.getUploadFilesCounter() != 0)
			{
				ExtDoc.utils.ExtDocUtils.showAlert('error','upload_change_content_window_error');
			}
			else
			{
				ChangeContent = false;
				this.getMainView().getMainGrid().unmask();
				ExtDoc.utils.ExtDocUtils.showAlert('error','upload_window_error');
				this.setCollapsed(true);
			}
		}
		else if (!currentFolderObjectType || currentFolderObjectType == 'clipboard' || currentFolderObjectType == 'links_folder')
		{
			Ext.toast({
				html: ExtDoc.locales.ExtDocLocaleManager.getText('cannot_drop_here_alert'), 
				title: ExtDoc.locales.ExtDocLocaleManager.getText('warning'),				
		    });
			return;
		}
		else
		{
			if(this.dropEnable && this.getUploadFilesCounter() == 0 && !(this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getHomeFolderId() || this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getRecentDocsFolderId() || this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId() || this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId()))
			{
				if (this.getCurrentFolder().get('r_object_type') == 'gov_unit_folder')
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','drag_to_unit_folder_error');
					this.setCollapsed(true);
				}
				else if(this.getCurrentFolder().get('user_permit') < 6 ||
						this.getCurrentFolder().get('r_object_type') == 'dm_cabinet')
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','write_folder_permissions_error');
					this.setCollapsed(true);
				}
				else
				{
					this.handleFiles(event.dataTransfer.files);
				}
			}
			else
			{
				if (this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getHomeFolderId())
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','cannot_upload_to_cabinets');
				}
				else if (this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getRecentDocsFolderId())
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','cannot_upload_to_recent_docs');
				}
				else if (this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getSearchResultsFolderId())
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','cannot_upload_to_search_results');
				}
				else if (this.getCurrentFolder().get('r_object_id') == ExtDoc.utils.ExtDocUtils.getFavoriteDocsFolderId())
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','cannot_upload_to_favotites');
				}
				else
				{
					ExtDoc.utils.ExtDocUtils.showAlert('error','upload_window_error');
				}
				this.setCollapsed(true);
			}
		}
	},
	handleFiles: function(files){
		this.setUploadFilesCounter(files.length);
		
		if(ChangeContent)
		{
		
			for(var index = 0 ; index < files.length ; index++)
			{
				var file = files[index];
				var fileUploader = Ext.create('ExtDoc.tools.ExtDocFileUpload');
				fileUploader.init(this,file);
				var selectedRecord = this.getMainView().getMainGrid().getSelection();
				var r_object_id = selectedRecord[0].get('r_object_id');
				fileUploader.changeContent(r_object_id);
			}
		}
		else
		{
			for(var index = 0 ; index < files.length ; index++)
			{
				var file = files[index];
				var fileUploader = Ext.create('ExtDoc.tools.ExtDocFileUpload');
				
				fileUploader.init(this,file);
				fileUploader.upload();
			}
		}
	},
	reportFileUploadFinalize: function(){
		var uploadFileCount = this.getUploadFilesCounter();
		this.setUploadFilesCounter(uploadFileCount - 1);
		
		if(uploadFileCount == 0 || !ChangeContent)
		{
			this.getMainView().getMainGrid().fireEvent('reloadCurrent');
		}
		ChangeContent = false;
		this.setCollapsed(true);
	},
	getCurrentFolder: function(){
		return this.getMainView().getMainGrid().getCurrentLocation();
	}
});