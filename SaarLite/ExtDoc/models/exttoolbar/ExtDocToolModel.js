Ext.define('ExtDoc.models.exttoolbar.ExtDocToolModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name:'name',mapping: '@name',type:'string'},
		{name:'label',mapping: '@label',type:'string'},
		{name:'user_permit',mapping: '@user_permit',type:'integer'},
		{name:'type',mapping: '@type',type:'string'},
		{name:'class_style',mapping: '@class_style',type:'string'}
	]
});
