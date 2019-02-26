package com.ness.rest.contentmethods;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;

import com.documentum.com.DfClientX;
import com.documentum.com.IDfClientX;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.common.DfId;
import com.documentum.fc.common.DfTime;
import com.documentum.fc.common.IDfTime;
import com.documentum.operations.IDfCancelCheckoutOperation;
import com.documentum.operations.IDfCheckinOperation;
import com.ness.communication.NRSessionManager;
import com.ness.objects.NRJsonObject;
import com.ness.objects.NRLoginInfo;
import com.ness.utils.NRConstants;
import com.ness.utils.NRObjectUtils;
import com.ness.utils.NRSignatureUtils;
import com.ness.utils.NRUtils;

public class NRContentMethods
{
	@Context
	private HttpServletRequest httpRequest;
	
	public boolean checkOutObject(IDfSession session, String objectId)
	{
		boolean successful = false;
		
		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
			dctmObject.checkout();
			successful = true;
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		return successful;
	}
	
	public String checkInObject(IDfSession session, String objectId)
	{
		String newObjectId = null;
		
		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
		
			if(dctmObject.isCheckedOut())
			{
				newObjectId = dctmObject.checkin(false, null).getId();
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		return newObjectId;
	}
	
	public boolean updateImportedObjectContent(IDfSession session, String objectId, InputStream fileInputStream, FormDataBodyPart filePart) throws Exception
    {
        boolean successful = false;
        
        try
        {
            IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
        
            dctmObject.setContentType(NRUtils.getFormatByFormData(session, filePart));
            dctmObject.setContent(NRUtils.getByteArrayFromInputStream(fileInputStream));

            dctmObject.save();
            successful = true;
        }
        catch(Exception e)
        {
            NRUtils.handleErrors(e);
        }
        
        return successful;
    }
	
	public boolean replaceObjectContent(IDfSession session, String objectId, InputStream fileInputStream, FormDataBodyPart filePart, String fileDate) throws Exception
	{
		boolean successful = false;
		
		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
			dctmObject.setContentType(NRUtils.getFormatByFormData(session, filePart));
			dctmObject.setContent(NRUtils.getByteArrayFromInputStream(fileInputStream));
			//System.out.println("******" + System.currentTimeMillis() + ": NRContentMethods.replaceObjectContent, objectId=" + objectId + ", fileDate=" + fileDate);
			
			if (fileDate != null)
			{
				IDfTime docTime = getDfTime(fileDate);
				dctmObject.setTime(NRConstants.DOC_DATE, docTime);
				//System.out.println("******" + System.currentTimeMillis() + ": NRContentMethods.replaceObjectContent, objectId=" + objectId + ", fileDate=" + docTime);
			}
			
			dctmObject.save();
			//dctmObject.getTime("doc_date").getDate()
			successful = true;
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		return successful;
	}
	
	public NRJsonObject changeContent(IDfSession session, String objectId, InputStream fileInputStream, FormDataBodyPart filePart) throws Exception
	{
		String newObjectId = objectId;
		NRJsonObject jsonObject = null;
		
		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
			dctmObject.checkout();
			dctmObject.getVersionPolicy().getNextMinorLabel();
			dctmObject.setContentType(NRUtils.getFormatByFormData(session, filePart));
			dctmObject.setContent(NRUtils.getByteArrayFromInputStream(fileInputStream));
			newObjectId = dctmObject.checkin(false, "").getId();
			jsonObject = NRObjectUtils.getObjectById(session, newObjectId);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		return jsonObject;
	}
	/**
	 * Called from signAndReplaceContent method in order not to create redundant connection to database.
	 * @param session
	 * @param dctmObject
	 * @param fileInputStream
	 * @param filePart
	 * @param fileDate
	 * @return
	 * @throws Exception
	 */
	private boolean replaceObjectContent(IDfSession session, IDfSysObject dctmObject, InputStream fileInputStream,
			FormDataBodyPart filePart, String fileDate) throws Exception
	{
		boolean successful = false;

		dctmObject.setContentType(NRUtils.getFormatByFormData(session, filePart));
		dctmObject.setContent(NRUtils.getByteArrayFromInputStream(fileInputStream));
		
		if (fileDate != null)
		{
			IDfTime docTime = getDfTime(fileDate);
			dctmObject.setTime(NRConstants.DOC_DATE, docTime);
			//System.out.println("******" + System.currentTimeMillis() + ": NRContentMethods.replaceObjectContent, objectId=" + dctmObject.getObjectId() + ", fileDate=" + docTime);
		}
		
		dctmObject.save();
		successful = true;

		return successful;
	}

	public String deleteObjects(IDfSession session, NRJsonObject object)
	{
		String successful = ""; 
		
		try
		{
			ArrayList <IDfSysObject> objectsToDelete = new ArrayList <IDfSysObject>();
			List<String> docRObjectIdsList = NRUtils.objectToList(object.getProperties().get(NRConstants.DOC_IDS));
			
			for (int i = 0; i < docRObjectIdsList.size(); i ++)
			{
				IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(docRObjectIdsList.get(i)));
				objectsToDelete.add(dctmObject);
			}
			
			successful = NRObjectUtils.deleteObjects(session, objectsToDelete);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		return successful;
	}

	/**
	 * Sign document with signature image and check in. 
	 * @param requestLoginInfo
	 * @param newObjectId
	 * @param fileInputStream
	 * @param signatureObjectId
	 * @return
	 */
	public boolean signAndReplaceContent(NRLoginInfo loginInfo, String newObjectId, InputStream fileInputStream,
			String signatureObjectId, FormDataBodyPart filePart)
	{
		IDfSession session = null;
		IDfSessionManager sessionManager = null;
		try
		{
			HttpSession httpSession = httpRequest.getSession(true);
			sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(loginInfo, httpSession);
			session = sessionManager.getSession(loginInfo.getDocbase());

			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(signatureObjectId));
			
			InputStream signatureImageIS = dctmObject.getContent();
			
			//sign document
			InputStream signedDocumentIS = NRSignatureUtils.sign(fileInputStream, signatureImageIS);
			
			return replaceObjectContent(session, dctmObject, signedDocumentIS, filePart, null);
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
	}

	public boolean cancelCheckOutObject(IDfSession session,String objectId)
	{
		boolean successful = false;
		
		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
			
			IDfClientX clientx = new DfClientX();
			IDfCancelCheckoutOperation cancelCheckoutOperation = clientx.getCancelCheckoutOperation();
			cancelCheckoutOperation.add(dctmObject);
					
			cancelCheckoutOperation.setSession(session);
			successful = cancelCheckoutOperation.execute();
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}		
		
		return successful;
	}

	public String checkinObjectWithVersionPolicy(IDfSession session, String objectId, String versionPolicy, String contentType, ByteArrayInputStream fileInputStream) throws Exception
	{
		IDfSysObject object = (IDfSysObject) session.getObject(new DfId(objectId));
		
		if (!object.isCheckedOut() && !object.isCheckedOutBy(session.getUser(null).getUserName()))
		{
			throw new Exception ("object is not checked out by the user");
		}
		
		int version = validateVersionPolicy(versionPolicy);
		String newObjectId = null;
		
		///set versionPolicy for newly created document
		int newVersionLabelIndex = -1;
		String newVersionLabel = null;
		for (int i = 0; i < object.getVersionLabelCount(); i++)
		{
			newVersionLabel = object.getVersionLabel(i);
			if (NRConstants.NEW_OBJECT_LABEL.equals(newVersionLabel))
			{
				newVersionLabelIndex = i;
				version = (int)IDfCheckinOperation.SAME_VERSION;
				break;
			}
		}
				
		if (version == IDfCheckinOperation.NEXT_MINOR) 
		{
			object.setContentType(contentType);
			object.setContent(NRUtils.getByteArrayFromInputStream(fileInputStream));
			object.mark(object.getVersionPolicy().getNextMinorLabel());
			newObjectId = object.checkin(false, null).getId();
		}
		else if (version == IDfCheckinOperation.NEXT_MAJOR)
		{
			object.setContentType(contentType);
			object.setContent(NRUtils.getByteArrayFromInputStream(fileInputStream));
			object.mark(object.getVersionPolicy().getNextMajorLabel());
			newObjectId = object.checkin(false, null).getId();
		}
		else if (version == IDfCheckinOperation.SAME_VERSION)
		{
			///unmark new version label before cancelCheckout so document will not be deleted
			if(newVersionLabelIndex != -1)
			{
				object.unmark(newVersionLabel);
			}
			object.cancelCheckout();
			object.setContentType(contentType);
			object.setContent(NRUtils.getByteArrayFromInputStream(fileInputStream));
			///unmark new version label before call save so document will be saved without new label
			if(newVersionLabelIndex != -1)
			{
				object.unmark(newVersionLabel);
			}
			object.save();
			newObjectId = object.getObjectId().getId();
		}
		
		if (newObjectId == null)
		{
			throw new Exception ("checkin failed");
		}
		
		return newObjectId; 
	}

	private int validateVersionPolicy(String versionPolicy) throws Exception
	{
		int vp = Integer.parseInt(versionPolicy);
		
		if (!(vp == IDfCheckinOperation.SAME_VERSION || vp == IDfCheckinOperation.NEXT_MINOR || vp == IDfCheckinOperation.NEXT_MAJOR))
		{
			throw new Exception ("invalid version policy");
		}
		
		return vp;
	}
	
	private IDfTime getDfTime(String fileDate)
	{
		long time = Long.parseLong(fileDate);
		Date date = new Date(time);
		return new DfTime(date);
	}
}