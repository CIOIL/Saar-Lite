Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridLocationColumn', {
	requires: ['ExtDoc.utils.ExtDocLocationColumnUtils'],
	extend: 'ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	initColumn: function(){
		this.callParent();
		ExtDoc.utils.ExtDocLocationColumnUtils.registerColumn(this);
	},
	// fill the column with the objects folder path
	renderer: function(value, metaData, record, row, col, store, gridView){	
		
        var path = "";
		
		if(!Ext.isEmpty(record.get('r_folder_path')))
		{
			var val = record.get('r_folder_path');
			var preToolTip = Array.isArray(val) ? val.map(function(x){return x ? x.replace(/"/g, "&quot;") : "";}) : val.replace(/"/g, "&quot;");
			var toolTip = Array.isArray(preToolTip) ? preToolTip.join() : preToolTip;
			path = '<span style="color:blue; text-decoration:underline">' + val + '</span>';
			metaData.tdAttr = 'data-qtip="' + toolTip + '"';
		}
		return path;
	}
	
});