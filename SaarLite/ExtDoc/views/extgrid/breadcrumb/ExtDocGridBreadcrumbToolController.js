Ext.define('ExtDoc.views.extgrid.breadcrumb.ExtDocGridBreadcrumbToolController', {
	extend : 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.breadcrumbToolController',
	locationClick: function(){
		var loggedIn = this.checkLogin();
		if (!loggedIn) return;
		this.getView().getToolParent().changeLocation(this.getView().getToolRecord(),'toolbar');
	}
});