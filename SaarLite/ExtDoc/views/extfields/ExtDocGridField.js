Ext.define('ExtDoc.views.extfields.ExtDocGridField', {
	extend: 'Ext.grid.Panel',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	name: '',
	getName: function(){
		return this.name;
	}
});