Ext.define('ExtDoc.views.extfields.ExtDocDateField', {
	extend: 'Ext.form.DateField',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	listeners: {
		afterrender: function(c){
			Ext.create('Ext.tip.ToolTip', {
		        target: c.inputId,
		        trackMouse: true,
		        renderTo: Ext.getBody(),
		        listeners: {
            		beforeshow: function updateTipBody(tip) {
                		tip.update(c.el.component.rawValue);
            		}
        		}
	      	});
			this.updateAfterRender();
		}
	},
	format: 'd/m/Y H:i:s',
	altFormats: 'H:i:s d/m/Y|m/d/Y H:i:s A|m/d/Y g:i:s A|n/j/Y g:i:s A|n/j/Y h:i:s A'
});