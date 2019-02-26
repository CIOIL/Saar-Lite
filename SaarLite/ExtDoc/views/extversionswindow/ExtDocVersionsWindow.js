Ext.define('ExtDoc.views.extversionswindow.ExtDocVersionsWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.extversionswindow.ExtDocVersionsWindowController'],
	controller: 'windowVersionsController',
	id: 'versionswindow',
	afterRender: function(){
		this.callParent();
		var selectedObject =  this.getWindowRecord();
		this.requestVersions(selectedObject.get('r_object_id'));
	}, 
	requestVersions: function(objectId){
		var currentWindow = this;
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + 'os/getDocumentVersions/' + objectId;
		this.mask('', 'loading');
		Ext.Ajax.request({
			url: completeUrl,
			method: 'GET',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders('application/json'),
			success: function(response, opts){
				currentWindow.showVersions(response.responseText);
				currentWindow.unmask();
			},
			failure: function(response, opts){
				ExtDoc.utils.ExtDocUtils.showAlert('error', 'servererror');
				currentWindow.unmask();
			}
		});
	},
	showVersions: function(responseText){
		var versions = JSON.parse(responseText);
		var versionsValue = '';

		for (var i = versions.length - 1; i > -1; i--){
			versionsValue += versions[i].properties.version + '\n'
		}
		
		var versionsField = this.getFieldByName('version');
		versionsField.setFieldValue(versionsValue);
	}
});