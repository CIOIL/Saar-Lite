Ext.define('ExtDoc.views.extloginwindow.ExtDocLoginWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: [ 'ExtDoc.views.extloginwindow.ExtDocLoginWindowController' ],
	controller: 'windowLoginController',
	listeners: {
		afterrender: 'setWindowRecord',
		render: function(){
			var loginWindow = this;
			this.el.dom.onkeydown = function(e){
				if (e.keyCode == 13){
					loginWindow.controller.saveWindowAction();
				}
			}
		}
	}
});