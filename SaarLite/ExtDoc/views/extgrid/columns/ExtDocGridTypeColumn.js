Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridTypeColumn', {
	requires: ['ExtDoc.views.extgrid.columns.ExtDocGridColumn'],
	extend: 'ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	width: 30,
	sortable: false,
	resizable: false,
	menuDisabled: true,
	renderer: function(value, metaData, record, row, col, store, gridView){
		var imageName = value;
		
		if(!Ext.isEmpty(record.get('a_content_type')))
		{
			imageName = record.get('a_content_type');
		}
		
		var nVal = !Ext.isEmpty(ExtDoc.locales.ExtDocLocaleManager.getText(value)) ? ExtDoc.locales.ExtDocLocaleManager.getText(value) : "";
		nVal= nVal.replace(/"/g, "&quot;");
		metaData.tdAttr = 'data-qtip="' + nVal + '"';
		
		return '<img src = "images/icons/' + imageName + '.gif" draggable="false" ondragstart="return false;" style="user-drag:none; user-select:none; ms-user-select:none;">';
	}
});