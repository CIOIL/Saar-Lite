Ext.define('ExtDoc.tools.controllers.ExtDocReadController', {
	requires: [ 'ExtDoc.tools.controllers.ExtDocEditController' ],
	extend: 'ExtDoc.tools.controllers.ExtDocEditController',
	alias: 'controller.readController',
	serviceMethod: "content/read/",
	operation: "Read"
});