Ext.define('ExtDoc.views.extnewfolderwindow.ExtDocNewFolderWindow', {
	requires: ['ExtDoc.views.extnewfolderwindow.ExtDocNewFolderWindowController',
				'ExtDoc.views.extfields.ExtDocLocationField',
				'ExtDoc.views.extfields.ExtDocAuthorField',
				'ExtDoc.views.extfields.ExtDocNumberField',
				'ExtDoc.views.extfields.ExtDocBooleanComboField',
				'ExtDoc.views.extfields.ExtDocRadioField'],
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	controller: 'windowNewFolderController',
	anchor: 'newFolderWindow',
	afterRender: function(){
		this.callParent();
	}
});