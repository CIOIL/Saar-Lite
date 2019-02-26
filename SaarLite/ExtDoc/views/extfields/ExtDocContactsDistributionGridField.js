Ext.define('ExtDoc.views.extfields.ExtDocContactsDistributionGridField', {
	extend: 'ExtDoc.views.extfields.ExtDocGridField',
	mixins:['ExtDoc.utils.ExtDocRecipients'],
	dockedItems: [{
	    xtype: 'toolbar',
	    dock: 'top',
	    items: [{
	        xtype: 'button',
	        //text: ExtDoc.locales.ExtDocLocaleManager.getText("add_recipient"),
	        icon:  'images/Icon-Plus.png',
	        handler: function(){
	        var grid = this.up('grid');	
	        grid.putRecipientsIntoDistributionStore(grid.getStore());
	    }
	    }]
	}],
	fields:[ 'name', 'email', 'type', 'permission', 'delete'],
	columns: [ {
		text: ExtDoc.locales.ExtDocLocaleManager.getText("name"),
		dataIndex: "name",
		width: 130,
		editor: 'textfield'
	}, {
		text: ExtDoc.locales.ExtDocLocaleManager.getText("email"),
		//type: ExtDoc.views.extgrid.columns.ExtDocGridValueTooltipColumn,
		dataIndex: "email",
		renderer: function(value, metaData, record, row, col, store, gridView){
			return this.renderLinkWithTooltip(value, metaData, record, row, col, store, gridView)
		},
		width: 150,
		editor: {
            xtype: 'textfield',
            allowBlank: false
        },
		flex: 1
	}, {
		text: ExtDoc.locales.ExtDocLocaleManager.getText("type"),
		dataIndex: "type",
		width: 50,
		renderer: function(value, metaData, record, row, col, store, gridView){
			return this.renderCursorPointer(value, metaData, record, row, col, store, gridView)
		}
	}, 
//	{
//		text: ExtDoc.locales.ExtDocLocaleManager.getText("permission"),
//		dataIndex: "permission",
//		width: 50,
//		renderer: function(value, metaData, record, row, col, store, gridView){
//			return this.renderCursorPointer(value, metaData, record, row, col, store, gridView)
//		}
//	}, 
	{
		text: '',
		xtype: 'actioncolumn',
		width: 20,
		items: [ {
			iconCls: 'icon-delete',
			tooltip: ExtDoc.locales.ExtDocLocaleManager.getText("delete_"),
			handler: function(grid, rowIndex, colIndex){
//				if (grid.getStore().getRange().length == 1){ //don't allow remove last recipient
//					return;
//				}
				grid.getStore().removeAt(rowIndex);
			},
			scope: this
		} ]
	} ],
	listeners: {
		beforerender: function(c){
			this.loadStore();
		}
	},
	viewConfig: {
		listeners: {
			cellclick: function(view, cell, cellIndex, record, row, rowIndex, e){
				//!!!Don't remove commented lines below!!!
				//	              var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
				//	              var clickedColumnName = view.panel.headerCt.getHeaderAtIndex(cellIndex).text;
				//	              var clickedCellValue = record.get(clickedDataIndex);
				//	              console.log(clickedColumnName + " " + clickedCellValue);
//				if (cellIndex == 3)
//				{
//					if (record.get("permission") == ExtDoc.locales.ExtDocLocaleManager.getText("edit"))
//					{
//						//record.set("permission", ExtDoc.locales.ExtDocLocaleManager.getText("read"));
//					} else
//					{
//						//record.set("permission", ExtDoc.locales.ExtDocLocaleManager.getText("edit"));
//					}
//				}
				if (cellIndex == 2)
				{
					if (record.get("type") == ExtDoc.locales.ExtDocLocaleManager.getText("cc"))
					{
						record.set("type", ExtDoc.locales.ExtDocLocaleManager.getText("to"));
					} else
					{
						record.set("type", ExtDoc.locales.ExtDocLocaleManager.getText("cc"));
					}
				}
				if (cellIndex == 1)
				{
					view.ownerGrid.isEditAllowed = true;
					if (record.get('email').indexOf('@') > -1)
					{
						view.ownerGrid.isEditAllowed = false;
						window.location.href = "mailto:" + record.get('email');
					} 

				}
			}
		},
		getRowClass: function(record, index){
			if (index == 2 || index == 3)
			{
				return 'cursor-pointer';
			}
		}
	},
	hasCasualContacts: false,
	isEditAllowed: true,
	plugins: {		
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
			'beforeedit': function (e){
				return e.grid.isEditAllowed;
			}
        }  
    },
	loadStore: function(){
		var newStore = Ext.create('Ext.data.Store', {
			fields: [ 'mail', 'email', 'type', 'permission' ]
		});
		newStore.loadData(this.loadStoreData(), false);
		this.setStore(newStore);

	},
	loadStoreData: function(){
		var data = [];
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedObjects = mainGrid.getSelectionModel().getSelected();
		var rowCount = 0;
		for (var i = 0; i < selectedObjects.length; i++)
		{
			var selectedObject = selectedObjects.getAt(i);
			if (selectedObject.get('addressee_id') && selectedObject.get('addressee_id').constructor === Array
					&& selectedObject.get('addressee_id').length > 0)
			{
				for (var j = 0; j < selectedObject.get('addressee_id').length; j++)
				{
					var record = {};
					record.name = selectedObject.get('addressee_name')[j];
					record.email = selectedObject.get('addressee_id')[j];
					//record.email = ""; //for test
					if (record.email.indexOf('@') == -1 || record.name.indexOf('@') > 0){
						this.hasCasualContact = true;
					}
					record.type = ExtDoc.locales.ExtDocLocaleManager.getText("to");
					//record.permission = ExtDoc.locales.ExtDocLocaleManager.getText("read");
					data[rowCount] = record;
					rowCount++;
				}

			} else if (selectedObject.get('addressee_id') && selectedObject.get('addressee_id').constructor !== Array)
			{
				var record = {};
				record.name = selectedObject.get('addressee_name');
				record.email = selectedObject.get('addressee_id');
				if (record.email.indexOf('@') == -1 || record.name.indexOf('@') > 0){
					this.hasCasualContact = true;
				}
				record.type = ExtDoc.locales.ExtDocLocaleManager.getText("to");
				//record.permission = ExtDoc.locales.ExtDocLocaleManager.getText("read");
				data[rowCount] = record;
				rowCount++;
			}
			if (selectedObject.get('cc_id') && selectedObject.get('cc_id').constructor === Array && selectedObject.get('cc_id').length > 0)
			{

				for (var j = 0; j < selectedObject.get('cc_id').length; j++)
				{
					var record = {};
					record.name = selectedObject.get('cc_name')[j];
					record.email = selectedObject.get('cc_id')[j];
					//record.email = '';
					if (record.email.indexOf('@') == -1 || record.name.indexOf('@') > 0){
						this.hasCasualContact = true;
					}
					record.type = ExtDoc.locales.ExtDocLocaleManager.getText("cc");
					//record.permission = ExtDoc.locales.ExtDocLocaleManager.getText("read");
					data[rowCount] = record;
					rowCount++;
				}
			} else if (selectedObject.get('cc_id') && selectedObject.get('cc_id').constructor !== Array)
			{
				var record = {};
				record.name = selectedObject.get('cc_name');
				record.email = selectedObject.get('cc_id');
				if (record.email.indexOf('@') == -1 || record.name.indexOf('@') > 0){
					this.hasCasualContact = true;
				}
				record.type = ExtDoc.locales.ExtDocLocaleManager.getText("cc");
				//record.permission = ExtDoc.locales.ExtDocLocaleManager.getText("read");
				data[rowCount] = record;
				rowCount++;
			}

		}
		return data;
	},
	renderLinkWithTooltip: function(value, metaData, record, row, col, store, gridView){
		metaData.tdAttr = 'data-qtip="' + value + '"';
		metaData.tdCls = metaData.tdCls + " link";
		return value;
	},
	renderCursorPointer: function(value, metaData, record, row, col, store, gridView){
		metaData.tdCls = metaData.tdCls + " cursor-pointer";
		return value;
	}
});