package com.ness.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.common.DfId;
import com.ness.communication.NRSessionManager;
import com.ness.objects.NRJsonObject;
import com.ness.objects.NRLoginInfo;
import com.ness.rest.userinfomethods.NRUserInfoMethods;
import com.ness.rest.vamethods.NRValueAssitanceMethods;
import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;

/**
 * @author NRCodeTableService API:
 * 
 *         Functionality: -------------- The service returns the Value
 *         Assistance or Code Table values for a given attribute (It knows to
 *         resolve automatically weather the attribute has VA or CT). It
 *         supports stand alone attributes or attributes that their values
 *         depend on selected values for other attributes. It also supports
 *         retrieving all or part of the VA\CT list
 * 
 *         Example Input and Output (for retrieving ALL the CT\VA values):
 *         ---------------------------------------------------------------
 * 
 *         Input - "codeTableProperties" expects the following JSON object:
 * 
 *         { "properties": { "objectType": "gov_document", "attrName":
 *         "sensitivity", "values" : null, "dependencyNames" : null,
 *         "dependencyValues" : null } }
 * 
 *         Output - "Result" contains the following JSON structure (according to
 *         input example above):
 * 
 *         [ { "properties": { "value": "1", "code": "�� ����" } }, {
 *         "properties": { "value": "2", "code": "����" } } ]
 * 
 *         Input JSON attributes details: -------------------------------
 *         "objectType": the type that holds the required attribute
 * 
 *         "attrName": the name of the attribute that we want to retrieve all or
 *         part of its VA or Code Table List
 * 
 *         "values": a string in the format: @"values": "1,2,3"@ that holds a
 *         list of SPECIFIC values that we want to convert. If set to null, then
 *         ALL of the VA\CT values will be returned: @"values": null@
 * 
 *         "dependencyNames": list of other attribute names, that "attrName"
 *         depends on, when resolving it's dynamic VA\CT values
 * 
 *         "dependencyValues": The value list for "dependencyNames" list
 * 
 *         General JSON structure example to be used, when we have several
 *         attributes dependency in the list: @ "dependecies_names":
 *         ["unit_id","sender_name"], "dependecies_values": ["0200","avi"] @
 * 
 *         Another Input\Output example, with dependency attributes:
 *         --------------------------------------------------------- Input JSON:
 * 
 *         { "properties": { "objectType": "gov_document", "attrName": "status",
 *         "values" : null, "dependencyNames" : ["unit_id"], "dependencyValues"
 *         : ["0002"] } }
 * 
 *         response JSON:
 * 
 *         [ { "properties": { "value": "000202", "label": "������" } }, {
 *         "properties": { "value": "000201", "label": "���" } }, {
 *         "properties": { "value": "000203", "label": "����" } } ]
 *
 * 
 */

@Path("/va")
public class NRValueAssitanceService
{
	@Context
	private HttpServletRequest httpRequest;

	@POST
	@Path("/dropdown")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDropDown(@Context ContainerRequestContext containerRequest, final NRJsonObject codeTableProperties)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		List<NRJsonObject> results = null;
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());

			NRValueAssitanceMethods vaMethods = new NRValueAssitanceMethods();
			
			try
			{
				results = vaMethods.resolveValueAssitance(session, codeTableProperties);
			}
			catch (Exception e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			statusCode = Response.Status.OK.getStatusCode();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}

		return Response.status(statusCode).entity(results).build();
	}

	/**
	 * This service is not in use. It exists as example of asynchronous service
	 * method jersey paradigm.
	 * 
	 * @param containerRequest
	 * @param codeTableProperties
	 * @param asyncResponse
	 */
	@POST
	@Path("/dropdownAsync")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void getDropDown(@Context final ContainerRequestContext containerRequest, final NRJsonObject codeTableProperties, @Suspended final AsyncResponse asyncResponse)
	{
		new Thread(new Runnable()
		{
			@Override
			public void run()
			{
				NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
				IDfSession session = null;
				HttpSession httpSession = httpRequest.getSession(true);
				IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
				
				int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
				List<NRJsonObject> results = null;
				try
				{
					session = sessionManager.getSession(loginInfo.getDocbase());
					NRValueAssitanceMethods vaMethods = new NRValueAssitanceMethods();
					
					try
					{
						results = vaMethods.resolveValueAssitance(session, codeTableProperties);
					}
					catch (Exception e)
					{
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

					statusCode = Response.Status.OK.getStatusCode();
				}
				catch (Exception e)
				{
					NRUtils.handleErrors(e);
				}
				finally
				{
					sessionManager.release(session);
					NRUtils.clearSensitiveData(loginInfo);
				}

				asyncResponse.resume(Response.status(statusCode).entity(results).build());
			}

		}).start();
	}
	

	@POST
	@Path("/allva")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllVa(@Context ContainerRequestContext containerRequest)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		HashMap <String, HashMap <String, HashMap<String, String>>> results = null;
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRValueAssitanceMethods vaMethods = new NRValueAssitanceMethods();
			results = vaMethods.getAllVa(session);
			statusCode = Response.Status.OK.getStatusCode();
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(results).build();
	}
	
	@POST
	@Path("/getObjectTypes")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getObjectTypes(@Context ContainerRequestContext containerRequest,
			final NRJsonObject codeTableProperties) throws Exception
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		int statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		try
		{
			session = sessionManager.getSession(NRUtils.getRequestLoginInfo(containerRequest).getDocbase());
			try
			{
				String folderId = (String) (codeTableProperties.getProperties().get("folderId") + "");
					
				if(!folderId.contains("-"))
				{
					IDfSysObject folderObject = (IDfSysObject) session.getObject(new DfId(folderId));
					if(!NRConstants.DM_CABINET.equals(folderObject.getTypeName()))
					{
						NRUserInfoMethods nrUserInfoMethods =  new NRUserInfoMethods();
						NRJsonObject userCreateFolderTypes = nrUserInfoMethods.getUserCreateFolderTypes(session,  folderId,  "document", false);
						for (Entry<String,Object>  entry : userCreateFolderTypes.getProperties().entrySet())
						{
							NRJsonObject listObject = new NRJsonObject();
							listObject.getProperties().put(NRConstants.VALUE, session.getType(entry.getKey()).getDescription());
							listObject.getProperties().put(NRConstants.CODE, entry.getValue());
							results.add(listObject);
						}
					}
				}
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
		catch(Exception e)
		{
			
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		statusCode = Response.Status.OK.getStatusCode();
		
		return Response.status(statusCode).entity(results).build();
	}
}