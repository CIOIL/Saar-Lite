Ext.define('ExtDoc.views.exttoolbar.ExtDocToolbar', {
	requires:[	'ExtDoc.views.exttoolbar.ExtDocSimpleTool',
				'ExtDoc.views.extgrid.tools.ExtDocBackTool',
				'ExtDoc.views.extgrid.tools.ExtDocFavoritesTool',
				'ExtDoc.views.extgrid.tools.ExtDocDownloadTool',
				'ExtDoc.views.extgrid.tools.ExtDocPropertiesTool',
				'ExtDoc.views.extgrid.tools.ExtDocEditTool',
				'ExtDoc.views.extgrid.tools.ExtDocImportTool',
				'ExtDoc.views.extgrid.tools.ExtDocMailTool',
				'ExtDoc.views.extgrid.tools.ExtDocReadTool',
				'ExtDoc.views.extgrid.tools.ExtDocNewDocTool',
				'ExtDoc.views.extgrid.tools.ExtDocNewFolderTool',
				'ExtDoc.views.extgrid.tools.ExtDocLinkTool',
				'ExtDoc.views.extgrid.tools.ExtDocDeleteTool',
				'ExtDoc.views.extgrid.tools.ExtDocLinksTool',
				'ExtDoc.views.extgrid.tools.ExtDocInfoTool',
				'ExtDoc.views.extgrid.tools.ExtDocChangeContentTool',
				'ExtDoc.views.extgrid.tools.ExtDocFillButtonTool',
				'ExtDoc.views.extgrid.tools.ExtDocFavoritesTool',
				'ExtDoc.views.extgrid.tools.ExtDocLogoutTool',
				'ExtDoc.views.extgrid.tools.ExtDocRefreshTool',
				'ExtDoc.views.extgrid.tools.ExtDocAddToClipboardTool',
				'ExtDoc.views.extgrid.tools.ExtDocShowClipboardTool',
				'ExtDoc.views.exttypechooserwindow.ExtDocTypeChooserWindow',
				'ExtDoc.views.extgrid.tools.ExtDocColumnsSelectorTool',
				'ExtDoc.views.extgrid.tools.ExtDocPrintTool',
				'ExtDoc.views.extgrid.tools.ExtDocExportToCSVTool',
				'ExtDoc.views.extgrid.tools.ExtDocClipboardMoveTool',
				'ExtDoc.views.extgrid.tools.ExtDocClipboardCopyTool',
				'ExtDoc.views.extgrid.tools.ExtDocClipboardLinkTool',
				'ExtDoc.views.extgrid.tools.ExtDocClipboardShareAndLinkTool'],
    extend: 'Ext.toolbar.Toolbar',
	toolbarConfig: null,
	toolbarTools: null,
	setToolbarConfig: function(newToolbarConfig){
		this.toolbarConfig = newToolbarConfig;
	},
	setToolbarId: function(){
		if(!Ext.isEmpty(this.getToolbarConfig().get('name')))
		{
			this.id = this.getToolbarConfig().get('name') + "_" + ExtDoc.utils.ExtDocUtils.getRandomNumber();
		}
	},
	getToolbarTools: function(){
		return this.toolbarTools;
	},
	getToolbarConfig: function(){
		return this.toolbarConfig;
	},
	getToolByName: function(name){
		for(var index = 0 ; index < this.toolbarTools.length ; index++)
		{
			if(name == this.toolbarTools[index].getToolConfig().get('name'))
			{
				return this.toolbarTools[index];
			}
		}
	},
	initToolbarDock: function(){
		var dock = this.getToolbarConfig().get('dock');
		
		if(!Ext.isEmpty(dock))
		{
			this.dock = dock;
		}
	},
	initToolbar: function(newToolbarConfig,parent){
		this.toolbarTools = new Array();
		this.setToolbarConfig(newToolbarConfig);
		this.setToolbarId();
		this.initToolbarDock();
		
		this.suspendLayouts();
		for(var index = 0 ; index < newToolbarConfig.tools().count() ; index++)
		{
			var toolConfig = newToolbarConfig.tools().getAt(index);
			var newTool = Ext.create(toolConfig.get('type'));
		
			newTool.setToolParent(parent);
			newTool.setToolConfig(toolConfig);
			newTool.initTool();

			this.add(newTool);
			this.toolbarTools[index] = newTool;
		}
		this.resumeLayouts();
	},
	updateToolbar: function(priority,record,selected){
		var toolbartools = this.getToolbarTools();
		for(var index = 0; index < toolbartools.length; index++)
		{
			toolbartools[index].updateTool(priority,record,selected);
		}
	}
});
