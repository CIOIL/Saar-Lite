Ext.define('ExtDoc.models.extgrid.ExtDocGridModel', {
	requires: [ 'ExtDoc.models.extgrid.ExtDocGridColumnModel',
				'ExtDoc.models.exttoolbar.ExtDocToolBarModel',
				'ExtDoc.models.extmenu.ExtDocMenuModel'],
    extend: 'Ext.data.Model',
	hasMany:[
		{
			name: 'columns',
			model: 'ExtDoc.models.extgrid.ExtDocGridColumnModel',
			associationKey : 'columns'
		},
		{
			name: 'toolbars',
			model: 'ExtDoc.models.exttoolbar.ExtDocToolBarModel',
			associationKey : 'toolbars'
		},
		{
			name: 'menus',
			model: 'ExtDoc.models.extmenu.ExtDocMenuModel',
			associationKey : 'menus'
		}
	],
	fields: [
		{name:'name',mapping: 'name',type:'string'},
		{name:'home',mapping: 'home',type:'string'},
		{name:'orderby',mapping: 'orderby',type:'string'}
	]
});
