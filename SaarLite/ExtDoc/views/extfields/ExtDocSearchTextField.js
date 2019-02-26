 Ext.define('ExtDoc.views.extfields.ExtDocSearchTextField', {
	extend: 'Ext.form.TextField',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	listeners: {
		afterrender: function(){
			this.updateAfterRender();
		} 
	}
});