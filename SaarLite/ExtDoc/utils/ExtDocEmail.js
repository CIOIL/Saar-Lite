Ext.define('ExtDoc.utils.ExtDocEmail', {
    singleton: true,
    getEmail: function(callback, toIds, ccIds){
    	var email;
    	var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "uis/userEmail";
		Ext.Ajax.request({
			url: completeUrl,
			method: 'GET',
			headers: ExtDoc.utils.ExtDocAjax.getRequestHeaders(),
			success: function(response, opts){
				var result = Ext.util.JSON.decode(response.responseText);
				callback(result[0].properties.user_address, toIds, ccIds);
			},
			failure: function(response, opts){
				//do nothing
			}
		});
    	return email;
    }
});