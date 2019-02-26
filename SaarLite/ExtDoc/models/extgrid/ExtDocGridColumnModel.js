Ext.define('ExtDoc.models.extgrid.ExtDocGridColumnModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name:'label',mapping: '@label',type:'string'},
		{name:'property',mapping: '@property',type:'string'},
		{name:'hidden',mapping: '@hidden',type:'boolean'},
		{name:'type',mapping: '@type',type:'string'}
	]
});
