Ext.define('ExtDoc.views.extimportdocumentwindow.ExtDocImportDocumentWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.extimportdocumentwindow.ExtDocImportDocumentWindowController'],
	controller: 'windowImportDocumentController',
	anchor: "importDocWindow",
	afterRender: function(){
		this.callParent();
	}
});