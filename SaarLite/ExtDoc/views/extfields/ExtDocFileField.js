Ext.define('ExtDoc.views.extfields.ExtDocFileField', {
	extend: 'Ext.form.field.File',
	mixins: ['ExtDoc.views.extfields.ExtDocField'],
	listeners: {
		afterrender: function(){
			this.updateAfterRender();
		},
		change: function(fieldFile,value){
			var fileName = this.getFileName(value);
			this.getFieldPanel().setFieldValueByName('object_name',fileName);
		}
	},
	getFileName: function(fileFullPath){
			return fileFullPath.substring(fileFullPath.lastIndexOf("\\") + 1,fileFullPath.lastIndexOf("."));
		}
});