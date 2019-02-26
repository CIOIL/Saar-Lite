Ext.define('ExtDoc.views.extfields.ExtDocPanelField', {
	extend: 'Ext.panel.Panel',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	name: '',
	getName: function(){
		return this.name;
	}
});