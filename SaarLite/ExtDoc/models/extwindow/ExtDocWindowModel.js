Ext.define('ExtDoc.models.extwindow.ExtDocWindowModel', {
	requires: ['ExtDoc.models.extwindow.ExtDocWindowPanelModel','ExtDoc.models.exttoolbar.ExtDocToolBarModel'],
    extend: 'Ext.data.Model',
	hasMany:[
		{
			name: 'panels',
			model: 'ExtDoc.models.extwindow.ExtDocWindowPanelModel',
			associationKey : 'panels'
		},
		{
			name: 'toolbars',
			model: 'ExtDoc.models.exttoolbar.ExtDocToolBarModel',
			associationKey : 'toolbars'
		}		
	],
	fields: [
		{name:'name',mapping: '@name',type:'string'},
		{name:'height',mapping: '@height',type:'integer'},
		{name:'width',mapping: '@width',type:'integer'},
		{name:'closable',mapping: '@closable',type:'boolean'},
		{name:'maximizable',mapping: '@maximizable',type:'boolean'},
		{name:'resizable',mapping: '@resizable',type:'boolean'},
		{name:'validationUrl',mapping: '@validationUrl',type:'string'},
		{name:'validationClass',mapping: '@validationClass',type:'string'},
		{name:'submitUrl',mapping: '@submitUrl',type:'string'},
		{name:'type',mapping: '@type',type:'string'},
		{name:'activeTab',mapping: '@type',type:'integer'}
	]
});
