Ext.define('ExtDoc.views.extfields.ExtDocNumberField', {
	extend: 'Ext.form.field.Number',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	allowDecimals:true,
	listeners: {
		afterrender: function(c){
			Ext.create('Ext.tip.ToolTip', {
		        target: c.inputId,
		        trackMouse: true,
		        renderTo: Ext.getBody(),
		        listeners: {
            		beforeshow: function updateTipBody(tip) {
            			if (!c.el.component.rawValue){
							return false;
						}
                		tip.update(c.el.component.rawValue);
            		}
        		}
	      	});
			this.maxLengthText= ExtDoc.locales.ExtDocLocaleManager.getText('field_content_max_length_error');
			this.updateAfterRender();	
		},
		focus: function() {
			if (this.onfocus && this.onfocus.length > 0){
				eval(this.onfocus);
			}
		},
	},
	enforceMaxLength: true,
	maxLength: 127,
	onFocusLeave : function(e) {
		if(this.value == null)
			this.setValue(0);
	}
});