Ext.define('ExtDoc.views.extcheckinwindow.ExtDocCheckinWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.extcheckinwindow.ExtDocCheckinWindowController'],
	controller: 'windowCheckinController',
	id: 'checkinwindow'
});