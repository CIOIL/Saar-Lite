Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridColumn', {
	requires: ['ExtDoc.locales.ExtDocLocaleManager'],
	extend: 'Ext.grid.column.Column',
	menuDisabled: true,
	width: 200,
    flex: null,
	columnConfig: null,
	setColumnConfig: function(newConfig){
		this.columnConfig = newConfig;
	},
	getColumnConfig: function(){
		return this.columnConfig;
	},
	initColumn: function(){
		this.setText(ExtDoc.locales.ExtDocLocaleManager.getText(this.columnConfig.get('label')));
		this.hidden = this.columnConfig.get('hidden');
		this.hideable = !this.columnConfig.get('hidden');
		this.dataIndex = this.columnConfig.get('property');
		this.sortable = this.columnConfig.get('sortable');
	},
	renderer: function(value, metaData, record, row, col, store, gridView){
		if (value && typeof value != "number")
		{
			var nVal = value;
			var preToolTip = Array.isArray(nVal) ? nVal.map(function(x){return x ? x.replace(/"/g, "&quot;") : "";}) : nVal.replace(/"/g, "&quot;");
			var toolTip = Array.isArray(preToolTip) ? preToolTip.join() : preToolTip;
			metaData.tdAttr = 'data-qtip="' + toolTip + '"';
		}
		
		return  value;
	}
});