Ext.define('ExtDoc.models.extwindow.ExtDocWindowPanelModel', {
	requires: ['ExtDoc.models.extwindow.ExtDocWindowFieldModel'],
    extend: 'Ext.data.Model',
	hasMany:{
		name: 'fields',
		model: 'ExtDoc.models.extwindow.ExtDocWindowFieldModel',
		associationKey : 'fields'
	},	
	fields: [
		{name:'name',mapping: '@name',type:'string'},
		{name:'columns',mapping: '@height',type:'integer'},
		{name:'rows',mapping: '@width',type:'integer'},
		{name:'valign',mapping: '@valign',type:'string'},
		{name:'style',mapping: '@style',type:'string'},
		{name:'labelWidth',mapping: '@labelWidth',type:'integer'}
	]
});
