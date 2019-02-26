Ext.define('ExtDoc.views.exttoolbar.ExtDocTool', {
	extend: 'Ext.button.Button',
	toolParent: null,
	toolConfig: null,
	style: 'padding-left:0px;padding-right:0px;',
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
	refreshState: function(){
		if(!Ext.isEmpty(this.getToolConfig().get('user_permit')))
		{
			if(!Ext.isEmpty(this.getToolParent().getContentRecord()) && 
				this.getToolParent().getContentRecord().get('user_permit') < this.getToolConfig().get('user_permit'))
			{
				this.disable();
			}
		}
	},
	initFormField: function(fieldPanel,fieldProp){
		this.setToolParent(fieldPanel);
		this.setToolConfig(fieldProp);
		this.refreshState();
	},
	initTool: function(){
		this.refreshState();
	},
	updateTool: function(priority,record,selected){
		if (record!=null)
		{
			if(ExtDoc.utils.ExtDocUtils.isRecordCabinet(record))
			{
				this.setDisabled(true);
			}
		}
	}
});