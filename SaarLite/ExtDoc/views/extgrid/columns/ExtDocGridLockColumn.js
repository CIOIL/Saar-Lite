Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridLockColumn', {
	requires: ['ExtDoc.views.extgrid.columns.ExtDocGridColumn'],
	extend: 'ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	width: 30,
	align: 'center',
	flex: null,
	sortable: false,
	resizable: false,
	menuDisabled: true,
	initColumn: function(){
		this.callParent();
		this.setText("<img src = 'images/lock_header.png'>");
	},	
	renderer: function(value, metaData, record){
		var lockOwner = value;
		var displayValue = null;
		
		if(!Ext.isEmpty(lockOwner))
		{
			if(record.get('locked_by_me'))
			{
				displayValue = '<img src = "images/unlock.png">';
			}
			else
			{
				displayValue = '<img src = "images/lock.png">';	
			}
			var nVal= value.replace(/"/g, "&quot;");
			metaData.tdAttr = 'data-qtip="' + nVal + '"';
		}
		
		if(record.get('is_final')==1)
		{
			displayValue = '<img src = "images/icons/final_doc_16.gif">';
			var nVal= value.replace(/"/g, "&quot;");
			metaData.tdAttr = 'data-qtip="' + nVal + '"';
		}
		
		return displayValue;
	}
});
