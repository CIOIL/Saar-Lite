Ext.define('ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFaforitesGridColumn', {
	requires: ['ExtDoc.locales.ExtDocLocaleManager'],
	extend: 'Ext.grid.column.Column',
	flex: 1,
	menuDisabled: true,
	columnPropertyId: null,
	columnConfig: null,
	setColumnConfig: function(newConfig){
		this.columnConfig = newConfig;
	},
	getColumnConfig: function(){
		return this.columnConfig;
	},
	setColumnText: function(newText){
		this.text = newText;
	},
	setColumnHidden: function(newHidden){
		this.hidden = newHidden;
		this.hideable = !newHidden;
	},
	initColumn: function(){
		this.setColumnText(ExtDoc.locales.ExtDocLocaleManager.getText(this.columnConfig.get('label')));
		this.setColumnHidden(this.columnConfig.get('hidden'));
		this.dataIndex = this.columnConfig.get('property');
		this.sortable = this.columnConfig.get('sortable');
	},
	renderer: function(value, metaData, record, row, col, store, gridView){
		if( !Ext.isEmpty(record.get('object_name')) )
		{
			var object_name = record.get('object_name').replace(/"/g, '&quot;');
			metaData.tdAttr = 'data-qtip="' + object_name +  '"';
		}
		return  value;
	}
});
