Ext.define('ExtDoc.views.extfields.ExtDocDistributionGridField', {
	extend: 'ExtDoc.views.extfields.ExtDocGridField',
	hideHeaders: true,
	columns: [ 
	{
		dataIndex: "icon",
		renderer: function(val){return this.renderIcon(val)},
		width: 40
	}, 
	{
		dataIndex: "subject",
		width: 300
	} 
	],
	listeners: {
		beforerender: function(c){
			this.loadStore();
		}
	},
	loadStore: function(){
		var newStore = Ext.create('Ext.data.Store', {
			fields: [ 'icon', 'subject' ]
		});
		newStore.loadData(this.loadStoreData(), false); 
		this.setStore(newStore);

	},
	loadStoreData: function(){
		var data = [];
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObjects = mainGrid.getSelectionModel().getSelected();
		for (var i = 0; i < selectedObjects.length; i++){
			var selectedObject = selectedObjects.getAt(i);
			var record = {};
			record.icon = selectedObject.get('a_content_type');
			record.subject = selectedObject.get('object_name');
			data[i] = record;
		}
		return data;
	},
	renderIcon: function(value, metaData, record, row, col, store, gridView){
		var imageName = value;
		return '<img src = "images/icons/' + imageName + '.gif">';
	}
});