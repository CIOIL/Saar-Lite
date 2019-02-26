Ext.define('ExtDoc.views.extnewdocumentwindow.ExtDocNewDocumentWindow', {
	requires: ['ExtDoc.views.extnewdocumentwindow.ExtDocNewDocumentWindowController',
				'ExtDoc.views.extfields.ExtDocLocationField',
				'ExtDoc.views.extfields.ExtDocAuthorField',
				'ExtDoc.views.extfields.ExtDocNumberField',
				'ExtDoc.views.extfields.ExtDocBooleanComboField',
				'ExtDoc.views.extfields.ExtDocRadioField'],
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	controller: 'windowNewDocumentController',
	anchor: "newDocWindow",
	afterRender: function(){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		mainGrid.setSelection();
		this.callParent();
	}
});