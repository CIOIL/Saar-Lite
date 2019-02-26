Ext.define('ExtDoc.tools.controllers.ExtDocViewSourceController', {
	extend: 'ExtDoc.tools.controllers.ExtDocEditController',
	alias: 'controller.sourceController',
	serviceMethod: "content/viewSource/",
	operation: "Read"
})