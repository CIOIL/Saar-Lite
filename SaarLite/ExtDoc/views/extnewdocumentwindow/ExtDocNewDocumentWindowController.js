Ext.define('ExtDoc.views.extnewdocumentwindow.ExtDocNewDocumentWindowController', {
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowNewDocumentController',
	saveWindowAction: function(){
		this.submitWindowToServer(true);
	},
	submitSuccess: function(newDocumentId){
		var objectName = this.getView().getFieldByName('object_name').getValue();
		this.getView().getFieldByName('object_name').setValue(objectName.replace('\"', ''));
		
		this.callParent(arguments);
		
		if (!newDocumentId){
			return;
		}
		
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		mainGrid.newDocumentObjectId = newDocumentId;
	}
});