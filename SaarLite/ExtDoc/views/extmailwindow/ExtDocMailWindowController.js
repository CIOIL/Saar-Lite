Ext.define('ExtDoc.views.extmailwindow.ExtDocMailWindowController', {
	extend: 'ExtDoc.views.extwindow.ExtDocWindowController',
	alias: 'controller.windowMailController',
	objectsToEmail: [],
	shouldSendMainFormat: false,
	shouldSendPDFAttachment: false,
	shouldSendPDFLink: false,
	subject: '',
	message: '',
	recipients: [],
	close: function(){
		this.restoreDefaultDragOver();
		this.closeView();
	},
	ok: function(){
		this.restoreDefaultDragOver();
		var loggedIn = this.checkLogin();
		if (!loggedIn)return;
		//check checkboxes
		
		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.main_format))
		{
			this.shouldSendMainFormat = this.getView().getViewModel().getData().rec.data.main_format;
		}
		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.attach_pdf))
		{
			this.shouldSendPDFAttachment = this.getView().getViewModel().getData().rec.data.attach_pdf;
		}
		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.link_pdf))
		{
			this.shouldSendPDFLink = this.getView().getViewModel().getData().rec.data.link_pdf;
		}
		if (!(this.shouldSendMainFormat || this.shouldSendPDFAttachment || this.shouldSendPDFLink))
		{
			var alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
			alert.show('no_format_chosen_title', 'no_format_chosen_message', function(){});
			return false;
		}
		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.subject))
		{
			this.subject = this.getView().getViewModel().getData().rec.data.subject;
		}
		if (!Ext.isEmpty(this.getView().getViewModel().getData().rec.data.message))
		{
			this.message = this.getView().getViewModel().getData().rec.data.message;
		}
		if (this.getView().getRecipients().length > 0)
		{
			this.recipients = this.getView().getRecipients();
		} 
		/*else {
			//show alert "There are no recipients, please choose some. "
			var alert = Ext.create('ExtDoc.messagebox.ExtDocAlert');
			alert.show('no_recipients_title', 'no_recipients_message', function(){});
			return false;
		}*/
		this.emailAction();
		this.closeView();
	},
	
	emailAction: function() {		
		var emailViewQuery = Ext.ComponentQuery.query('[anchor="emailView"]');
		this.emailView = emailViewQuery[0];
		this.emailView.setDisabled(true);
		this.getView().mask('', 'loading');
		this.objectsToEmail = this.getView().getObjectsToEmail();
		
		
		//show new window

		this.prepareEmail();
	},
	prepareEmail: function() {

		if (this.objectsToEmail.length > 0)
		{
			this.doEmail(this.objectsToEmail);
		}
		else
		{
			this.getView().unmask();
			this.getView().setDisabled(false);
			this.emailView.setDisabled(false);
		}
	},
	doEmail: function(objectIds) {
		var completeUrl = ExtDoc.config.ExtDocConfig.restUrl + "content/createEmail/";

		var json = this.buildJson(objectIds);
		var applet = document.getElementById('fileApplet');
		if (applet && BrowserDetectorFactory.getBrowserDetector().isIE())
		{
			var args = [];
			args.push("Email");
			args.push(completeUrl);
			args.push(ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
			args.push(json);
			args.push(ExtDoc.config.ExtDocConfig.checkoutScheme);
			args.push(ExtDoc.config.ExtDocConfig.authenticationType);
			if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
				args.push(ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			}
			try
			{
				if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
					this.sendEmptyRequest();
				}
				applet.executeOperation(args);
				Ext.ComponentQuery.query('[anchor="emailView"]')[0].unmask();
				Ext.ComponentQuery.query('[anchor="emailView"]')[0].setDisabled(false);
				return;
			}
			catch (error)
			{
				
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.open('POST', completeUrl, true);
		xhr.setRequestHeader('authentication', ExtDoc.utils.ExtDocLoginHandler.getAuthorizationHeaderString());
		xhr.setRequestHeader('authenticationType', ExtDoc.config.ExtDocConfig.authenticationType);
		if ("kerberos" === ExtDoc.config.ExtDocConfig.authenticationType){
			xhr.setRequestHeader('docbase', ExtDoc.utils.ExtDocBase64.decode(Ext.util.Cookies.get('docbase')));
			xhr.setRequestHeader('Authorization', '');
		}
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'blob';

		xhr.onreadystatechange = function(e) {
			if (this.readyState == 4 && this.status == 200)
			{
				var filename = ExtDoc.utils.ExtDocUtils.unicodeToText(xhr.getResponseHeader("Content-Disposition"));
				saveAs(xhr.response, filename);

				Ext.ComponentQuery.query('[anchor="emailView"]')[0].unmask();
				Ext.ComponentQuery.query('[anchor="emailView"]')[0].setDisabled(false);
			} else if (this.readyState == 4 && this.status == 400)
			{
				//nothing
			}
		};

		xhr.send(json);
	},
	buildJson: function(objectIds) {
		
		var saarUrl = ExtDoc.config.ExtDocConfig.saarUrl; 
			
		if (saarUrl)
		{
			saarUrl = ExtDoc.config.ExtDocConfig.saarUrl.lastIndexOf("/") == ExtDoc.config.ExtDocConfig.saarUrl.lastIndexOf("/").length -1 ? ExtDoc.config.ExtDocConfig.saarUrl : ExtDoc.config.ExtDocConfig.saarUrl.concat("/");
		}
		
		var preJson = {
			"properties": {
				"docIds": objectIds,
				"clientUrl": window.location.href,
				"saarUrl" : saarUrl,
				"shouldSendMainFormat": this.shouldSendMainFormat.toString(),
				"shouldSendPDFAttachment": this.shouldSendPDFAttachment.toString(),
				"shouldSendPDFLink": this.shouldSendPDFLink.toString(),
				"subject": this.subject,
				"message": this.message,
				"recipients": this.recipients
			}
		};
		var json = Ext.JSON.encode(preJson);
		return json;
	}
});