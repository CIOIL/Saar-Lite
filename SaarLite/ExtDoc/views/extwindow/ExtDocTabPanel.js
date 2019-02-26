Ext.define('ExtDoc.views.extwindow.ExtDocTabPanel', {
	extend: 'Ext.TabPanel',
	requires  : ['ExtDoc.views.extwindow.ExtDocPanel'],
	tabBarProperties: null,
	objectFather: null,
	deferredRender: false,
    enableTabScroll: true,
	tbPanels: null,
	getTbPanels: function(){ 
		return this.tbPanels; 
	},
	setObjectFather: function(newObjectFather){
		this.objectFather = newObjectFather;
	},
	getObjectFather: function(){
		return this.objectFather;
	},
	savePanel: function(newPanel) { 
		this.tbPanels[this.tbPanels.length] = newPanel;
		this.add(newPanel);
	},
	setTBActiveTab: function(newActiveTab){
		var activeTab = 0;
		
		if(!Ext.isEmpty(newActiveTab))
		{
			activeTab = parseInt(newActiveTab);
		}
		
		this.setActiveTab(activeTab);
	},
	buildTabBar: function(panels,activeTab){
		this.tbPanels = new Array();
		this.tabBarProperties = panels;
		
		if(!Ext.isEmpty(panels))
		{
			for(var index = 0 ; index < panels.count() ; index++)
			{
				this.addPanel(panels.getAt(index));
			}
			
			this.setTBActiveTab(activeTab);
		}
		
		this.doLayout();
	},
	addPanel: function(panelProperties){
		var panel = null;
		panel = Ext.create('ExtDoc.views.extwindow.ExtDocPanel');
		panel.buildPanel(panelProperties);
		panel.setObjectFather(this);		
		this.savePanel(panel);
	}
});