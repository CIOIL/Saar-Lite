 Ext.define('ExtDoc.views.extfields.ExtDocTextareaField', {
	extend: 'Ext.form.field.TextArea',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	listeners: {
		afterrender: function(){
			this.updateAfterRender();	
		}
	}
});