Ext.define('ExtDoc.tools.controllers.ExtDocExportToCSVController', {
	extend: 'ExtDoc.tools.controllers.ExtDocAbstractActionController',
	alias: 'controller.exportToCSVController',
	exportToCSV: function (){
		var hebrewRegEx = new RegExp("^[\u0590-\u05FF\\s]+$");
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		mainView.mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'), 'loading');
		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');
		var selectedItems = mainGrid.getSelection();
		var columns = mainGrid.getVisibleColumns().filter(function(column){return (column.dataIndex && column.dataIndex.length > 0) && (column.text && column.text.length > 0 && hebrewRegEx.test(column.text))});
		var columnDataIndexes = columns.map(function(column){return column.dataIndex});
		var columnNames = columns.map(function(column){return column.text});
		var objectIds = [];
		
		for (var i = 0; i < selectedItems.length; i++)
		{
			objectIds.push(selectedItems[i].get('r_object_id'));
		}
		
		var json = this.buildJson(columnDataIndexes, columnNames, objectIds);
		
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "os/exporttocsv";
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('Authorization', '');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType)
		{
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
		}
		
		xhr.responseType = 'blob';
		xhr.onreadystatechange = function(e){
			if (this.readyState == 4 && this.status == 200)
			{
				mainView.unmask();
				var filename = ExtDoc.utils.ExtDocUtils.unicodeToText(xhr.getResponseHeader("Content-Disposition"));
				saveAs(xhr.response, filename);	
			}
			else if (this.readyState == 4 && this.status == 400)
			{
				mainView.unmask();
				ExtDoc.utils.ExtDocUtils.showAlert('error','servererror');
			}
		};

		xhr.send(json);
	},
	buildJson: function (columnDataIndexes, columnNames, objectIds){
		var preJson = {
			"properties": {
				"columnDataIndexes": columnDataIndexes,
				"columnNames": columnNames,
				"objectIds": objectIds
			}
		};
		
		var json = Ext.JSON.encode(preJson);
		return json;
	}
});