Ext.define('ExtDoc.views.extadvsearchwindow.ExtDocAdvSearchWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.extadvsearchwindow.ExtDocAdvSearchWindowController'],
	controller: 'windowAdvSearchController',
	id: 'advsearchwindow',
/*	listeners: {
		show: function (win, width, height, eOpts) {
			var currentWindow = win;
			var map = new Ext.KeyMap(win.getEl(), {
				key: Ext.EventObject.ENTER,
				fn: function(){
					currentWindow.controller.doAdvSearch();
				}
			});
		}
	}*/
});