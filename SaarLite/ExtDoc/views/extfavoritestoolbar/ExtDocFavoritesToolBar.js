Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesToolBar',{
	requires: [	'ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesButton',
				'ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesManageButton',
				'ExtDoc.views.extfavoritestoolbar.ExtDocNewFolderButton',
				'ExtDoc.views.extmenu.ExtDocTitlebarMenu',
			   	'ExtDoc.stores.extobject.ExtDocObjectStore'],
	extend: 'Ext.toolbar.Toolbar',
	cls: 'panelfavoritetoolbar',
	layout: {
		overflowHandler: 'Menu'
	},    
	listeners: {
		afterrender: function(){
			this.reloadToolbarStore();
		}
	},	
	toolsbarstore : null,
	titlebarView: null,
	titlebarLoaded: false,
	setToolbarStore: function(newToolbarStore){
		this.toolsbarstore = newToolbarStore;
	},
	getToolbarStore: function(){
		return this.toolsbarstore;
	},
	initToolbar: function(newTitlebarView){
		ExtDoc.utils.ExtDocComponentManager.registerComponent('favoritesToolbar',this);
		this.titlebarView = newTitlebarView;
		this.initStore();
	},
	buildToolbar: function(){
		this.removeAll();
		
		var currentView = this;
		var records = this.getToolbarStore().getRange();
		
		var mainMenu = Ext.create('ExtDoc.views.extmenu.ExtDocTitlebarMenu');
		mainMenu.initMenu();
		this.add({
			icon: 'images/icons/settings.gif',
			menu: mainMenu
		});
//		this.add(Ext.create('ExtDoc.views.extfavoritestoolbar.ExtDocLastDocsButton'));
//		this.add(Ext.create('ExtDoc.views.extfavoritestoolbar.ExtDocNewFolderButton'));
		this.add(Ext.create('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesManageButton'));
		//Loop over Store Data and retreive Object_Name and set it to the Button
		Ext.each(records, function(record)
		{
			var overflowText = record.get('object_name');
			if (overflowText.length>50)
			{
				var overflowTextSubstitute = overflowText.slice(0, 51).concat("...");
				overflowText = overflowTextSubstitute;
			}
			var favoriteButton = Ext.create('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesButton',{'overflowText': overflowText});
			favoriteButton.setFavoritesView(currentView);
			favoriteButton.setTextButton(record.get('object_name'));
			favoriteButton.setTooltip(record.get('object_name'));
			favoriteButton.setWidth(72);
			favoriteButton.setRecord(record);
			
			currentView.add(Ext.create('Ext.toolbar.Separator'));
			currentView.add(favoriteButton);
		});
		
		this.add(Ext.create('Ext.toolbar.Separator'));
	},
	initStore: function(){
		var newStore = Ext.create('ExtDoc.stores.extobject.ExtDocObjectStore');
		this.setToolbarStore(newStore);
	},
	reloadToolbarStore: function(){
		var currentToolbar = this;
		
		this.mask();
		
		//Execute the Rest Service to retreive User Favorites List
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/favorites/";
		this.getToolbarStore().initStore(completeUrl);
		this.getToolbarStore().load({
			//Function to continue only if load was succesfuly execute the buildToolbar()
			callback: function(records, operation, success){
				if (success == true)
				{
					currentToolbar.buildToolbar();
				}
				
				currentToolbar.unmask();
			}
		});
	},
	getTitlebarView: function(){
		return this.titlebarView;
	},
	renderer: function(value, metaData, record, row, col, store, gridView){
		if( !Ext.isEmpty(record.get('object_name')) && col == 3 )
		{
			var nVal= value.replace(/"/g, "&quot;");
			metaData.tdAttr = 'data-qtip="' + nVal + '"';
		}
		return  value;
	}
});

/*
 * Workaround Send from Ext js 
 * Fix Dropdown Menu Toolbar overflow issue.
 * Support #24797
 * 
 */
Ext.define('EXTJS-18925.layout.container.boxOverflow.Menu',{
    override: 'Ext.layout.container.boxOverflow.Menu',
    count: 0,
    addComponentToMenu: function (m, c){
        var events = [];
        this.callParent([m,c]);
        
        // Cloning events
        for (key in c.hasListeners)
        {
            if (c.hasListeners[key] === 1)
            {
                events.push(key);
            }
        }
        
        if (events.length)
        {
            c.relayEvents(c.overflowClone, events);
        }
        
        //add tooltip to overflow menu
        if (c.text)
        {
        	c.overflowClone.on ("afterrender", function(){
            	 if (c.overflowClone.getEl().dom)
            	 {
            		 var tooltip = c.tooltip ? c.tooltip : c.text.replace(/"/g, "&quot;");
            		 c.overflowClone.getEl().dom.children.item(0).setAttribute('data-qtip', tooltip);
            	 }
            });
        } 
        else if (this.count > 0 && c.overflowClone) { //separator
        	c.overflowClone.on ("afterrender", function(){
           	 if (c.overflowClone.getEl().dom)
           	 {
           		if (c.overflowClone.getEl().dom.innerHTML === '》'){ //breadcrump separator
           			c.overflowClone.getEl().dom.innerHTML = '<hr>';
           		}
           	 }
           });
        }

        this.count++;
    }
});