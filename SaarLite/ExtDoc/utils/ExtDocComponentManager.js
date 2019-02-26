Ext.define('ExtDoc.utils.ExtDocComponentManager', {
    singleton: true,
    appComponents: new Array(),
    registerComponent: function(name,newComponent){
    	this.appComponents[name] = newComponent;
    },
    getComponent: function(name){
    	return this.appComponents[name];
    },
    unregisterComponent: function(name){
    	this.appComponents[name] = null;
    	delete this.appComponents[name];
    }
});