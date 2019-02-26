Ext.define('ExtDoc.views.extprogressbar.ExtDocProgressBar', {
	extend: 'Ext.ProgressBar',
	failed: false,
	fileName: null,
	initEvents: function() {
		this.callParent();
		this.el.on('click', this.onClick, this);
	},
	onClick: function(){
		if(this.failed){
			this.destroy();
		}
	},
	setFileName: function(newFileName){
		this.fileName = newFileName;
	},
	getFileName: function(){
		return this.fileName;
	},
	setUploadFailed: function(){
		this.failed = true;
		this.updateProgress(1,this.getFileName() + ": " + ExtDoc.locales.ExtDocLocaleManager.getText('uploadFailed'));
		this.getEl().child(".x-progress-bar", true).style.backgroundColor = '#FF3939';
		this.getEl().child(".x-progress-bar", true).style.backgroundImage = 'none';
		
		setTimeout(this.fadeOut(),3000);
	},
	setUploadProgress: function(pres){
		this.updateProgress(pres, this.getFileName() + ": " + Math.round(100*pres) + "%");
	},
	fadeOut: function(){
		var progressBar = this;
		
		this.getEl().animate({
   			duration: 5000,
    		to: {
        		opacity: 0
    		},
			listeners: {
				beforeanimate:  function() {
	            },
            	afteranimate: function() {
            		progressBar.destroy();
            	}
			}
		});
	}
});