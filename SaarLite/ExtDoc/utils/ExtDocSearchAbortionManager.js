Ext.define('ExtDoc.utils.ExtDocSearchAbortionManager',{
	
	singleton: true,
	activeSearchAjax: null,
	mainGrid: null,
	abortSearch: function ()
	{
		if (this.activeSearchAjax!=null && this.activeSearchAjax.isLoading())
		{
			this.activeSearchAjax.proxy.abort();
			this.clearActiveSearchAjax();
			ExtDoc.utils.ExtDocUtils.showAlert('search','search_aborted');
		}
	},
	setActiveSearchAjax: function (ajax){
		this.activeSearchAjax = ajax;
	},
	clearActiveSearchAjax: function (){
		this.activeSearchAjax = null;
	}
});