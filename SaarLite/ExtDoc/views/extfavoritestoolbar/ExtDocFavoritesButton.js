Ext.define('ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesButton', {
	requires: ['ExtDoc.views.extfavoritestoolbar.ExtDocFavoritesButtonController'],
	extend: 'Ext.button.Button',
	controller: 'favoritesButtonController',
	favoritesView: null,
	buttonRecord: null,
	listeners:{
		click: 'favoritesToolbarButtonClick'
	},
	setTextButton: function(text){
		this.setText(text.replace(/"/g, "&quot;"));
	},
	setRecord: function(newRecord){
		this.buttonRecord = newRecord;
	},
	getRecord: function(){
	 	return this.buttonRecord;
	 },
	 getRecordObjectId: function(){
	 	return this.buttonRecord.get('r_object_id');
	 },
	 getFavoritesView: function(){
		return this.favoritesView;
	},
	setFavoritesView:function(newFavoritesView){
		this.favoritesView = newFavoritesView;
	}
});