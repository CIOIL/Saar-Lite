package com.ness.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.lang.StringEscapeUtils;
import org.glassfish.jersey.media.multipart.ContentDisposition;

import com.ness.communication.NRSessionManager;
import com.ness.objects.NRFileObject;
import com.ness.objects.NRJsonObject;
import com.ness.objects.NRLoginInfo;
import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.independentsoft.msg.Attachment;
import com.independentsoft.msg.DisplayType;
import com.independentsoft.msg.Encoding;
import com.independentsoft.msg.Message;
import com.independentsoft.msg.MessageFlag;
import com.independentsoft.msg.ObjectType;
import com.independentsoft.msg.Recipient;
import com.independentsoft.msg.RecipientType;
import com.independentsoft.msg.StoreSupportMask;

@Path("/mail")
public class NRMailService
{
	@Context private HttpServletRequest httpRequest;
	
	@POST
	@Path("/distribution")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createMail(@Context ContainerRequestContext containerRequest,NRJsonObject object) throws Exception
	{
		NRLoginInfo login = new NRLoginInfo();
        login.setUsername("XXX");
        login.setPassword("XXX");
        login.setDocbase("XXX");
		//IDfSession session = new NRSessionManager().getUserSession(login);
        HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(login.getDocbase());
		
		int statusCode = Response.Status.OK.getStatusCode();
		Message message = null;
		
        try
        {
            message = new Message();
            message.setEncoding(Encoding.UNICODE);
            
            NRFileObject file = NRUtils.getObjectContent(session, "0901b2078002a567", null);       
            Attachment att = new Attachment(file.getFullNameForDownload(),file.getInputStream());
            
            ClassLoader classLoader = getClass().getClassLoader();
            Attachment image = new Attachment("LogoBanner.png",classLoader.getResourceAsStream("LogoBanner.png"));
            image.setContentId("LogoBanner.png");

            Recipient recipient1 = new Recipient();
            recipient1.setAddressType("SMTP");
            recipient1.setDisplayType(DisplayType.MAIL_USER);
            recipient1.setObjectType(ObjectType.MAIL_USER);
            recipient1.setDisplayName("or.fogel@ness.com");
            recipient1.setEmailAddress("or.fogel@ness.com");
            recipient1.setRecipientType(RecipientType.TO);

            Recipient recipient2 = new Recipient();
            recipient2.setAddressType("SMTP");
            recipient2.setDisplayType(DisplayType.MAIL_USER);
            recipient2.setObjectType(ObjectType.MAIL_USER);
            recipient2.setDisplayName("or.fogel@ness.com");
            recipient2.setEmailAddress("or.fogel@ness.com");
            recipient2.setRecipientType(RecipientType.CC);

            
            message.setSubject("עעעע");
            String htmlBody = "<html><body><table style = 'font-size:48px;'><tr><td>" + StringEscapeUtils.escapeHtml("שלום") + "</td></tr><tr><td><img src = 'cid:LogoBanner.png'/></td></tr></table></body></html>";
            message.setBodyHtmlText(htmlBody);
            byte[] rtfBody = new String("{\\rtf1\\ansi\\ansicpg1252\\fromhtml1 \\htmlrtf0 " + htmlBody + "}").getBytes("UTF8");
            message.setBodyRtf(rtfBody);
            
            message.setDisplayTo("John Smith");
            message.setDisplayCc("Mary Smith");
            message.getRecipients().add(recipient1);
            message.getRecipients().add(recipient2);
            message.getMessageFlags().add(MessageFlag.UNSENT);
            message.getStoreSupportMasks().add(StoreSupportMask.CREATE);
            message.getAttachments().add(att);
            message.getAttachments().add(image);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
        	sessionManager.release(session);
    		NRUtils.clearSensitiveData(login);
        }
        
		ContentDisposition contentDisposition = ContentDisposition.type(NRConstants.ATTACHMENT)
	    .fileName("Distribution.msg").build();
        
		ResponseBuilder rb = null;
		rb = Response.status(statusCode);
		rb.type("application/vnd.ms-outlook");
		rb.entity(message.toByteArray());
		rb.header(NRConstants.CONTENT_DISPOSITION,contentDisposition);

		return rb.build();        
	}
}
