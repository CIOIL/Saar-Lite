package com.ness.rest;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.io.FileUtils;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.documentum.fc.common.DfException;
import com.ness.communication.NRSessionManager;
import com.ness.objects.NRFileObject;
import com.ness.objects.NRJsonObject;
import com.ness.objects.NRLoginInfo;
import com.ness.rest.objectmethods.NRObjectMethods;
import com.ness.rest.userinfomethods.NRUserInfoMethods;
import com.ness.utils.NRConstants;
import com.ness.utils.NRExcludedColumns;
import com.ness.utils.NRObjectUtils;
import com.ness.utils.NROutlookFieldsUtils;
import com.ness.utils.NRRoleUtils;
import com.ness.utils.NRUtils;

/******************************************************************
 * This class handles object operations
 *******************************************************************/	
@Path("/os")
public class NRObjectService 
{	
	@Context
	private HttpServletRequest httpRequest;
	
	/******************************************************************
	 * This method returns an object (all fields included) as XML
	 * URL usage: /get/<object type>/<object id> 
	 * @param headers
	 * @param objectType,objectId
	 * @return NRObject (XML object)
	 *******************************************************************/		
	@GET
	@Path("/get/{objectType}/{objectId}")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response getObject(@Context ContainerRequestContext containerRequest, @PathParam("objectType") String objectType, @PathParam("objectId") String objectId)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		NRJsonObject objectToReturn = null;
		
		if(objectId != null)
		{
			try
			{
				session = sessionManager.getSession(loginInfo.getDocbase());
				objectToReturn = NRObjectUtils.getObjectById(session, objectId);
			}
			catch(Exception e)
			{
				NRUtils.handleErrors(e);
				statusCode = Response.Status.BAD_REQUEST.getStatusCode();
			}
			finally
			{
				sessionManager.release(session);
				NRUtils.clearSensitiveData(loginInfo);
			}
		}
		
		return Response.status(statusCode).entity(objectToReturn).build();
	}	
	
	/******************************************************************
	 * This method updates an object, it's expected that a XML has passed
	 * The XML object must contains the property "r_object_id" in order 
	 * to be updated.
	 * @param headers
	 * @param object - XML object
	 * @return
	 * 
	 *  Example of Properties submit Json:
 
	  {
		"properties": {
			"validationClass": "com.ness.validation.NRServiceUpdateValidation",
			"r_object_type": "gov_document",
			"r_object_id": "090200f18000c510",
			"object_name": "abc",
			"i_folder_id": ["0b0200f18000c41f"],
			"sender_name": "abc@ness.com",
			"doc_type": "",
			"status": "",
			"classification": "2",
			"sensitivity": "1",
			"doc_date": "13/05/2015"
		}
	  }	
	 * 
	 ******************************************************************/
	
	@POST
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateObject(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());

			String superType = NRObjectUtils.getSuperType(session, (String)object.getProperties().get(NRConstants.R_OBJECT_TYPE));
			if(NRConstants.GOV_DOCUMENT.equalsIgnoreCase((String)object.getProperties().get(NRConstants.R_OBJECT_TYPE)) || NRConstants.GOV_DOCUMENT.equalsIgnoreCase(superType))
			{
				NRRoleUtils.checkExistingObjectSenderNameChanged(session, object);
			}
			NROutlookFieldsUtils.save(session, object);
			NRObjectUtils.updateObject(session, object, false);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).build();
	}
	
	/******************************************************************
	 * This method will insert an object, it's expected that a XML has 
	 * passed
	 * @param headers
	 * @param object - XML object
	 * @return
	 * 
	 * 
	 * 
	{"properties": {
		"r_object_type": "gov_document",
		"object_name": "abc",
		"i_folder_id": ["0c0200f18000c41f"],
		"sender_name": "shlomi.sinai@ness.com",
		"doc_type": "",
		"status": "",
		"classification": "2",
		"sensitivity": "1",
		"doc_date": "13/05/2015"
		}
	}
	 * 
	 ******************************************************************/	
	@POST
	@Path("/insert")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response insertObject(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		String objectId = null;
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NROutlookFieldsUtils.save(session, object);
			objectId = NRObjectUtils.updateObject(session, object, true);
			statusCode = Response.Status.CREATED.getStatusCode();
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			objectId = e.getMessage();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(objectId).build();
	}
	
	/******************************************************************
	 * This method will import an object, it's expected that a XML has 
	 * passed
	 * 
	 * 
	 * @param headers
	 * @param object - XML object
	 * @return
	 * 
	 * 
	 * 
	{"properties": {
		"r_object_type": "gov_document",
		"object_name": "abc",
		"i_folder_id": ["0c0200f18000c41f"],
		"sender_name": "shlomi.sinai@ness.com",
		"doc_type": "",
		"status": "",
		"classification": "2",
		"sensitivity": "1",
		"doc_date": "13/05/2015"
		}
	}
	 * 
	 ******************************************************************/	
	@POST
	@Path("/createObject")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createObject(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		String objectId = null;
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRRoleUtils.checkNewObjectSenderNameChanged(session, object);
			
			List<String> iFolderIds = (List<String>) object.getProperties().get(NRConstants.I_FOLDER_ID);
			
			object.getProperties().put(NRConstants.I_FOLDER_ID, iFolderIds.get(0));
			
			if(NRConstants.SENDER_NAME_VALIDATION_TYPE_EXCEPTIONS.containsKey(object.getProperties().get(NRConstants.R_OBJECT_TYPE)))
			{
				object.getProperties().remove(NRConstants.SENDER_NAME);
			}

			NROutlookFieldsUtils.save(session, object);
			objectId = NRObjectUtils.updateObject(session, object, true);

			object.getProperties().put(NRConstants.R_OBJECT_ID, objectId);
			object.getProperties().put(NRConstants.I_FOLDER_ID, iFolderIds);
			
			
			if(object.getProperties().get(NRConstants.R_OBJECT_TYPE).equals(NRConstants.GOV_DOCUMENT) || NRObjectUtils.getSuperType(session, (String)object.getProperties().get(NRConstants.R_OBJECT_TYPE)).equals(NRConstants.GOV_DOCUMENT))
			{
				 object.getProperties().put(NRConstants.SENDER_ID, object.getProperties().get(NRConstants.SENDER_NAME));  
			}
			
			NRObjectUtils.updateObject(session, object, false);
			statusCode = Response.Status.CREATED.getStatusCode();
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
			objectId = e.getMessage();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(objectId).build();
	}

	/******************************************************************
	 * This method returns a list of all folder and document objects under a given folder in the tree
	 * URL usage:  
	 * @param objectId
	 * @param orderBy
	 * @return 
	 *******************************************************************/	
	
	@GET
	@Path("/folderObjects/{objectId}/{orderBy}/{page}")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response getFolderObjects(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId, @PathParam("orderBy") String orderBy, @PathParam("page") int page)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		
		//the service is called from last docs folder
		if(NRConstants.SPECIAL_FOLDERS_IDS.containsKey(objectId))
		{
			int statusCode = Response.Status.OK.getStatusCode();	
			List<NRJsonObject> objectToReturn = new ArrayList<NRJsonObject>();
			IDfSession session = null;
			IDfSessionManager sessionManager = null;
			try
			{
				HttpSession httpSession = httpRequest.getSession(true);
				sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
				session = sessionManager.getSession(loginInfo.getDocbase());
				NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
				
				Method method = userInfoMethods.getClass().getMethod(NRConstants.SPECIAL_FOLDERS_IDS.get(objectId), IDfSession.class);
				objectToReturn = (List<NRJsonObject>) method.invoke(userInfoMethods, session);
			}
			catch(Exception e)
			{
				NRUtils.handleErrors(e);
				statusCode = Response.Status.BAD_REQUEST.getStatusCode();
			}
			finally
			{
				sessionManager.release(session);
				NRUtils.clearSensitiveData(loginInfo);
			}

			return Response.status(statusCode).entity(objectToReturn).build();			
		}
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		List<NRJsonObject> allObjects = new ArrayList<NRJsonObject>();
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager()
				.getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		try
		{
			session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
			NRObjectMethods objectMethods = new NRObjectMethods();
			allObjects = objectMethods.getAllObjectsInObject(session, objectId, orderBy, page);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(allObjects).build();		
	}

	/******************************************************************
	 * This method returns a list of all folder objects under a given folder in the tree
	 * URL usage:  
	 * @param objectId
	 * @param orderBy
	 * @return 
	 *******************************************************************/	

	@GET
	@Path("/folderOnlyObjects/{objectId}/{orderBy}/{page}")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response getFolderOnlyObjects(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId, @PathParam("orderBy") String orderBy, @PathParam("page") int page)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager()
				.getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		List<NRJsonObject> folderObjects = new ArrayList<NRJsonObject>();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRObjectMethods objectMethods = new NRObjectMethods();
			folderObjects = objectMethods.getFoldersInObject(session, objectId, orderBy, page);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(folderObjects).build();		
	}
	
	/******************************************************************
	 * This method receives a JSON that contains list of folder IDs in the following formats. It returns the corresponding folder paths as XML
	 * Example for one folder id input JSON:
	  {
        	"properties":{
                "folderIds":"0b01b20780028739"
      		}
      }
      *
      * Example for 2 folder ids input JSON: 
      {
        	"properties":{
                "folderIds":["0b01b20780028739","0b01b20780028956"]
      		}
      }

	 * 
	 * URL usage:  
	 * @param headers
	 * @param folderlist
	 * @return results
	 *******************************************************************/	
	@POST
	@Path("/getFoldersLocation")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response getFoldersLocation(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		List<NRJsonObject> results = null;
		int statusCode = Response.Status.OK.getStatusCode();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRObjectMethods objectMethods = new NRObjectMethods();	
			results = objectMethods.getFoldersPath(session, object);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(results).build();
	}
	
	@GET
	@Path("/getFoldersAncestor/{objectId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response getFoldersAncestor(@Context ContainerRequestContext containerRequest,@PathParam("objectId") String objectId)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<NRJsonObject> results = null;

		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRObjectMethods objectMethods = new NRObjectMethods();	
			results = objectMethods.getObjectsDetails(session, objectId);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(results).build();
	}
	
	@GET
	@Path("/getDocumentVersions/{objectId}")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response getDocumentVersions(@Context ContainerRequestContext containerRequest,  @PathParam("objectId") String objectId)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		List<NRJsonObject> results = null;
		int statusCode = Response.Status.OK.getStatusCode();
		
		if(objectId != null)
		{
			try
			{
				session = sessionManager.getSession(loginInfo.getDocbase());
				results = NRObjectUtils.getDocumentVersions(session, objectId);
			}
			catch(Exception e)
			{
				NRUtils.handleErrors(e);
				statusCode = Response.Status.BAD_REQUEST.getStatusCode();
			}
			finally
			{
				sessionManager.release(session);
				NRUtils.clearSensitiveData(loginInfo);
			}
		}
		
		return Response.status(statusCode).entity(results).build();
	}
	
	@GET
	@Path("/hasItemsInFolder/{objectId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response hasItemsInFolder(@Context ContainerRequestContext containerRequest,@PathParam("objectId") String objectId)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		boolean results = false;
		int statusCode = Response.Status.OK.getStatusCode();
		IDfCollection col = null;
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			IDfQuery query = new DfQuery();
		
			query.setDQL(NRConstants.QUERY_HAS_ITEMS_IN_FOLDER.replace(NRConstants.PARAM_1, objectId));
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
	
			while (col.next())
			{	
				String hasItem = col.getString("hasitem");
				if(Integer.parseInt(hasItem) > 0)
				{
					results = true;
				}
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}	
		
		return Response.status(statusCode).entity(results).build();
	}
	@POST
	@Path("/getObjectIdByTypeAndGovId/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getObjectIdByTypeAndGovId(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		String objectId = "";
		String objectType = (String) object.getProperties().get("objectType");
		String govId = (String) object.getProperties().get("govId");
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			IDfQuery query = new DfQuery();
			IDfCollection col;
		
			query.setDQL(NRConstants.QUERY_R_OBJECT_ID_BY_TYPE_AND_GOV_ID.replace(NRConstants.PARAM_1, objectType).replace(NRConstants.PARAM_2, govId));
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
	
			while (col.next())
			{	
				objectId = col.getString("r_object_id");
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(objectId).build();
	}
	
	@POST
	@Path("/linkObjects/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response linkObjects(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<String> objectIds = (List<String>) object.getProperties().get("objectIds");
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			statusCode = new NRObjectMethods().linkItems(session, objectIds);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).build();
	}
	
	@GET
	@Path("/showLinks/{objectId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response showLinks(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<NRJsonObject> objectToReturn = new ArrayList<NRJsonObject>();

		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRObjectMethods objectmethods = new NRObjectMethods();
			objectToReturn = objectmethods.getLinkedObjects(session, objectId);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}

		return Response.status(statusCode).entity(objectToReturn).build();
	}
	
	@GET
	@Path("/showVersions/{objectId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response showVersions(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<NRJsonObject> objectToReturn = new ArrayList<NRJsonObject>();

		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRObjectMethods objectmethods = new NRObjectMethods();
			objectToReturn = objectmethods.getVersions(session, objectId);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}

		return Response.status(statusCode).entity(objectToReturn).build();
	}
	
	@POST
	@Path("/isLinkOrSource/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response showVersions(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		String objectId = (String) object.getProperties().get("objectId");
		String currentFolderPath = (String) object.getProperties().get(NRConstants.CURRENT_FOLDER_PATH);
		NRJsonObject objectToReturn = null;
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRObjectMethods objectmethods = new NRObjectMethods();
			objectToReturn = objectmethods.isLinkOrSource(session, objectId, currentFolderPath);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}

		return Response.status(statusCode).entity(objectToReturn).build();
	}
	
	@GET
	@Path("/getAvailableColumns/{unitLayerName}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getColumnAvilable(@Context ContainerRequestContext containerRequest,@PathParam("unitLayerName") String unitLayerName) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		List<NRJsonObject> columnsAvilableInfo = new ArrayList<NRJsonObject>();
		int statusCode = Response.Status.OK.getStatusCode();
		
		try 
		{		
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRObjectMethods objectMethods = new NRObjectMethods();
			columnsAvilableInfo = objectMethods.getAvailableColumnsInfo(session, unitLayerName);
			statusCode = Response.Status.OK.getStatusCode();
			
		} catch (DfException e) {
			e.printStackTrace();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(columnsAvilableInfo).build();
		
	}
	
	@POST
	@Path("/deleteLinks/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteLinks(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<String> objectIds = (List<String>) object.getProperties().get("objectIds");;
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			statusCode = new NRObjectMethods().deleteLinks(session, objectIds);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).build();
	}
	
	@POST
	@Path("/exporttocsv/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response exportToCSV(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		NRFileObject fileObject = null;
		ResponseBuilder rb = null;
		
		ArrayList <String> columnDataIndexes = (ArrayList<String>) object.getProperties().get("columnDataIndexes"); 
		ArrayList <String> columnNames = (ArrayList<String>) object.getProperties().get("columnNames");
		ArrayList <String> objectIds = (ArrayList<String>) object.getProperties().get("objectIds");
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		File tempFile = null;
		
		try
		{
			tempFile = File.createTempFile("mytempcsv_" + System.currentTimeMillis() + ".csv", "");
			FileOutputStream fileOutputStream = new FileOutputStream(tempFile);
			OutputStreamWriter writer = new OutputStreamWriter(fileOutputStream, "UnicodeLittle");
			new NRObjectMethods().writeToCSVTempFile(session, columnDataIndexes, columnNames, objectIds, writer);
			fileObject = new NRFileObject();
			fileObject.setName("csv");
			fileObject.setExtension("csv");
			fileObject.setType(MediaType.APPLICATION_OCTET_STREAM);
			fileObject.setInputStream(new ByteArrayInputStream(FileUtils.readFileToByteArray(tempFile)));
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
			
			if (tempFile != null)
			{
				tempFile.deleteOnExit();
			}
			
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
			
			if (tempFile != null)
			{
				tempFile.deleteOnExit();
			}
			
			return rb.build();
		}
		else
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
			
			if (tempFile != null)
			{
				tempFile.deleteOnExit();
			}
			
			return Response.status(statusCode).build();
		}
	}
	
	@POST
	@Path("/moveobjects/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response moveObjects(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		ArrayList <String> objectIds = (ArrayList<String>) object.getProperties().get("objectIds");
		ArrayList <String> addedFromIds = (ArrayList<String>) object.getProperties().get("addedFromIds");
		String moveToId = (String) object.getProperties().get("moveToId");
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		ArrayList<NRJsonObject> checkedErrors = null;
		
		try
		{
			checkedErrors = new NRObjectMethods().moveObjects(session, objectIds, addedFromIds, moveToId);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		NRUtils.clearSensitiveData(loginInfo);
		return Response.status(statusCode).entity(checkedErrors).build();
	}
	
	@POST
	@Path("/copyobjects/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response copyObjects(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		ArrayList <String> objectIds = (ArrayList<String>) object.getProperties().get("objectIds");
		String copyToId = (String) object.getProperties().get("copyToId");
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		ArrayList<NRJsonObject> checkedErrors = null;
		
		try
		{
			
			checkedErrors = new NRObjectMethods().copyObjects(session, objectIds, copyToId);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		NRUtils.clearSensitiveData(loginInfo);
		return Response.status(statusCode).entity(checkedErrors).build();
	}
	
	@POST
	@Path("/extralinkobjects/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response extraLinkObjects(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		ArrayList <String> objectIds = (ArrayList<String>) object.getProperties().get("objectIds");
		String linkToId = (String) object.getProperties().get("linkToId");
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		ArrayList<NRJsonObject> checkedErrors = null;
		
		try
		{
			checkedErrors = new NRObjectMethods().extraLinkObjects(session, objectIds, linkToId);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		NRUtils.clearSensitiveData(loginInfo);
		return Response.status(statusCode).entity(checkedErrors).build();
	}
	
	@POST
	@Path("/shareandlinkobjects/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response shareAndLinkObjects(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		ArrayList <String> objectIds = (ArrayList<String>) object.getProperties().get("objectIds");
		String shareAndLinkToId = (String) object.getProperties().get("shareAndLinkToId");
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		ArrayList<NRJsonObject> checkedErrors = null;
		
		try
		{
			checkedErrors = new NRObjectMethods().shareAndLinkObjects(session, objectIds, shareAndLinkToId);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		NRUtils.clearSensitiveData(loginInfo);
		return Response.status(statusCode).entity(checkedErrors).build();
	}
	
	@GET
	@Path("/getExcludedColumns")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getExcludedColumns(@Context ContainerRequestContext containerRequest) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		List<NRJsonObject> excludedColumnsList = new ArrayList<NRJsonObject>();
		int statusCode = Response.Status.OK.getStatusCode();
		
		try 
		{		
			session = sessionManager.getSession(loginInfo.getDocbase());
			
			HashSet<String> properties = NRExcludedColumns.getInstance().getProperties();
			for (String column : properties) 
			{
				NRJsonObject jsonObject = new NRJsonObject();
				jsonObject.getProperties().put("exColumn", column);
				excludedColumnsList.add(jsonObject);
			}
			
			statusCode = Response.Status.OK.getStatusCode();
			
		} catch (DfException e) {
			e.printStackTrace();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(excludedColumnsList).build();
		
	}
	
	@POST
	@Path("/attributesbyobjecttype/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAttributesByObjectType(@Context ContainerRequestContext containerRequest, NRJsonObject object) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
		
		String objectType = (String) object.getProperties().get("objectType");
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		ArrayList <NRJsonObject> attributeList = null;
		
		try
		{
			attributeList = new NRObjectMethods().attributesByObjectType(session, objectType);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		NRUtils.clearSensitiveData(loginInfo);
		return Response.status(statusCode).entity(attributeList).build();
	}
}