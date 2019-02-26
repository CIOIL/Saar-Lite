Ext.define('ExtDoc.locales.ExtDocLang', {
	getText: function(text){
		return this[text];
	},
	getRtl: function(){
		var rtl = this['rtl'];
		
		if(Ext.isEmpty(rtl))
		{
			rtl = false;
		}
		
		return rtl;
	}
});