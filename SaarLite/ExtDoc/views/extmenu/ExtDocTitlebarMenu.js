Ext.define('ExtDoc.views.extmenu.ExtDocTitlebarMenu',{
	extend: 'Ext.menu.Menu',
	requires:[
		'ExtDoc.views.extfavoritestoolbar.ExtDocLastDocsMenuItem',
		'ExtDoc.views.extfavoritestoolbar.ExtDocFavoriteDocsMenuItem'
	],
	initMenu: function (){
		this.add(Ext.create('ExtDoc.views.extfavoritestoolbar.ExtDocLastDocsMenuItem'));
		this.add(Ext.create('ExtDoc.views.extfavoritestoolbar.ExtDocFavoriteDocsMenuItem'));
	}
});