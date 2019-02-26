Ext.define('ExtDoc.views.exttitlebarpanel.ExtDocTitleBarPanel', {
	requires: [	'ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesToolBar',
				'ExtDoc.views.extsearchtoolbar.ExtDocSearchToolbar'],
	extend: 'Ext.form.Panel',
	region: 'north',
	id: 'titlebarpanel',
	floatable: false,
	scrollable: true,
	height: 52,
	minHeight: 52,
	maxHeight: 52,
	collapsed: false,
	frame: false,
	mainView: null,
	searchPanel: null,
	favoritesView: null,
	loadedPanels: 0,
	layout: {
		type: 'vbox',
		align: 'stretch',
		pack: 'start'
	},
	border: false,
	defaults: {
		border: false
	},	
	initPanel: function(newMainView){
		this.setMainView(newMainView);
		this.setCollapsible(false);
		this.buildPanel();
	},
	setMainView: function(newMainView){
		this.mainView = newMainView;
	},
	getMainView: function(){
		return this.mainView;
	},
	buildPanel: function(){
		this.buildSearchPanel();		
		this.buildFavoritesToolbarPanel();
	},
	buildSearchPanel: function(){
		var searchPanel = Ext.create('ExtDoc.views.extsearchtoolbar.ExtDocSearchToolbar');
		searchPanel.initToolbar();		
		
		this.searchPanel = searchPanel;
		this.add(searchPanel);
	},
	buildFavoritesToolbarPanel: function(){
		var favoritesToolbar = Ext.create('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesToolBar');
		favoritesToolbar.columnWidth = 1.0;
		favoritesToolbar.initToolbar(this);
		
		this.favoritesView = favoritesToolbar;
		this.add(favoritesToolbar);
	}
});