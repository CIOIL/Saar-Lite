Ext.define('ExtDoc.views.exttitlebarpanel.ExtDocSearchTool', {
	requires: [	'ExtDoc.views.exttoolbar.ExtDocTool',
				'ExtDoc.tools.controllers.ExtDocQuickSearchController'],
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
	controller: 'quickSearchController',
	listeners: {
		click: 'doQuickSearch'
	},
	style: 'padding:2px;background:#1586C5;',
	icon: 'images/tools/Icon-Search.png'
});