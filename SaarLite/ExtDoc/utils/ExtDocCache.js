Ext.define('ExtDoc.utils.ExtDocCache', {
    singleton: true,
    cache: {},
    put: function(key, value){
    	this.cache[key] = value;
    }, 
    get: function(key){
    	return this.cache[key];	
    },
    clear: function(key){
    	delete this.cache[key];
    },
    contains: function(key){
    	return this.cache[key] ? true : false;
    }
});  