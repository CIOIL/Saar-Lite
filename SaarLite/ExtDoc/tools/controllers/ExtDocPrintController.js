Ext.define('ExtDoc.tools.controllers.ExtDocPrintController', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocEditController' ],
	extend: 'ExtDoc.tools.controllers.ExtDocEditController',
	alias: 'controller.printController',
	serviceMethod: "content/read/",
	operation: "Print"
});