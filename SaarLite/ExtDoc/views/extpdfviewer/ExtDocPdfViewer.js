Ext.define('ExtDoc.views.extpdfviewer.ExtDocPdfViewer', {
	extend: 'Ext.panel.Panel',
	anchor: 'pdfViewer',
	collapsed: true,
	overflowY: 'auto',
	overflowX: 'auto',
	region: 'east',
	onScrollMove : function (x, y){
		this.getComponent(0).setLocalX(x);
		this.getComponent(0).setLocalY(y);
		this.getComponent(1).setLocalX(x);
		this.getComponent(1).setLocalY(y);
	},
	onScrollEnd : function (x, y){
		this.getComponent(0).setLocalX(x);
		this.getComponent(0).setLocalY(y);
		this.getComponent(1).setLocalX(x);
		this.getComponent(1).setLocalY(y);
	},
	listeners: {
		afterrender: function (){
			this.setTitle(ExtDoc.locales.ExtDocLocaleManager.getText('preview'));
		},
		expand: function(){
			var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
			var mainGrid = mainView.getMainGrid();
			var selection = mainGrid.getSelectionModel().getSelected();
			if (selection.length > 0)
			{
				this.getPdfStream(selection.getAt(selection.length - 1));
			}
		},
		collapse: function(){
			var canvas = document.getElementById('pdfCanvas');
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
	},
	items: [
		{
			xtype: 'button',
			name: 'nextPDFpageBTN',
			hidden: true,
			listeners: {
				click: function(){
					var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
					var pdfV = mainView.getPdfViewer();
					pdfV.getComponent(0).setDisabled(true);
					pdfV.getComponent(1).setDisabled(true);
					pdfV.curPage++;
					pdfV.showPdf(pdfV, pdfV.pdfStream);
				},
				afterrender: function (){
					this.setText(ExtDoc.locales.ExtDocLocaleManager.getText('next_page'));
					this.getEl().setStyle('z-index','10000');
				}
			},
		},
		{
			xtype: 'button',	
			name: 'previousPDFpageBTN',
			hidden: true,
			listeners: {
				click: function(){
					var mainView = ExtDoc.utils.ExtDocComponentManager.getComponent('main-view');
					var pdfV = mainView.getPdfViewer();
					pdfV.getComponent(0).setDisabled(true);
					pdfV.getComponent(1).setDisabled(true);
					pdfV.curPage--;
					pdfV.showPdf(pdfV, pdfV.pdfStream);
				},
				afterrender: function (){
					this.setText(ExtDoc.locales.ExtDocLocaleManager.getText('previous_page'));
					this.getEl().setStyle('z-index','10000');
				}
			},
		},
		{
			xtype: 'component',
			html: '<canvas id="pdfCanvas" width="595" height="842" dir="ltr" ></canvas>'
		}
	],
	curPage: 1,
	pdfStream: null,
	getPdfStream: function(record){
		this.curPage = 1;
		var currentPdfViewer = this;
		this.mask(ExtDoc.locales.ExtDocLocaleManager.getText('loading'), 'loading');
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/read";
		var xhr = new XMLHttpRequest();
		var json = this.buildJson(record.get('r_object_id'));
		xhr.open("POST", completeUrl, true);
		xhr.responseType = 'arraybuffer';
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			xhr.setRequestHeader('Authorization', '');
		}
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange = function(){
			
			if (xhr.readyState == XMLHttpRequest.DONE)
			{
				if (xhr.status == 200)
				{
					currentPdfViewer.unmask();
					currentPdfViewer.pdfStream = xhr.response;
					currentPdfViewer.showPdf(currentPdfViewer, currentPdfViewer.pdfStream);
				}
				else if (xhr.status == 400)
				{
					currentPdfViewer.unmask();
					currentPdfViewer.getErrorPdf();
				}
			}
		};
		xhr.send(json);
	},
	buildJson: function (objectIds) {
		var preJson = {
			"properties": {
				"docIds": objectIds
			}
		};
		var json = Ext.JSON.encode(preJson);
		return json;
	},
	showPdf: function (pdfViewer, pdfStream){
		var currentPdfViewer = pdfViewer;
		if (pdfStream.byteLength==0)
		{
			currentPdfViewer.getErrorPdf();
			return;
		}
		
		var pdfjsLib = window['pdfjs-dist/build/pdf'];
		pdfjsLib.GlobalWorkerOptions.workerSrc = '/addons/pdf.worker.js';
		pdfjsLib.getDocument(pdfStream)
		.then(function(pdf){						
				if (pdf.numPages > 1 && currentPdfViewer.curPage != pdf.numPages)
				{
					currentPdfViewer.getComponent(0).setHidden(false);
				}
				else
				{
					currentPdfViewer.getComponent(0).setHidden(true);
				}
				
				if (pdf.numPages > 1 && currentPdfViewer.curPage != 1)
				{
					currentPdfViewer.getComponent(1).setHidden(false);

				}
				else
				{
					currentPdfViewer.getComponent(1).setHidden(true);
				}
							
		   		return pdf.getPage(currentPdfViewer.curPage);
			}
		).
		then(function(page){
				// Set scale (zoom) level
				var scale = 1.0;
	
				// Get viewport (dimensions)
				var viewport = page.getViewport(scale);
				
				
				// Get canvas
				var canvas = document.getElementById('pdfCanvas');
				
				// Set new scale in case the page width is bigger than the canvas width
				if (viewport.width > canvas.width)
				{
					var newScale = canvas.width / viewport.width;	
				}
				
				if (newScale)
				{
					viewport = page.getViewport(newScale);
				}
				
				// Fetch canvas' 2d context
				var context = canvas.getContext('2d');
				
				// Prepare object needed by render method
				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};
		
				// Render PDF page
				page.render(renderContext).then(function(){
					currentPdfViewer.getComponent(0).setDisabled(false);
					currentPdfViewer.getComponent(1).setDisabled(false);
				});
			}
		);
	},
	getErrorPdf: function(){		
		this.showPdf(this, window.location.href.concat('addons/pdfViewerError.pdf'));
	}
});