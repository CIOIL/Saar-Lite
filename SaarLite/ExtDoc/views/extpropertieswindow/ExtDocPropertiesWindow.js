Ext.define('ExtDoc.views.extpropertieswindow.ExtDocPropertiesWindow', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindow',
	requires: ['ExtDoc.views.extpropertieswindow.ExtDocPropertiesWindowController'],
	controller: 'windowPropertiesController',
	id: 'propertieswindow',
	afterRender: function(){
		this.callParent();
		var selectedObject =  this.getWindowRecord();
		
		if(selectedObject.get('r_lock_owner') != "" && !selectedObject.get('locked_by_me'))
		{
			this.getToolbarByName("properties").getToolByName("okbtn").disable();
		}
		
		if(selectedObject.get('sender_name_readonly') && selectedObject.get('sender_name_readonly') != "" )
		{
			this.getFieldByName('sender_name').setReadOnly(true);
		}
		
//		if(selectedObject.get('a_content_type').indexOf('msw') < 0 )
//		{
//			this.getToolbarByName("properties").getToolByName("updateTemplateBtn").disable();
//		}
		
		if(selectedObject.get('r_lock_owner') != "" || selectedObject.get('a_content_type').indexOf('msw12') < 0)
		{
			var toolbar = this.getToolbarByName("properties");
			
			if (toolbar)
			{
				var updateTemplateButton = toolbar.getToolByName("updateTemplateBtn");
				
				if (updateTemplateButton)
				{
					updateTemplateButton.disable();
					updateTemplateButton.setVisible(false);
				}
			}
		}
	}
});