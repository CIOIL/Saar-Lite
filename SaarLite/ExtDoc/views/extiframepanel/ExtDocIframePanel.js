Ext.define('ExtDoc.views.extiframepanel.ExtDocIframePanel', {
	extend: 'Ext.form.Panel',
	title: 'Drop Zone',
	region: 'west',
	floatable: false,
	autoScroll: true,
	collapsed: true,
	width: 300,
	initComponent: function(){
		this.callParent();
		
		dynamicPanel = new Ext.Component({                    autoEl: {
                        tag: 'iframe',
                        style: 'height: 100%; width: 100%; border: none',
                        src: 'file://L1000117158'
                    }
                });
                
		this.add(dynamicPanel);
	}
});