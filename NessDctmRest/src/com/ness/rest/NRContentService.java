package com.ness.rest;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;

import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.ness.communication.NRSessionManager;
import com.ness.objects.NRFileObject;
import com.ness.objects.NRJsonObject;
import com.ness.objects.NRLoginInfo;
import com.ness.rest.contentmethods.NRContentMethods;
import com.ness.utils.NRConstants;
import com.ness.utils.NRContactsUtils;
import com.ness.utils.NREmlUtils;
import com.ness.utils.NRUtils;

@Path("/content")
public class NRContentService
{
	@Context private HttpServletRequest httpRequest;
	
	@POST
	@Path("/replace/{objectId}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response replaceConent(@Context ContainerRequestContext containerRequest, FormDataMultiPart form, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		
		FormDataBodyPart filePart = form.getField(NRConstants.FILE);
		InputStream fileInputStream = filePart.getValueAs(InputStream.class);
		NRContentMethods contentMethods = new NRContentMethods();
		FormDataBodyPart advanceVersionPart = form.getField("version");
		String advanceVersion = null;
		
		if (advanceVersionPart != null)
		{
			advanceVersion = advanceVersionPart.getValue();
		}
		
		byte[] bytes = IOUtils.toByteArray(fileInputStream);
		
		boolean output = contentMethods.replaceObjectContent(session, objectId, new ByteArrayInputStream(bytes), filePart, advanceVersion);
	
		if (output)
		{	
			//update recipients of msg file
			NREmlUtils.updateMsgDocumentObject(session, objectId, new ByteArrayInputStream(bytes));	
			statusCode = Response.Status.OK.getStatusCode();
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).build();
	}
	
	@POST
	@Path("updateimportedobjectcontent/{objectId}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response updateImportedObjectContent(@Context ContainerRequestContext containerRequest, FormDataMultiPart form, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
			
		FormDataBodyPart filePart = form.getField(NRConstants.FILE);
		InputStream fileInputStream = filePart.getValueAs(InputStream.class);
		NRContentMethods contentMethods = new NRContentMethods();
		
		byte[] bytes = IOUtils.toByteArray(fileInputStream);
		
		boolean output = contentMethods.updateImportedObjectContent(session, objectId, new ByteArrayInputStream(bytes), filePart);
	
		if (output)
		{	
			//update recipients of msg file
			NREmlUtils.updateMsgDocumentObject(session, objectId, new ByteArrayInputStream(bytes));
				
			statusCode = Response.Status.OK.getStatusCode();
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).build();
	}
	
	@POST
	@Path("changecontent/{objectId}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response changeContent(@Context ContainerRequestContext containerRequest, FormDataMultiPart form, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		
		FormDataBodyPart filePart = form.getField(NRConstants.FILE);
		InputStream fileInputStream = filePart.getValueAs(InputStream.class);
		NRContentMethods contentMethods = new NRContentMethods();
		
		byte[] bytes = IOUtils.toByteArray(fileInputStream);
		
		NRJsonObject jsonObject = contentMethods.changeContent(session, objectId, new ByteArrayInputStream(bytes), filePart);
	
		if (jsonObject != null)
		{	
			//update recipients of msg file
			NREmlUtils.updateMsgDocumentObject(session, objectId, new ByteArrayInputStream(bytes));	
			statusCode = Response.Status.OK.getStatusCode();
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).entity(jsonObject).build();
	}
	
	@POST
	@Path("/replace/{objectId}/{fileDate}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response replaceConent(@Context ContainerRequestContext containerRequest, FormDataMultiPart form,
			@PathParam("objectId") String objectId, @PathParam("fileDate") String fileDate) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		FormDataBodyPart filePart = form.getField(NRConstants.FILE);
		InputStream fileInputStream = filePart.getValueAs(InputStream.class);
		NRContentMethods contentMethods = new NRContentMethods();
		
		byte[] bytes = IOUtils.toByteArray(fileInputStream);

		boolean output = contentMethods.replaceObjectContent(session, objectId, new ByteArrayInputStream(bytes), filePart, fileDate);

		if (output)
		{
			//update recipients of msg file
			NREmlUtils.updateMsgDocumentObject(session, objectId, new ByteArrayInputStream(bytes));
			statusCode = Response.Status.OK.getStatusCode();
		}

		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).build();
	}

	@POST
	@Path("/checkout/{objectId}")
	public Response checkOutObject(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		NRContentMethods contentMethods = new NRContentMethods();

		boolean output = contentMethods.checkOutObject(session, objectId);

		if (output)
		{
			statusCode = Response.Status.OK.getStatusCode();
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).entity(NRUtils.getRequestLoginInfo(containerRequest).getUsername()).build();
	}

	@POST
	@Path("/checkin/{objectId}")
	public Response checkInObject(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		NRContentMethods contentMethods = new NRContentMethods();

		String output = contentMethods.checkInObject(session, objectId);

		if (output != null)
		{
			statusCode = Response.Status.OK.getStatusCode();
		}

		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).build();
	}
	
	@POST
	@Path("/read/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response readObjectById(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		List<String> objectIds = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));	
		return downloadObjectById(containerRequest, objectIds.get(0), NRConstants.PDF);
	}

	
	@POST
	@Path("/edit/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response editObjectById(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		List<String> objectIds = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));
		String objectId = objectIds.get(0);
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		NRContentMethods contentMethods = new NRContentMethods();

		if (contentMethods.checkOutObject(session, objectId))
		{
			return downloadObjectById(containerRequest, objectId, null);
		}

		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).build();
	}

	@POST
	@Path("/checkinContent/{objectId}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response checkinContent(@Context ContainerRequestContext containerRequest, FormDataMultiPart form, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());

		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		FormDataBodyPart filePart = form.getField(NRConstants.FILE);
		InputStream fileInputStream = filePart.getValueAs(InputStream.class);
		NRContentMethods contentMethods = new NRContentMethods();
		
		String newObjectId = contentMethods.checkInObject(session, objectId);

		if (newObjectId != null)
		{
			if (contentMethods.replaceObjectContent(session, newObjectId, fileInputStream, filePart, null))
			{
				statusCode = Response.Status.OK.getStatusCode();
			}
		}

		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).entity(newObjectId).build();
	}
	
	/**
	 * Make checkin with signature
	 * @param containerRequest
	 * @param form
	 * @param objectId
	 * @return
	 * @throws Exception
	 */
	@POST
	@Path("/checkinSignContent/{objectId}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response checkinSignContent(@Context ContainerRequestContext containerRequest, FormDataMultiPart form, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		FormDataBodyPart filePart = form.getField(NRConstants.FILE);
		InputStream fileInputStream = filePart.getValueAs(InputStream.class);
		String signatureObjectId = "enter object id!!!!";
		NRContentMethods contentMethods = new NRContentMethods();
		
		String newObjectId = contentMethods.checkInObject(session, objectId);
		
		if (newObjectId != null)
		{
			if (contentMethods.signAndReplaceContent(NRUtils.getRequestLoginInfo(containerRequest), newObjectId, 
                    fileInputStream, signatureObjectId, filePart))
			{
				statusCode = Response.Status.OK.getStatusCode();
			}
		}

		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).entity(newObjectId).build();
	}

	@GET
	@Path("/download/{objectId}")
	public Response downloadObjectById(@Context ContainerRequestContext containerRequest,
			@PathParam("objectId") String objectId, String contentType) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		NRFileObject fileObject = null;
		ResponseBuilder rb = null;
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		
		try
		{	
			fileObject = NRUtils.getObjectContent(session, objectId, contentType);			
			// The requested content wasn't found, get the original file
			if (contentType != null && fileObject == null)
			{
				fileObject = NRUtils.getObjectContent(session, objectId, null);
			}
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
			fileObject = null;
		}

		if (fileObject != null)
		{
			statusCode = Response.Status.OK.getStatusCode();

			rb = Response.status(statusCode);
			rb.type(fileObject.getType());
			rb.entity(fileObject.getInputStream());
			rb.header(NRConstants.CONTENT_DISPOSITION, NRUtils.stringToUTF(fileObject.getFullNameForDownload()));
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
			return rb.build();
		}
		else
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
			return Response.status(statusCode).build();
		}
	}

	@POST
	@Path("/createEmail/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createEmail(@Context ContainerRequestContext containerRequest,
            NRJsonObject object) throws Exception
	{

		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		List<String> objectIds = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));
		Map<String,NRFileObject> objectList = new HashMap<>();
		boolean shouldSendMainFormat = Boolean.valueOf((String)object.getProperties().get(NRConstants.SHOULD_SEND_MAIN_FORMAT));
		boolean shouldSendPDFAttachment = Boolean.valueOf((String)object.getProperties().get(NRConstants.SHOULD_SEND_PDF_ATTACHMENT));
		boolean shouldSendPDFLink = Boolean.valueOf((String)object.getProperties().get(NRConstants.SHOULD_SEND_PDF_LINK));
		List<Map<String,String>> recipients = (List<Map<String,String>>) object.getProperties().get(NRConstants.RECIPIENTS);
		String subject = (String)object.getProperties().get(NRConstants.SUBJECT);
		String message = (String)object.getProperties().get(NRConstants.MESSAGE);
		
		
		List <String> toContacts = new ArrayList<>();
		List <String> ccContacts = new ArrayList<>();
		for (int i = 0; i < recipients.size(); i++){
			Map<String, String> recipient = recipients.get(i);
			if ("to".equalsIgnoreCase(recipient.get("type"))){
				toContacts.add("".equalsIgnoreCase(recipient.get("email")) ? recipient.get("name") :  recipient.get("email"));
			} else {
				ccContacts.add("".equalsIgnoreCase(recipient.get("email")) ? recipient.get("name") :  recipient.get("email"));
			}
		}

		List<NRFileObject> originals = new ArrayList<>();
		List<NRFileObject> pdfs = new ArrayList<>();
		
		for (String objectId : objectIds)
		{
			NRFileObject fileObjectMainFormat = null;
			NRFileObject fileObjectPDF = null;
			NRFileObject fileObjectLink = null; 
			
			try
			{				
				if (shouldSendMainFormat)
				{
					fileObjectMainFormat = NRUtils.getObjectContent(session, objectId, null);
				}

				if (fileObjectMainFormat != null)
				{	
					originals.add(fileObjectMainFormat);
					fileObjectMainFormat = null;
				}
				
				if (shouldSendPDFAttachment)
				{
					fileObjectPDF = NRUtils.getObjectContent(session, objectId, NRConstants.PDF);
				}
				
				if (fileObjectPDF != null)
				{
					
					pdfs.add(fileObjectPDF);
					fileObjectPDF = null;
				}
				
				if (shouldSendPDFLink)
				{
					fileObjectLink = NRUtils.getObjectContent(session, objectId, NRConstants.PDF); 
					
				}
				
				if (fileObjectLink != null)
				{
					objectList.put(objectId, fileObjectLink);
					fileObjectLink = null;
				}	

			} catch (Exception e)
			{
				NRUtils.handleErrors(e);
			}

		}

		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		if (!shouldSendPDFLink){
			objectIds = new ArrayList<String>();
			objectList = new HashMap<>();
		}
		MimeMessage mimeMessage = NREmlUtils.createDistribution(session, object, originals, pdfs, objectIds, 
				shouldSendMainFormat, shouldSendPDFAttachment,objectList, toContacts, ccContacts, subject, message, shouldSendPDFLink);

		if (message != null)
		{
			objectIds = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));
			NREmlUtils.createMailAutoEvents(objectIds, session, recipients, subject, message, shouldSendMainFormat, shouldSendPDFAttachment, shouldSendPDFLink);
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
			return NREmlUtils.buildResponse(mimeMessage);
		}
		else
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
			return Response.status(statusCode).build();
		}
		
	}
	
	@POST
	@Path("/checkPDF/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response checkPDF(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		List<String> objectIds = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));
		boolean allObjectsHavePDF = true;
		
		for (String objectId : objectIds)
		{
			NRFileObject fileObjectPDF = null;
			
			try
			{		
				fileObjectPDF = NRUtils.getObjectContent(session, objectId, NRConstants.PDF);
				
				if (fileObjectPDF == null)
				{
					 allObjectsHavePDF = false;
				}
			}
			catch(Exception e)
			{
				allObjectsHavePDF = false;
				NRUtils.handleErrors(e);
			}
		}

		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);

		int statusCode = Response.Status.OK.getStatusCode();
		return Response.status(statusCode).entity(allObjectsHavePDF).build();
	}
	
	@POST
	@Path("/delete/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteObjects(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		String responseText = "";
		NRContentMethods contentMethods = new NRContentMethods();
		String successful = contentMethods.deleteObjects(session, object);
		
		if (successful.length()==0)
		{
			statusCode = Response.Status.OK.getStatusCode();
		}
		else
		{
			responseText = successful; 
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).entity(responseText).build();
	}

	/** Retrieves details of document recipients
	 * @param containerRequest
	 * @param object
	 * @return
	 * @throws Exception
	 */
	@POST
	@Path("/getContacts/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getContacts(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
        session = sessionManager.getSession(loginInfo.getDocbase());
		
        List<String> objectIds = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));
		String objectId = objectIds.get(0);
		String objectType = (String)object.getProperties().get(NRConstants.R_OBJECT_TYPE);
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		NRJsonObject objectToReturn = NRContactsUtils.getContactsByTypeAndId(session, objectId, objectType);
		
		if (objectToReturn != null)
		{
			statusCode = Response.Status.OK.getStatusCode();
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		return Response.status(statusCode).entity(objectToReturn).build();
	}

	@POST
	@Path("/cancelCheckout/{objectId}")
	public Response cancelCheckoutObjectById(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		NRContentMethods contentMethods = new NRContentMethods();
		
		boolean output = contentMethods.cancelCheckOutObject(session, objectId);
		
		if (output)
		{
			statusCode = Response.Status.OK.getStatusCode();
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		
		return Response.status(statusCode).build();
	}
	
	@POST
	@Path("/viewSource/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response readAnyFile(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		List<String> objectIds = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));
		String objectId = objectIds.get(0);
		
		return downloadObjectById(containerRequest, objectId, null);
	}
	
	@POST
	@Path("/checkinWVP/")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response checkinWithVersionPolicy(@Context ContainerRequestContext containerRequest, FormDataMultiPart form) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		IDfSession session = sessionManager.getSession(loginInfo.getDocbase());
		
		NRContentMethods contentMethods = new NRContentMethods();
		int statusCode = Response.Status.OK.getStatusCode();
		String newObjectId = "";
		
		try
		{
			String objectId = form.getField("objectId").getValue();
			String versionPolicy = form.getField("versionPolicy").getValue();
			byte[] bytes = IOUtils.toByteArray(form.getField(NRConstants.FILE).getValueAs(InputStream.class));
			String contentType = NRUtils.getFormatByFormData(session, form.getField(NRConstants.FILE));
			
			newObjectId = contentMethods.checkinObjectWithVersionPolicy(session, objectId, versionPolicy, contentType, new ByteArrayInputStream(bytes));
			
			//update recipients of msg file
			NREmlUtils.updateMsgDocumentObject(session, objectId, new ByteArrayInputStream(bytes));
		}
		catch (Exception e)
		{
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
			e.printStackTrace();
		}
		
		sessionManager.release(session);
		NRUtils.clearSensitiveData(loginInfo);
		return Response.status(statusCode).entity(newObjectId).build();
	}
}