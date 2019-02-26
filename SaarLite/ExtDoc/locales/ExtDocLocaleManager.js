Ext.define('ExtDoc.locales.ExtDocLocaleManager', {
	extend: 'Ext.Component',
	requires: [	'ExtDoc.config.ExtDocConfig',
				'ExtDoc.locales.en.EnglishLang',
				'ExtDoc.locales.he.HebrewLang'],
    singleton: true,
	language: null,
	langClass: null,
	initComponent: function(){
		this.initLanguage();
		this.callParent();
	},
	initLanguage: function(){
		if(!this.langClass)
		{
			this.language = ExtDoc.config.ExtDocConfig.language;
			this.setLangClass();
		}
	},
	getLanguage: function(){
		return this.language;
	},
	setLangClass: function(){
		if (!this.language)
		{
			this.initLanguage();
		}
		if(this.getLanguage() == 'en')
		{
			this.langClass = ExtDoc.locales.en.EnglishLang;
		}
		else if(this.getLanguage() == 'he')
		{
			this.langClass = ExtDoc.locales.he.HebrewLang;
		}
	},
	getLangClass: function(){
		if (!this.langClass)
		{
			this.setLangClass();
		}
		return this.langClass;
	},
	getText: function(text,params){
		var customText = this.getLangClass().getText(text);
		
		if(!Ext.isEmpty(params))
		{
			for(var index = 0 ; index < params.length ; index++)
			{
				var replaceValue = "%" + index + "%";
				customText = customText.replace(replaceValue,params[index]);
			}
		}
		
		return customText;
	},
	getRtl: function(){
		if(Ext.isEmpty(this.getLangClass()))
		{
			this.initLanguage();
		}

		return this.getLangClass().getRtl();
	}
});