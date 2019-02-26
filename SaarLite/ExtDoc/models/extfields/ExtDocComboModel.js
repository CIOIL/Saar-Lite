Ext.define('ExtDoc.models.extfields.ExtDocComboModel', {
    extend: 'Ext.data.Model',
	fields: [
		{name:'code',mapping:'properties.code'},
		{name:'value',mapping:'properties.value'},
		{name:'image',mapping:'properties.image'}
	]
});