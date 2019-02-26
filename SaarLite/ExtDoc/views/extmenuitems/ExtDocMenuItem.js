Ext.define('ExtDoc.views.extmenuitems.ExtDocMenuItem', {
	extend: 'Ext.menu.Item',
	toolParent: null,
	toolConfig: null,
	toolMenu: null, 
	prepareItemBeforeShow: function(record){
		if(record.get('r_object_type') == 'dm_cabinet')
		{
			if (!this.isDisabled())
			{
				this.setDisabled(true);
			}
		}
	},
	prepareItemBeforeHide: function(){
		if (!this.isVisible())
		{
			this.setVisible(true);
		}
		if (this.isDisabled())
		{
			this.setDisabled(false);
		}
	},
	setToolConfig: function(newToolConfig){
		this.toolConfig = newToolConfig;
	},
	getToolConfig: function(){
		return this.toolConfig;
	},
	setToolParent: function(newToolParent){
		this.toolParent = newToolParent;
	},
	getToolParent: function(){
		return this.toolParent;
	},
	getSelectedCount: function(){
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		return mainGrid.getSelection().length;
	}
});