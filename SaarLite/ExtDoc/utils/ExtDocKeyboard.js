Ext.define('ExtDoc.utils.ExtDocKeyboard',{
	singleton: true,
	p: 80,
	a: 65,
	m: 77,
	v: 86,
	e: 69,
	s: 83,
	i: 73,
	o: 79,
	r: 82,
	c: 67,
	l: 76,
	h: 72,
	deleteKey : 46,
	escapeKey: 27,
	getMainGrid: function() {
		var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
		var mainGrid = mainView.getMainGrid();
		return mainGrid;
	},
	initKeyboard: function(){
		var keyboard = this;
		var mainGrid = this.getMainGrid();
		
		document.body.onkeyup = function(e){
			
			//cancel search
			if (e.keyCode == keyboard.escapeKey && !e.shiftKey)
			{
				ExtDoc.utils.ExtDocSearchAbortionManager.abortSearch();
			}
			
			if(e.target.tagName.indexOf('INPUT') != -1)
			{
				return;
			}
			
			//check if duplicate shortcut click by checking whether the modal mask of the main view is up 
			var modalUp = document.querySelector('div[role="presentation"].x-mask');
			
			if (modalUp)
			{
				modalUp = document.querySelector('div[role="presentation"][style*="display: none;"].x-mask') != null ? false : true;
			}
			
			//delete
			if (e.keyCode == keyboard.deleteKey && !modalUp && !e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="deleteView"]')[0].fireEvent('click');
			}
			
			//properties
			if (e.keyCode == keyboard.p && !modalUp && !e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="propertiesMenuItem"]')[0].fireEvent('click');
			}
			
			//send email
			if (e.keyCode == keyboard.a && !modalUp && !e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="emailView"]')[0].fireEvent('click');
			}
			
			//send link not supported atm
			if (e.keyCode == keyboard.m && !modalUp && !e.shiftKey)
			{
				
			}
			
			//read
			if (e.keyCode == keyboard.v && !modalUp && !e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="readView"]')[0].fireEvent('click');
			}
			
			//edit
			if (e.keyCode == keyboard.e && !modalUp && !e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="editView"]')[0].fireEvent('click');
			}
			
			// silent checkin
			if (e.keyCode == keyboard.s && !modalUp && !e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="checkinSameVersionMenuItem"]')[0].fireEvent('click');
			}
			
			//checkin not supported atm
			if (e.keyCode == keyboard.i && !modalUp && !e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="checkinMenuItem"]')[0].fireEvent('click');
			}
			
			//export not supported atm
			if (e.keyCode == keyboard.o && !modalUp && !e.shiftKey)
			{
				
			}
			
			//replace content
			if (e.keyCode == keyboard.r && !modalUp && e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="changeContentView"]')[0].fireEvent('click');
			}
			  
			//advanced search
			if (e.keyCode == keyboard.s && e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="advSearchView"]')[0].handler();
			}
			
			//export not supported atm
			if (e.keyCode == keyboard.e && !modalUp && e.shiftKey)
			{
				
			}
			
			//import
			if (e.keyCode == keyboard.i && !modalUp && e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="importToolView"]')[0].fireEvent('click');
			}
			
			//add to clipboard not supported atm
			if (e.keyCode == keyboard.c && e.shiftKey)
			{
				
			}
			
			//move from clipboard not supported atm
			if (e.keyCode == keyboard.m && e.shiftKey)
			{
				
			}
			
			//copy from clipboard not supported atm
			if (e.keyCode == keyboard.v && e.shiftKey)
			{
				
			}
			
			//addlocation from clipboard not supported atm
			if (e.keyCode == keyboard.l && e.shiftKey)
			{
				
			}
			
			//help
			if (e.keyCode == keyboard.h && e.shiftKey)
			{
				Ext.ComponentQuery.query('[anchor="infoToolView"]')[0].fireEvent('click');
			}			
		}
	}
});