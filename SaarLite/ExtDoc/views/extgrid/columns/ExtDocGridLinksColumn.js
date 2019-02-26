Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridLinksColumn', {
	requires: ['ExtDoc.views.extgrid.columns.ExtDocGridColumn'],
	extend: 'ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	width: 30,
	sortable: false,
	resizable: false,
	menuDisabled: true,
	renderer: function(value, metaData, record, row, col, store, gridView){		
		return record && record.get('relation_count') && record.get('relation_count') > 0 ? 
		'<img src = "images/icons/icoLinkPage.gif">' : "";
	}
});