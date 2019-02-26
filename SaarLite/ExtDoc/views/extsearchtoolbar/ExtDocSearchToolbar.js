Ext.define('ExtDoc.views.extsearchtoolbar.ExtDocSearchToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    id:'search_toolbar',
    buildToolbar: function(config){
		var fields = config.fields();
		
		for(var index = 0 ; index < fields.count() ; index++)
		{
			this.addField(fields.getAt(index));
		}
	},
	addField: function(fieldProperties){
		var field = Ext.create(fieldProperties.get("type"));
		field.initFormField(this,fieldProperties);
		this.add(field);
		
		if(!Ext.isEmpty(fieldProperties.get("dataUrl")))
		{
			this.comboFieldsCounter++;
		}
	},
	findFieldByName: function(fieldName){
		for(var index = 0 ; index < this.items.length ; index++)
		{
			if(this.items.getAt(index).name == fieldName)
			{
				return this.items.getAt(index);
			}
		}
	},	
    initToolbar: function(){
		var currentPanel = this;
		var newStore = Ext.create('ExtDoc.stores.extwindow.ExtDocPanelStore');
		newStore.initStore("config/searchpanel/searchtoolbar.json");
		
		ExtDoc.utils.ExtDocAjax.setMaskObject(Ext.getBody());
		newStore.load({
			callback: function(records, operation, success){
				if(success == true){
					currentPanel.buildToolbar(records[0]);
				}
			}
		});
    },
    listeners: {

    	afterrender: function (win) {
			var toolbar = win;
			var map = new Ext.KeyMap(win.getEl(), {
				key: 13,
				fn: function(){
					toolbar.getComponent(2).fireEvent('click');
				},
				scope: win
			});
		}
	}
});