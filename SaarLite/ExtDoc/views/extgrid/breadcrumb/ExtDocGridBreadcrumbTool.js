Ext.define('ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumbTool', {
	requires: ['ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumbToolController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'breadcrumbToolController',
	listeners: {
		click:'locationClick'
	},	
	toolRecord: null,
	setToolRecord: function(toolRecord){
		this.toolRecord = toolRecord;
	},
	getToolRecord: function(){
		return this.toolRecord;
	},
	initTool: function(){
		this.setText(this.getToolRecord().get('object_name'));
	},
	initToolTip: function(fullPath)
	{
		var currentToolObjectName = this.getToolRecord().get('object_name');
		var toolTipPath= "";
		for(var index = 1 ; index < fullPath.length ; index++)
		{	
			var objectName = fullPath[index].get('object_name');
			if(index > 1)
			{
				toolTipPath = toolTipPath + "/";
			}
			toolTipPath = toolTipPath +  fullPath[index].get('object_name');
			
			if(currentToolObjectName == objectName)
			{
				break;
			}
		}
		
		var noTooltip = this.getToolRecord().get('no_tooltip');
		var tooltipToSet = noTooltip ? this.getToolRecord().get('object_name') : toolTipPath; 
		this.setTooltip(tooltipToSet);
		ExtDoc.utils.ExtDocLocation.setApplicationLocationPath(tooltipToSet);
	}
});