Ext.define('ExtDoc.views.extfields.ExtDocCheckBoxField', {
	extend: 'Ext.form.field.Checkbox',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	listeners: {
		afterrender: function(){
			this.updateAfterRender();
			this.labelEl.setStyle({
		        width: '120px'
		    });
		}
	}
});