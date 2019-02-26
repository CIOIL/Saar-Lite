Ext.define('ExtDoc.views.extcontextmenu.ExtDocContextMenu',{
	
	requires: ['ExtDoc.views.extmenuitems.ExtDocDownloadMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocEditMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocMailMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocCheckinMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocReadMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocPropertiesMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocAddFavoritesMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocLinkMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocDeleteMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocChangeContentMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocCancelCheckoutMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocDeleteDocFromFavoritesMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocVersionsMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocViewSourceMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocShowLinksMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocDeleteLinksMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocRemoveFromClipboardMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocCheckinSameVersionMenuItem',
				'ExtDoc.views.extmenuitems.ExtDocShowVersionsMenuItem'],
	extend: 'Ext.menu.Menu',
	listeners: {
		beforeshow: function(){
			this.prepareMenuItemsBeforeShow();
		},
		beforehide: function(){
			this.prepareMenuItemsBeforeHide();
		}
	},	
	menuRecord: null,
	setMenuRecord: function(record){
		this.menuRecord = record;
	},
	getMenuRecord: function(){
		return this.menuRecord;
	},
	prepareMenuItemsBeforeShow: function(){
		for(var index = 0 ; index < this.items.length ; index++)
		{
			this.items.getAt(index).prepareItemBeforeShow(this.getMenuRecord());
		}
	},
	prepareMenuItemsBeforeHide: function(){
		for(var index = 0 ; index < this.items.length ; index++)
		{
			this.items.getAt(index).prepareItemBeforeHide();
		}
	},	
	initMenu: function(menuParent,menuConfig){
		this.rtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		
		for(var index = 0 ; index < menuConfig.items().count() ; index++)
		{
			var itemConfig = menuConfig.items().getAt(index);
			var type = itemConfig.get('type');
			
			var newItem = Ext.create(type);
		
			newItem.setToolParent(menuParent);
			newItem.setToolConfig(itemConfig);
			newItem.initItem();

			this.add(newItem);
		}
	}
});