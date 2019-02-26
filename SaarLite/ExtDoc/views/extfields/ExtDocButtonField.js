Ext.define('ExtDoc.views.extfields.ExtDocButtonField', {
	extend: 'Ext.button.Button',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	listeners: {
		click: function() {
			if (this.onclick && this.onclick.length > 0){
				eval(this.onclick);
			}
		}
	},
	getName: function(){
		return this.name;
	},
	displayLabel: function(){
		var label = document.createElement('label');
		label.innerText = ':' + this.fieldLabel;
		label.style.float = 'right';
		label.style.padding = '0 5px 0 0';
		this.getEl().dom.parentNode.dir = 'ltr';
		this.getEl().dom.parentNode.appendChild(label);
	}
});