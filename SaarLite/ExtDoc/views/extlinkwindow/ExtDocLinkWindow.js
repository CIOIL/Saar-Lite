Ext.define('ExtDoc.views.extlinkwindow.ExtDocLinkWindow', {
	requires: ['ExtDoc.views.extlinkwindow.ExtDocLinkWindowController',
				'ExtDoc.views.extgrid.tools.ExtDocAddLocationTool'],
	extend: 'ExtDoc.views.extlocationwindow.ExtDocLocationWindow',
	controller: 'windowLinkController'
});