Ext.define('ExtDoc.models.extmenu.ExtDocMenuModel',{
	requires:['ExtDoc.models.exttoolbar.ExtDocToolModel'],
	extend: 'Ext.data.Model',
	hasMany:[
		{
			name: 'items',
			model: 'ExtDoc.models.exttoolbar.ExtDocToolModel',
			associationKey : 'items'
		}
	],
	fields: [
		{name:'role',mapping: 'role',type:'string'},
		{name:'type',mapping: 'type',type:'string'}
	]
});