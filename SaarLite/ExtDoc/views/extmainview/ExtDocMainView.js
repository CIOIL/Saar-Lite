﻿Ext.define('ExtDoc.views.extmainview.ExtDocMainView', {
	requires: [	'ExtDoc.views.extgrid.ExtDocGrid',
				'ExtDoc.views.extdropzone.ExtDocDropZone',
				'ExtDoc.views.exttitlebarpanel.ExtDocTitleBarPanel',
				'ExtDoc.views.extpdfviewer.ExtDocPdfViewer'],	
    extend: 'Ext.panel.Panel',
    layout: 'border',
	mainGrid: null,
	mainDropZone: null,
	titleBarPanel: null,
	pdfViewer: null,
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true
    },
	getMainGrid: function(){
		return this.mainGrid;
	},
	setMainGrid: function(newMainGrid){
		this.mainGrid = newMainGrid;
	},
	getDropZone: function(){
		return this.mainDropZone;
	},
	setDropZone: function(newDropZone){
		this.mainDropZone = newDropZone;
	},
	getTitleBar: function(){
		return this.titleBarPanel;
	},
	setTitleBar: function(newTitleBar){
		this.titleBarPanel = newTitleBar;
	},
	getPdfViewer: function(){
		return this.pdfViewer;
	},
	setPdfViewer: function(newPdfViewer){
		this.pdfViewer = newPdfViewer;
	},
	replaceCenterView: function(newComponent){
		this.remove(this.getMainGrid());
		this.add(newComponent);
	},
	initMainView: function(){
		var distribution = false;
		
		if (typeof isDistribution != "undefined")
		{
			distribution = isDistribution;
		}
		
		ExtDoc.utils.ExtDocComponentManager.registerComponent('main-view',this);
		this.rtl = ExtDoc.locales.ExtDocLocaleManager.getRtl();
		
		var grid = Ext.create('ExtDoc.views.extgrid.ExtDocGrid');
		grid.setHidden(distribution);
		grid.initGrid("config/maingrid/main_grid.json",this);
		this.setMainGrid(grid);
		this.add(grid);
		
		if (distribution)
		{
			return;
		}
		
		var dropZone = Ext.create('ExtDoc.views.extdropzone.ExtDocDropZone');
		dropZone.initDropZone(this);
		this.setDropZone(dropZone);
		this.add(dropZone);
		
		var titleBarPanel = Ext.create('ExtDoc.views.exttitlebarpanel.ExtDocTitleBarPanel');
		titleBarPanel.initPanel(this);
		this.setTitleBar(titleBarPanel);
		this.add(titleBarPanel);
		
		var pdfViewerPanel = Ext.create('ExtDoc.views.extpdfviewer.ExtDocPdfViewer');
		this.setPdfViewer(pdfViewerPanel);
		this.add(pdfViewerPanel);
		
	},
	listeners:{
		afterrender: function(){
			var mv = this;
			var mvDom = this.getEl().dom;
			mvDom.addEventListener('dragover', function (event) {
			event.preventDefault();
			var dz = mv.getDropZone();
			if(dz.getCollapsed()){
				dz.setCollapsed(false);
				}
			});
		}
	}
});