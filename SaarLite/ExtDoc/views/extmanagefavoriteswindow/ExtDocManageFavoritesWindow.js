Ext.define('ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesWindow', {
	requires: [	'ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesWindowController',
				'ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesGrid',
				'ExtDoc.views.extmanagefavoriteswindow.tools.ExtDocDeleteFavoriteTool'],	
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	controller: 'mfWindowController',
	mfGrid: null,
	initMFWindow: function(){
		this.initWindow("config/managefavorites/manage_favorites.json");
		this.addFavoritesHelp();
		this.addFavoritesGrid();
	},
	addFavoritesHelp: function(){
		var helpText = ExtDoc.locales.ExtDocLocaleManager.getText('favorites_header');
		var helpPanelId = 'help_favorites_panel_' + ExtDoc.utils.ExtDocUtils.getRandomNumber();
		var helpPanel = Ext.create('Ext.panel.Panel',{
			html: helpText,
			id: helpPanelId,
			dock: 'top'
		});
		
		this.addDocked(helpPanel);
	},
	addFavoritesGrid: function(){
   		var grid = Ext.create('ExtDoc.views.extmanagefavoriteswindow.ExtDocManageFavoritesGrid');
		grid.initGrid("config/managefavorites/manage_favorites_grid.json",this);
		this.setMfGrid(grid);
		
		this.add(grid);		
	},
	setMfGrid: function(mfGrid){
		this.mfGrid = mfGrid;
	},
	getMfGrid: function(){
		return this.mfGrid;
	}
});