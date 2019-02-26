Ext.define('ExtDoc.views.extfields.ExtDocLinkButtonField', {
	extend: 'ExtDoc.views.extfields.ExtDocButtonField',
	requires: ['ExtDoc.utils.ExtDocEmail','ExtDoc.mock.ExtDocMockOutlook', 'ExtDoc.utils.ExtDocRedemption'],
	style: {
         width: '40px', //doesn't work
         border: 'none',
         marginLeft: '171px',
         marginBottom: '5px',
         outline: 0
	},
	listeners: {
		afterrender: function(){
			this.getEl().dom.style.width = '40px';
			this.getEl().dom.style.border = 'none';
			if (this.fieldLabel && this.fieldLabel.length > 0){
				this.displayLabel();
			}
			
			this.updateAfterRender();	
		},
		focus: function(){
			this.getEl().dom.style.outline = 0;
			this.getEl().dom.style.border = 'none';
		}
	}
});