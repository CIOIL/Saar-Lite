package com.ness.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.activation.CommandMap;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.activation.MailcapCommandMap;
import javax.activation.MimetypesFileTypeMap;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.auxilii.msgparser.Message;
import com.auxilii.msgparser.MsgParser;
import com.auxilii.msgparser.RecipientEntry;
import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfPersistentObject;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfId;
import com.documentum.fc.common.DfTime;
import com.documentum.fc.common.IDfTime;
import com.ness.objects.NRFileObject;
import com.ness.objects.NRJsonObject;

public class NREmlUtils
{

	public static Properties hebrewStrings = null;
	
	static class InputStreamDataSource implements DataSource
	{

		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		private final String name;

		public InputStreamDataSource(InputStream inputStream, String name)
		{
			this.name = name;
			try
			{
				int nRead;
				byte[] data = new byte[16384];
				// System.out.println("available: " + inputStream.available());
				while ((nRead = inputStream.read(data, 0, data.length)) != -1)
				{
					buffer.write(data, 0, nRead);
				}

				buffer.flush();
				inputStream.close();
			} catch (IOException e)
			{
				e.printStackTrace();
			}

		}

		@Override
		public String getContentType()
		{
			return new MimetypesFileTypeMap().getContentType(name);
		}

		@Override
		public InputStream getInputStream() throws IOException
		{
			return new ByteArrayInputStream(buffer.toByteArray());
		}

		@Override
		public String getName()
		{
			return name;
		}

		@Override
		public OutputStream getOutputStream() throws IOException
		{
			throw new IOException("Read-only data");
		}

	}

	public static Response buildResponse(MimeMessage message) throws Exception
	{
		//fix of UnsupportedDataTypeException: no object DCH for MIME type multipart/mixed
		fixMimeType();

		ResponseBuilder rb = null;

		int statusCode = Response.Status.OK.getStatusCode();

		rb = Response.status(statusCode);
		rb.type("application/vnd.ms-outlook");
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		message.writeTo(baos);

		InputStream is = new ByteArrayInputStream(baos.toByteArray());
		rb.entity(is);
		rb.header(NRConstants.CONTENT_DISPOSITION, NRUtils.stringToUTF("newemail.eml"));

		return rb.build();

	}

	private static void fixMimeType()
	{
		//Thread.currentThread().setContextClassLoader( NREmlUtils.class.getClassLoader() );
		MailcapCommandMap mc = (MailcapCommandMap) CommandMap.getDefaultCommandMap();
		mc.addMailcap("text/html;; x-java-content-handler=com.sun.mail.handlers.text_html");
		mc.addMailcap("text/xml;; x-java-content-handler=com.sun.mail.handlers.text_xml");
		mc.addMailcap("text/plain;; x-java-content-handler=com.sun.mail.handlers.text_plain");
		mc.addMailcap("multipart/*;; x-java-content-handler=com.sun.mail.handlers.multipart_mixed");
		mc.addMailcap("message/rfc822;; x-java-content- handler=com.sun.mail.handlers.message_rfc822");
	}

	public static MimeMessage createDistribution(IDfSession session ,NRJsonObject jsonObject, List<NRFileObject> originals,
			List<NRFileObject> pdfs, List<String> objectIds, boolean shouldSendMainFormat, boolean shouldSendPDFAttachment, Map<String, NRFileObject> objectList,
			List<String> toContacts, List<String> ccContacts, String subject, String userMessage, boolean shouldSendPDFLink) throws Exception
	{
		String clientUrl = (String) jsonObject.getProperties().get(NRConstants.CLIENT_URL);
		String saarUrl = (String) jsonObject.getProperties().get(NRConstants.SAAR_URL);
		
		// fix to do not split long attachment filenames
		System.setProperty("mail.mime.encodeparameters", "false");
		System.setProperty("mail.mime.encodefilename", "true");

		MimeMessage message = new MimeMessage(Session.getInstance(System.getProperties()));

		message.setHeader("X-Unsent", "1");
		message.setSubject(MimeUtility.encodeText(subject, "utf-8", "B"));

		//setRecipients
		for (String to : toContacts)
		{
			if (isValidEmailAddress(to))
			{
				message.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(to));
			} else
			{
				message.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress("_", to, "UTF-8"));
			}

		}

		for (String cc : ccContacts)
		{
			//message.addRecipient(MimeMessage.RecipientType.CC, new InternetAddress(cc));
			if (isValidEmailAddress(cc))
			{
				message.addRecipient(MimeMessage.RecipientType.CC, new InternetAddress(cc));
			} else
			{
				message.addRecipient(MimeMessage.RecipientType.CC, new InternetAddress("_", cc, "UTF-8"));
			}
		}

		MimeBodyPart content = new MimeBodyPart();
		Multipart multipart = new MimeMultipart();

		StringBuilder htmlBuilder = new StringBuilder();
		//begin RTL
		htmlBuilder.append("<p DIR=\"RTL\">");
		if (userMessage != null && !"".equalsIgnoreCase(userMessage)){
			htmlBuilder.append(userMessage).append("<br/><br/>");
		}
		
		// Loop over List to build Link
		if (shouldSendPDFLink)
		{
			if (objectList.entrySet().size() == 1)
			{
				htmlBuilder.append(getHebrewStrings().getProperty("mail_links_title_doc")+ ": " + "<br/><br/>");
			}
			else if (objectList.entrySet().size() > 1)
			{
				htmlBuilder.append(getHebrewStrings().getProperty("mail_links_title_docs") + ": " + "<br/><br/>");
			}
			
			for (Map.Entry<String, NRFileObject> entry : objectList.entrySet())
			{
				htmlBuilder.
					append(getHebrewStrings().getProperty("mail_id")).append(": ").append(entry.getValue().getGovId()).append("<br/>").
					append(getHebrewStrings().getProperty("mail_saar_lite")).append(": ").
					append("<a href=\"").append(clientUrl).append("dist.html?roid=").append(entry.getKey()).append("\" >").
					append(entry.getValue().getName()).append("</a><br/>");

				if (saarUrl !=null && saarUrl.length() > 0)
				{
					
					String objId = entry.getKey().toString();
					IDfPersistentObject sysobj = session.getObject(new DfId(objId));
					
					htmlBuilder.
						append(getHebrewStrings().getProperty("mail_saar")).append(": ").
						append("<a href=\"").append(saarUrl).append("component/exsearch?unitlayer=" + entry.getValue().getUnitLayer() + "&docType="+sysobj.getType().getName()+"&docAttrNames=gov_id&docAttrValues=").append(entry.getValue().getGovId()).
						append("\" >").append(entry.getValue().getName()).append("</a><br/>");
				}
				
				htmlBuilder.append("<br/>");
			}
		}

		//attach image	
		htmlBuilder.append("<img src=\"cid:saarlogo\">");

		URI uri = NREmlUtils.class.getClassLoader().getResource("LogoBanner.png").toURI();
		DataSource fds = new FileDataSource(new File(uri));
		MimeBodyPart image = new MimeBodyPart();
		image.setDataHandler(new DataHandler(fds));
		image.setHeader("Content-ID", "<saarlogo>");
		multipart.addBodyPart(image);

		//end RTL
		htmlBuilder.append("</p>");

		if (htmlBuilder.length() > 0)
		{
			content.setText(htmlBuilder.toString(), "UTF-8", "html");
		} else
		{
			content.setText(" ");
		}
		multipart.addBodyPart(content);

		// add attachments
		if (shouldSendMainFormat)
		{
			for (NRFileObject object : originals)
			{
				MimeBodyPart attachment = new MimeBodyPart();
				DataSource source = new InputStreamDataSource(object.getInputStream(), MimeUtility
						.encodeText(NRSanitizingUtils.desanitize(object.getFullNameForDownload()), "UTF-8", null));
				attachment.setDataHandler(new DataHandler(source));
				attachment.setFileName(MimeUtility
						.encodeText(NRSanitizingUtils.desanitize(object.getFullNameForDownload()), "UTF-8", null));
				multipart.addBodyPart(attachment);
			}
		}

		if (shouldSendPDFAttachment)
		{
			for (NRFileObject object : pdfs)
			{
				MimeBodyPart attachment = new MimeBodyPart();
				DataSource source = new InputStreamDataSource(object.getInputStream(), MimeUtility
						.encodeText(NRSanitizingUtils.desanitize(object.getFullNameForDownload()), "UTF-8", null));
				attachment.setDataHandler(new DataHandler(source));
				attachment.setFileName(MimeUtility
						.encodeText(NRSanitizingUtils.desanitize(object.getFullNameForDownload()), "UTF-8", null));
				multipart.addBodyPart(attachment);
			}
		}
		
		message.setContent(multipart);

		// message.setText(htmlBuilder.toString(), "UTF-8","html");

		return message;
	}

	private static Message parseMessageStream(InputStream messageStream)
	{
		MsgParser msgp = new MsgParser();
		try
		{
			Message msg = msgp.parseMsg(messageStream);
			return msg;
		} catch (UnsupportedOperationException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static void updateMsgDocumentObject(IDfSession session, String objectId, InputStream inputStream)
	{
		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
			
			//setting 'received by' property in the object properties of the Object to be 'sent by email'
			dctmObject.setString(NRConstants.ATTR_SOURCE , NRConstants.SOURCE_EMAIL_CODE_NUMBER);

			String contentType = dctmObject.getString(NRConstants.A_CONTENT_TYPE);

			if (!NRConstants.MSG.equalsIgnoreCase(contentType))
			{
				return;
			}

			Message msg = parseMessageStream(inputStream);
			List<RecipientEntry> recipients = msg.getRecipients();
			String fromName = msg.getFromName();
			String fromEmail = msg.getFromEmail();
			dctmObject.setString(NRConstants.SENDER_NAME, fromName);
			dctmObject.setString(NRConstants.SENDER_ID, fromEmail);
			String toName = msg.getToName();
			String toEmail = msg.getToEmail();
			dctmObject.appendString(NRConstants.ADDRESSEE_NAME, toName);
			dctmObject.appendString(NRConstants.ADDRESSEE_ID, toEmail);
			saveGovOutlookFieldsObject(session, toName, toEmail);
			
			Date date = msg.getClientSubmitTime();
			
			if (date == null)
			{
				date = new Date();
			}
			
			DfTime newTime = new DfTime(date);
			dctmObject.setTime(NRConstants.DOC_DATE, newTime);
			
			for (int i = 0; i < recipients.size(); i++)
			{
				RecipientEntry recipient = recipients.get(i);
				if (!toEmail.equalsIgnoreCase(recipient.getToEmail()))
				{
					String name = recipient.getToName() != null ? recipient.getToName() : recipient.getToEmail();
					dctmObject.appendString(NRConstants.CC_NAME, name);
					dctmObject.appendString(NRConstants.CC_ID, recipient.getToEmail());
					saveGovOutlookFieldsObject(session, name, recipient.getToEmail());
				}
			}
			
			dctmObject.save();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
	}

	private static void saveGovOutlookFieldsObject(IDfSession session, String name, String email)
	{
		try
		{
			IDfPersistentObject outlookFieldsObject = (IDfPersistentObject) session.newObject(NRConstants.GOV_OUTLOOK_FIELDS);
			outlookFieldsObject.setString(NRConstants.FULL_NAME, name);
			outlookFieldsObject.setString(NRConstants.OUTLOOK_ID, email);
			outlookFieldsObject.save();
		}
		catch (DfException e)
		{
			//print nothing
		}
	}

	public static void createMailAutoEvents(List<String> objectIds, IDfSession session, List<Map<String, String>> recipients, String subject, String message, boolean shouldSendMainFormat, boolean shouldSendPDFAttachment, boolean shouldSendPDFLink)
	{
		ArrayList <String> to = new ArrayList<String>();
		ArrayList <String> cc = new ArrayList<String>();
		processRecipientsForAutoEvent(recipients, to, cc);
		String eventDescription = processAutoEventDescription(shouldSendMainFormat, shouldSendPDFAttachment, shouldSendPDFLink, subject, message, to, cc);
		String eventOwnerName = null;
		try
		{
			//get user_name
			IDfQuery query = new DfQuery();
			String dql = NRConstants.QUERY_USERNAME_BY_LOGIN_NAME.replace("%1", session.getUser(null).getUserName());
			query.setDQL(dql);
			IDfCollection col = query.execute(session, IDfQuery.DF_READ_QUERY);
			while (col.next())
			{
				eventOwnerName = col.getString(NRConstants.USER_NAME);
				break;
			}

			//create events
			for (String objectId : objectIds)
			{
				try
				{
					IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
					IDfSysObject event = (IDfSysObject) session.newObject(NRConstants.GOV_EVENT_RECORD);
					//Event link to document
					event.setString(NRConstants.OBJECT_GOV_ID, dctmObject.getString(NRConstants.GOV_ID));
					//Event object type
					event.setString(NRConstants.OBJECT_TYPE_NAME, dctmObject.getTypeName());
					//Status Auto
					event.setString(NRConstants.STATUS, "3");
					//Set Event Description
					event.setString(NRConstants.EVENT_DESC, eventDescription);
					//Set start Date
					DfTime newTime = new DfTime(new Date());
					event.setTime(NRConstants.START_DATE, newTime);
					//Set auto event
					event.setBoolean(NRConstants.IS_AUTO_EVENT, true);
					//Set was distributed
					event.setBoolean(NRConstants.WAS_DISTRIBUTED, true);
					//Set owner of the event
					event.setOwnerName(eventOwnerName);
					//Set Sender Name
					event.setRepeatingString(NRConstants.SENDER_NAME, 0, eventOwnerName);
					event.setRepeatingString(NRConstants.SENDER_ID, 0, eventOwnerName);
					//Set TO (addressee name and id)
					for (int i = 0; i < to.size(); i++)
					{
						event.setRepeatingString(NRConstants.ADDRESSEE_NAME, i, to.get(i).substring(0, to.get(i).indexOf("|")));
						event.setRepeatingString(NRConstants.ADDRESSEE_ID, i, to.get(i).substring(to.get(i).indexOf("|"))+1);
					}
					//Set CC (cc name and id)
					for (int i = 0; i < cc.size(); i++)
					{
						event.setRepeatingString(NRConstants.CC_NAME, i, cc.get(i).substring(0, cc.get(i).indexOf("|")));
						event.setRepeatingString(NRConstants.CC_ID, i, cc.get(i).substring(cc.get(i).indexOf("|"))+1);
					}
					//Set event type from code table		
					event.setInt(NRConstants.EVENT_TYPE, 7);
					//Link event
					event.link(null);
					//Save event
					event.save();
				}
				catch (Exception e)
				{
					e.printStackTrace();
				}
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	private static String processAutoEventDescription(boolean shouldSendMainFormat, boolean shouldSendPDFAttachment, boolean shouldSendPDFLink, String subject, String message, ArrayList<String> to, ArrayList<String> cc)
	{
		StringBuffer buffer = new StringBuffer();
		
		//append title
		buffer.append(getHebrewStrings().getProperty("distribution_title"));
		
		//append formats
		buffer.append(shouldSendPDFLink ? getHebrewStrings().getProperty("distribution_link") : "");
		buffer.append(shouldSendPDFAttachment ? getHebrewStrings().getProperty("distribution_pdf") : "");
		buffer.append(shouldSendMainFormat ? getHebrewStrings().getProperty("distribution_source") : "");
		
		if (buffer.length() > 0)
		{	
			buffer.replace(buffer.lastIndexOf(","), buffer.lastIndexOf(",")+1, ".");
		}
		
		buffer.append(System.getProperty("line.separator"));
		buffer.append(System.getProperty("line.separator"));
		
		//append subject
		buffer.append(getHebrewStrings().getProperty("distribution_subject"));
		buffer.append(subject);
		buffer.append(System.getProperty("line.separator"));
		buffer.append(System.getProperty("line.separator"));
		
		//append message body
		buffer.append(getHebrewStrings().getProperty("distribution_message_body"));
		buffer.append(System.getProperty("line.separator"));
		buffer.append(message);
		buffer.append(System.getProperty("line.separator"));
		buffer.append(System.getProperty("line.separator"));
		
		//append to
		buffer.append(getHebrewStrings().getProperty("distribution_to"));
		buffer.append(System.getProperty("line.separator"));
		buffer.append(processRecipientsForEventDesc(to));
		buffer.append(System.getProperty("line.separator"));
		
		//append cc
		buffer.append(getHebrewStrings().getProperty("distribution_cc"));
		buffer.append(System.getProperty("line.separator"));
		buffer.append(processRecipientsForEventDesc(cc));
		
		//match against event_desc max length and remove excess characters
		String eventDesc = NRUtils.processEventDescriptionLength(new String(buffer));
		
		return eventDesc;
	}

	private static String processRecipientsForEventDesc(ArrayList<String> recipients)
	{
		StringBuffer buffer = new StringBuffer();
		String name;
		String email;
		
		for (int i = 0; i < recipients.size(); i++)
		{
			name = recipients.get(i).substring(0, recipients.get(i).indexOf("|"));
			email = recipients.get(i).substring(recipients.get(i).indexOf("|")+1);
			buffer.append(name + " - " + email);
			buffer.append(System.getProperty("line.separator"));
		}
		
		return new String (buffer);
	}

	private static void processRecipientsForAutoEvent(List<Map<String, String>> recipients, ArrayList<String> to,
			ArrayList<String> cc)
	{
		String type;
		if(recipients!=null)
		{
			for (int i = 0; i < recipients.size(); i++)
			{
				Map<String, String> recipient = recipients.get(i);
				type = recipient.get("type");
				if ("to".equalsIgnoreCase(type))
				{
					if (recipient.get("name") != null && recipient.get("name").length() > 0)
					{
						to.add(recipient.get("name")+"|"+recipient.get("email"));
					}
					else
					{
						to.add(recipient.get("email")+"|"+recipient.get("email"));
					}
				}
				else
				{
					if (recipient.get("name") != null && recipient.get("name").length() > 0)
					{
						cc.add(recipient.get("name")+"|"+recipient.get("email"));
					}
					else
					{
						cc.add(recipient.get("email")+"|"+recipient.get("email"));
					}
				}
			}
		}
	}

	public static boolean isValidEmailAddress(String email)
	{
		boolean result = true;
		try
		{
			InternetAddress emailAddr = new InternetAddress(email);
			emailAddr.validate();
		} catch (Exception ex)
		{
			result = false;
		}
		return result;
	}
	
	static class MyMimeMessage extends MimeMessage{

		public MyMimeMessage(Session session)
		{
			super(session);
			// TODO Auto-generated constructor stub
		}
		
	}

	public static Properties getHebrewStrings()
	{
		if (hebrewStrings == null)
		{
			try
			{
				hebrewStrings = new Properties();
				hebrewStrings.load(NREmlUtils.class.getClassLoader().getResourceAsStream(NRConstants.HEBREW_STRINGS_PROPERTIES));
			}
			catch (Exception e)
			{
				hebrewStrings = null;
				NRUtils.handleErrors(e);
			}
		}
		
		return hebrewStrings;
	}
}
