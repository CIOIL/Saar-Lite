Ext.define('ExtDoc.models.extwindow.ExtDocWindowFieldModel', {
    extend: 'Ext.data.Model',
	fields: [
		{name:'name',mapping: '@name',type:'auto'},
		{name:'label',mapping: '@label',type:'auto'},
		{name:'type',mapping: '@type',type:'auto'},
		{name:'style',mapping: '@style',type:'auto'},
		{name:'dataUrl',mapping: '@dataUrl',type:'auto'},
		{name:'dataUrl',mapping: '@dataSource',type:'auto'},
		{name:'selectedIndex',mapping: '@selectedIndex',type:'auto'}
	]
});
