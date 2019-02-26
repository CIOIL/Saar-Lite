Ext.define('ExtDoc.views.extgrid.columns.ExtDocGridVersionLabelColumn', {
	extend: 'ExtDoc.views.extgrid.columns.ExtDocGridColumn',
	initColumn: function(){
		ExtDoc.utils.ExtDocComponentManager.registerComponent('versionLabelColumn', this);
		
		if (this.columnConfig)
		{
			this.callParent(arguments);
		}
	}
});