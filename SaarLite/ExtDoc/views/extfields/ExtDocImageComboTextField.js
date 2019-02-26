/*The word Text in class name intended to define difference with parent class which don't display text but only image. 
  But it is not a textfield in common meaning of the term.*/
Ext.define('ExtDoc.views.extfields.ExtDocImageComboTextField', {
	extend: 'ExtDoc.views.extfields.ExtDocImageComboField',
	 listeners: {
	        select: function (comboBox, records) {
	            comboBox.inputEl.setStyle({
	                'color': 'black' //black text instead if white
	            });
	            
	        }
	    },
	    listConfig: {	    	
			getInnerTpl: function() {
				return '<img src="{image}"/> {value}';
			}
		},
});