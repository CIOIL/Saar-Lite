Ext.define('ExtDoc.views.extgrid.tools.ExtDocFillButtonTool', {
	extend: 'ExtDoc.views.exttoolbar.ExtDocTool',
    ariaRole: 'presentation', 
    isFill : true,
    flex: 1,
    disabled: true,
    listeners: {
    	afterrender: function(){
    		this.removeCls ("x-btn-default-toolbar-small"); 
    	}
    }
});