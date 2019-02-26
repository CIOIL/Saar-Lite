Ext.define('ExtDoc.views.extgrid.tools.ExtDocDeleteTriggerField', {
	extend: 'ExtDoc.views.extfields.ExtDocTextField',
	toolParent: null,
	folderId: null,
	editable: false,
	enforceMaxLength: true,
	maxLength: 8096,
	triggers: {
	    clear: {
	        weight: 1,
	        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
	        handler: 'onClearClick',
	        scope: 'this'
	    }
	},
	onClearClick: function(){
		if(this.getToolParent().getCurrentLocations().length == 1)
		{
			ExtDoc.utils.ExtDocUtils.showAlert('error','delete_last_location_error');
		}
		else
		{
	  		this.destroy();
		}
	},
	updateAfterRender: function(){
		//needed, to overide super function
	},
	setToolParent: function(newToolParent){
		this.toolParent = newToolParent;
	},
	getToolParent: function(){
		return this.toolParent;
	},
	setFolderId: function(newFolderId){
		this.folderId = newFolderId;
	},
	getFolderId: function(){
		return this.folderId;
	}
	
});