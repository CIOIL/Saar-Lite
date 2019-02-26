Ext.define('ExtDoc.models.exttoolbar.ExtDocToolBarModel', {
	requires: ['ExtDoc.models.exttoolbar.ExtDocToolModel'],
    extend: 'Ext.data.Model',
	hasMany:[
		{
			name: 'tools',
			model: 'ExtDoc.models.exttoolbar.ExtDocToolModel',
			associationKey : 'tools'
		}
	],
	fields: [
		{name:'name',mapping: '@name',type:'string'},
		{name:'dock',mapping: '@dock',type:'string'}
	]
});
