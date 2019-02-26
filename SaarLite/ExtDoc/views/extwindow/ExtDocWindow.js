Ext.define('ExtDoc.views.extwindow.ExtDocWindow',{
	extend : 'Ext.window.Window',
	requires : [ 'ExtDoc.views.extwindow.ExtDocWindowController', 
	        'ExtDoc.views.ExtDocViewModel', 'ExtDoc.views.extwindow.ExtDocTabPanel', 
	        'ExtDoc.stores.extwindow.ExtDocWindowStore' , 'ExtDoc.utils.ExtDocDefaultValuesUtil'],
	controller : 'windowController',
	viewModel :
	{
		type : 'extdocvm'
	},
	modal: true,
	//holds the original ondragover from the drag zone:
	perivousOnDragOver : null,
	getPerivousOnDragOver: function()
	{
		return this.perivousOnDragOver;
	},
	listeners :
	{
		afterrender: function()
		{	
			this.perivousOnDragOver = document.body.ondragover;//keep the original drug over method
			//overrides the original ondragover:
			document.body.ondragover = function (event){
				document.body.style.opacity = "0.4";
				return false;
			}
		},
		close : 'closeWindowAction',
		beforeshow : function()
		{

			var extwindow = this;

			if (extwindow.width >= window.innerWidth)
			{
				extwindow.width = window.innerWidth - 20;
			}
			if (extwindow.height >= window.innerHeight)
			{
				extwindow.height = window.innerHeight - 20;
			}
			extwindow.updateLayout();
			/*
			 * Ext.EventManager.onWindowResize(function(w, h) { if
			 * (extwindow.width >= w) { extwindow.width = w - 20; } if
			 * (extwindow.height >= h) { extwindow.height = h - 20; }
			 * extwindow.updateLayout(); });
			 */

			Ext.on('resize', function(w, h)
			{
				try
				{
					// decrease window
					if (extwindow.width >= w)
					{
						extwindow.width = w - 20;
					}
					if (extwindow.height >= h)
					{
						extwindow.height = h - 20;
					}

					// move window
					extwindow.setX((w - extwindow.width) / 2);
					extwindow.setY((h - extwindow.height) / 2);

					// increase window
					var maxwidth = extwindow.windowConfigStore.getAt(0).get("width");
					var maxheight = extwindow.windowConfigStore.getAt(0).get("height");
					if (maxwidth && maxheight)
					{
						if (extwindow.width < maxwidth && extwindow.width < w - 20)
						{
							extwindow.width = maxwidth < w - 20 ? w - 20 : maxwidth;
						}
						if (extwindow.height < maxheight && extwindow.height < h - 20)
						{
							extwindow.height = maxheight > h - 20 ? h - 20 : maxheight;
						}
					}
					extwindow.updateLayout();
				} catch (error)
				{

				}
			});

		}
	},
	header :
	{
		cls : 'extdoc-window-header',
		title :
		{
			cls : 'extdoc-window-header-title'
		}
	},
	windowConfigStore : null,
	tabbar : null,
	validationClass : null,
	objectType : null,
	validationErrorObject : null,
	validationUrl : null,
	submitUrl : null,
	objectFather : null,
	layout : 'fit',
	floating : true,
	draggable : true,
	scrollable : true,
	windowToolbars : null,
	windowRecord : null,
	rtl : ExtDoc.locales.ExtDocLocaleManager.getRtl(),
	setWindowWidth : function(newWidth)
	{
		this.width = parseInt(newWidth);
	},
	setWindowHeight : function(newHeight)
	{
		this.height = parseInt(newHeight);
	},
	setWindowClosable : function(newWindowClosable)
	{
		this.closable = newWindowClosable;
	},
	setWindowMaximizable : function(newMaximizable)
	{
		this.maximizable = newMaximizable;
	},
	setWindownewResizable : function(newResizable)
	{
		this.resizable = newResizable;
	},
	setWindowTitle : function(newTitle)
	{
		this.header.title.text = ExtDoc.locales.ExtDocLocaleManager.getText(newTitle);
	},
	setValidationUrl : function(newValidationUrl)
	{
		this.validationUrl = newValidationUrl;
	},
	setValidationClass : function(newValidationClass)
	{
		this.validationClass = newValidationClass;
	},
	setObjectType : function(newObjectType)
	{
		this.objectType = newObjectType;
	},
	setValidationErrorObject : function(newValidationErrorObject)
	{
		this.validationErrorObject = newValidationErrorObject;
	},
	setSubmitUrl : function(newSubmitUrl)
	{
		this.submitUrl = newSubmitUrl;
	},
	setConstrain : function(constrainFromConfig)
	{
		this.constrain = constrainFromConfig;
	},
	setObjectFather : function(newObjectFather)
	{
		this.objectFather = newObjectFather;
	},
	setWindowConfigStore : function(newWindowConfigStore)
	{
		this.windowConfigStore = newWindowConfigStore;
	},
	setWindowRecord : function(newWindowRecord)
	{
		this.windowRecord = newWindowRecord;
		this.getViewModel().setData(
		{
			rec : newWindowRecord
		});
	},
	
	getWindowConfigStore : function(){
		return this.windowConfigStore;
	},
	getWindowToolbars : function()
	{
		return this.windowToolbars;
	},
	getWindowRecord : function()
	{
		return this.windowRecord;
	},
	getContentRecord : function()
	{
		return this.windowRecord;
	},
	getObjectFather : function()
	{
		return this.objectFather;
	},
	getObjectType : function(){
		return this.objectType;
	},
	getValidationErrorObject : function()
	{
		return this.validationErrorObject;
	},
	getSubmitUrl : function()
	{
		return this.submitUrl;
	},
	doMaskView : function(maskText)
	{
		this.mask(maskText, 'loading');
	},
	doUnmaskView : function()
	{
		this.unmask();
	},
	getToolbarByName : function(name)
	{
		for (var index = 0; index < this.getWindowToolbars().length; index++)
		{
			if (name == this.getWindowToolbars()[index].getToolbarConfig().get('name'))
			{
				return this.getWindowToolbars()[index];
			}
		}
	},
	getFieldByName : function(fieldName)
	{
		var field = null;

		for (var index = 0; index < this.tabbar.getTbPanels().length; index++)
		{
			var form = this.tabbar.getTbPanels()[index];

			for (var indexItems = 0; indexItems < form.items.length; indexItems++)
			{
				if (fieldName == form.items.get(indexItems).getName())
				{
					field = form.items.get(indexItems);
				}
			}
		}

		return field;
	},
	getFieldByInputValue : function(fieldInputValue)
	{
		var field = null;
		
		for (var index = 0; index < this.tabbar.getTbPanels().length; index++)
		{
			var form = this.tabbar.getTbPanels()[index];

			for (var indexItems = 0; indexItems < form.items.length; indexItems++)
			{
				if (fieldInputValue == form.items.get(indexItems).inputValue)
				{
					field = form.items.get(indexItems);
				}
			}
		}
		return field;
	},
	getAllFields : function()
	{
		var fields = [];

		for (var index = 0; index < this.tabbar.getTbPanels().length; index++)
		{
			var form = this.tabbar.getTbPanels()[index];
			
			if (form.panelProperties.get('name') == "recipients"){
				continue;
			}

			for (var indexItems = 0; indexItems < form.items.length; indexItems++)
			{				
				var field = form.items.get(indexItems);
				
				if (!field.exclude)
				{
					fields.push(field);
				}
			}
		}
		return fields;
	},
	buildWindow : function()
	{
		if (!Ext.isEmpty(this.windowConfigStore.getAt(0)))
		{
			this.initGlobalProperties();

			if (this.windowConfigStore.getAt(0).panels().count() > 0)
			{
				this.tabbar = Ext.create('ExtDoc.views.extwindow.ExtDocTabPanel');
				this.tabbar.buildTabBar(this.windowConfigStore.getAt(0).panels(),
						this.windowConfigStore.getAt(0).get("activeTab"));
				this.tabbar.setObjectFather(this);

				this.add(this.tabbar);
			}

			this.initToolbars();
		}

		this.doLayout();
		this.show();
	},
	initToolbars : function()
	{
		this.windowToolbars = new Array();

		for (var index = 0; index < this.windowConfigStore.getAt(0).toolbars().count(); index++)
		{
			var toolbar = Ext.create('ExtDoc.views.exttoolbar.ExtDocToolbar');
			var toolbarConfig = this.windowConfigStore.getAt(0).toolbars().getAt(index);

			toolbar.initToolbar(toolbarConfig, this);
			this.addDocked(toolbar);

			this.windowToolbars[index] = toolbar;
		}
	},
	initGlobalProperties : function()
	{
		var windowProperties = this.windowConfigStore.getAt(0);
		this.setWindowTitle(windowProperties.get("name"));
		this.setWindowHeight(windowProperties.get("height"));
		this.setWindowWidth(windowProperties.get("width"));
		this.setWindowClosable(windowProperties.get("closable"));
		this.setWindowMaximizable(windowProperties.get("maximizable"));
		this.setWindownewResizable(windowProperties.get("resizable"));
		this.setValidationUrl(windowProperties.get("validationUrl"));
		this.setValidationClass(windowProperties.get("validationClass"));
		this.setObjectType(windowProperties.get("type"));
		this.setSubmitUrl(windowProperties.get("submitUrl"));
		this.setConstrain(true);
	},

	initRecords:function()
	{  	var newRecords = Ext.create('ExtDoc.models.extobject.ExtDocObjectModel');
			this.setWindowRecord(newRecords);
	},
	isToSetDefaultValues:null,
	initWindowDefaultValues:function()
	{
		if(!Ext.isEmpty(this.isToSetDefaultValues))
		{
			ExtDoc.utils.ExtDocDefaultValuesUtil.initWindowDefaultValues(this);
		}
	},
	initWindow : function(dataUrl , setDefaultValues)
	{
		var currentWindow = this;
		var newStore = Ext.create('ExtDoc.stores.extwindow.ExtDocWindowStore');
		newStore.initStore(dataUrl);
        var curentWindowObj = this;
        curentWindowObj.isToSetDefaultValues = setDefaultValues;
		ExtDoc.utils.ExtDocAjax.setMaskObject(Ext.getBody());
		newStore.load(
		{ 
			callback : function(records, operation, success)
			{
				if (success == true)
				{
					curentWindowObj.initWindowDefaultValues();
					currentWindow.buildWindow();	
				}
			}
		});

		this.setWindowConfigStore(newStore);
	}
});