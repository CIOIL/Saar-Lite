Ext.define('ExtDoc.views.extfields.ExtDocHiddenField', {
	extend: 'Ext.form.field.Hidden',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	listeners: {
		afterrender: function(){
			this.updateAfterRender();	
		}
	}
});