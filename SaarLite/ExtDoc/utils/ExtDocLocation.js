Ext.define('ExtDoc.utils.ExtDocLocation', {
    singleton: true,
    alert: null,
    saveLocation: function(){
    	var breadcrumbComponent = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').getGridBreadcrumb();
		var record = breadcrumbComponent.getCurrentLocation();
		var locationTimeout = 12 * 60 * 60 * 1000;  //12 hours
		Ext.util.Cookies.set('currentLocation', record.data['r_object_id'], new Date(new Date().getTime() + locationTimeout));
		Ext.util.Cookies.set('rObjectType', record.data['r_object_type'], new Date(new Date().getTime() + locationTimeout));
		Ext.util.Cookies.set('rUnitLayerName', ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').getUnitLayerName(), new Date(new Date().getTime() + locationTimeout));

    }, 
    loadLocation: function(rObjectId, objectType){
    	var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
    	mainView.mask();
    	var currentLocation = rObjectId ? rObjectId : Ext.util.Cookies.get('currentLocation');
    	var rObjectType = objectType ? objectType : Ext.util.Cookies.get('rObjectType');
    	var rUnitLayerName = objectType ? objectType : Ext.util.Cookies.get('rUnitLayerName');
    	var basicAuth = Ext.util.Cookies.get('basicAuth'); 
		if (!currentLocation || parseInt(currentLocation) < 0
			|| ((!basicAuth || basicAuth.length < 10) && ExtDoc.config.ExtDocConfig.authenticationType == 'basic') ){
			mainView.unmask();
			return;
		}
		
    	var worker = setInterval(function() {
    		var mainGrid = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid');  		
    		if (mainGrid && ExtDoc.utils.ExtDocVaLoader.va){
    			var breadcrumbComponent = mainGrid.getGridBreadcrumb();
    			var record = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
    			record.data['r_object_id'] = currentLocation;
    			record.data['r_object_type'] = rObjectType;
    			record.data['unit_layer_name'] = rUnitLayerName;
    			breadcrumbComponent.changeLocation(record, 'favorites');
    			mainView.unmask();
    			clearInterval(worker);
    		}
		}, 5);  //every 5 miliseconds
    	

	},
    setApplicationLocationPath: function (newApplicationLocationPath){
    	this.applicationLocationPath = "/" + newApplicationLocationPath;
    },
	getApplicationLocationPath: function (){
		return this.applicationLocationPath;
	}
});  