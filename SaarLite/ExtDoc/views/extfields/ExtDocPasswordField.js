Ext.define('ExtDoc.views.extfields.ExtDocPasswordField', {
	requires: ['ExtDoc.views.extfields.ExtDocTextField'],
	extend : 'Ext.form.field.Text',
	mixins: ['ExtDoc.views.extfields.ExtDocTextField'],
	inputType: 'password',
	/*
	 *  Overriding  the listeners of the ExtDocTextField , to avoid the tooltip functionality -
	 *  on the password.
     *  In this afterrender listener - the tooltip functionality is absence.
	 */
		listeners: { 
			afterrender: function(c){
				this.maxLengthText= ExtDoc.locales.ExtDocLocaleManager.getText('field_content_max_length_error');
				this.updateAfterRender();	
			},
			focus: function() { 
				if (this.onfocus && this.onfocus.length > 0){
					eval(this.onfocus);
				}
			}
		},
});