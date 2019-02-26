Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridCodeTableColumn', {
	requires: ['ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	           'ExtDoc.stores.extwindow.ExtDocWindowStore'],
	extend: 'ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	renderer: function(value, metaData, record, row, col, store, gridView){
		var objectType = record.get("r_object_type");
		var attribute = metaData.column.dataIndex;
		var rValue = typeof value == 'boolean' ? value ? 'T' : 'F' : value;
		var attributeValue = record.get(attribute);
		
		try
		{
			if (Array.isArray(attributeValue))
			{
				rValue = [];
				
				for (var i = 0; i < attributeValue.length; i++)
				{
					var code = attributeValue[i];
					
					if (ExtDoc.utils.ExtDocVaLoader.va[objectType][attribute][code])
					{
						rValue.push(ExtDoc.utils.ExtDocVaLoader.va[objectType][attribute][code]);
					}
					else
					{
						rValue.push(code);
					}
				}
			}
			else
			{
				if (ExtDoc.utils.ExtDocVaLoader.va[objectType][attribute][rValue])
				{
					rValue = ExtDoc.utils.ExtDocVaLoader.va[objectType][attribute][rValue];
				}
			}
			
			var preToolTip = Array.isArray(rValue) ? rValue.map(function(x){return x ? x.replace(/"/g, "&quot;") : "";}) : rValue.replace(/"/g, "&quot;");
			var toolTip = Array.isArray(preToolTip) ? preToolTip.join() : preToolTip;
			metaData.tdAttr = 'data-qtip="' + toolTip + '"';
		}
		catch (e)
		{
			
		}
		
		return rValue;
	}
});