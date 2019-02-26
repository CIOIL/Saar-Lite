Ext.define('ExtDoc.views.extinfowindow.ExtDocInfoWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.extinfowindow.ExtDocInfoWindowController'],
	controller: 'windowInfoController',
	id: 'infowindow'
});