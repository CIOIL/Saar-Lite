Ext.define('ExtDoc.views.extcolumnselectorwindow.ExtDocPanelButtons', {
		extend: 'ExtDoc.views.extwindow.ExtDocPanel',
		region: 'north',
		height: 200,
		flex: 1,
		viewParent:null,
		layout: {
			type: 'vbox',
			pack: 'start'
		},
		border: false,
		defaults: {
			border: false
		},
		initPanel: function(dataUrl){
			var currentPanel = this;
			var newStore = Ext.create('ExtDoc.stores.extwindow.ExtDocPanelStore');
			newStore.initStore(dataUrl);
				
			ExtDoc.utils.ExtDocAjax.setMaskObject(Ext.getBody());
			newStore.load({
				callback: function(records, operation, success){
					if(success == true){
						currentPanel.buildButtons(records[0]);
					}
				}
			});
		},
		buildButtons: function(config){
			var fields = config.fields();
				for(var index = 0 ; index < fields.count() ; index++)
				{
					this.addField(fields.getAt(index));
				}
		},
		addField: function(fieldProperties){
				var field = Ext.create(fieldProperties.get("type"));
				field.initFormField(this,fieldProperties);
				field.initTool();
				this.add(field);
		}
});