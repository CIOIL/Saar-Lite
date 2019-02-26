Ext.define('ExtDoc.views.extfields.ExtDocStatusComboField', {	
	extend: 'ExtDoc.views.extfields.ExtDocComboField',
	listeners: {		 
		select: function (comp, record, index) {			
			if (this.dependantRequired)
			{
				this.handleDependant(comp.getValue());
			}              
        }
	},
	handleDependant: function (selectedValue){
		var dependantField = this.getFieldPanel().getPanelWindow().getFieldByName(this.dependantRequired);
		if (selectedValue && !dependantField.getValue())
		{	
			dependantField.allowBlank = false;
			dependantField.setValue(new Date());
			dependantField.setActiveError(ExtDoc.locales.ExtDocLocaleManager.getText('status_date_error_msg'));
			dependantField.validateValue(dependantField.getValue());		
		}
		else if (!selectedValue)
		{
			dependantField.reset();
			dependantField.allowBlank = true;
			dependantField.validateValue(dependantField.getValue());
		}
		else
		{
			dependantField.allowBlank=false;
			dependantField.validateValue(dependantField.getValue());
		}
	}	
});