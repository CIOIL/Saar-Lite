Ext.define('ExtDoc.views.exttypechooserwindow.ExtDocTypeChooserWindowController', {
	requires : ['ExtDoc.utils.ExtDocDefaultValuesUtil'],
    extend : 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.typeChooserWindowController',
	close: function(){
		this.restoreDefaultDragOver();
		this.closeView();
	},
	ok: function (b, e){
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		
		var currentRecord = ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid').getCurrentLocation();
		var type = this.getView().tabbar.getTbPanels()[0].getChecked()[0].inputValue;
		
		var window = Ext.create(this.getView().getWindowType());
		window.initRecords();
		window.setObjectType(type);
		var records = window.getWindowRecord();
		//init basic default values:
		ExtDoc.utils.ExtDocDefaultValuesUtil.initWindowBasicDefaultValues(records , currentRecord , type);
		var jsonURL = this.bulidConfigPath(type);
		window.initWindow(jsonURL , 'initdefaultValues');		
		window.setObjectFather(ExtDoc.utils.ExtDocComponentManager.getComponent('main_grid'));
		this.restoreDefaultDragOver();
		this.closeView();
	},
	bulidConfigPath: function(type)
	{
		/** The name of the folder should be built in a convention: 
		 * action name(new/import) +"_"+ type of objectType(folder/document) + "_form"  
		 * 
		 * The name of the json should be built in a convention: 
		 * action name(new/import) +"_"+ name of objectType + "_form"  */
		
		var index = type.lastIndexOf("_");
		var folderPath = this.getView().getActionName() +  type.substring(index+1, type.length) + 'form';
		var jsonName = this.getView().getActionName() +'_'+ type + '_form.json';
		return 'config/' + folderPath +"/"+ jsonName;
	}
});
