Ext.define('ExtDoc.views.extfields.ExtDocImageComboField', {
	extend: 'ExtDoc.views.extfields.ExtDocComboField',
	matchFieldWidth: false,
	listConfig: {
		getInnerTpl: function() {
			return '<img src="images/icons/{image}"/> {value}';
		}
	},
    listeners: {
        select: function (comboBox, records) {
            comboBox.inputEl.setStyle({
                'background-image':    'url(images/icons/' + records.data.image + ')',
                'background-repeat':   'no-repeat',
                'background-position': '10px center',
                'padding-left':        '27px',
                'color': 'white'
            });
        }
    },
    getSelectedRecord: function(){
    	return this.findRecord(this.valueField || this.displayField, this.getValue());
    },
    updateAfterRender: function(){
    	this.callParent(arguments);
    	this.inputEl.setStyle({
            'background-image':    'url(images/icons/' + this.getSelectedRecord().get('image') + ')',
            'background-repeat':   'no-repeat',
            'background-position': '10px center',
            'padding-left':        '27px',
            'color': 'white'
		});
    }
});