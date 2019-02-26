package com.ness.rest;

import java.util.ArrayList;
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

import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.ness.communication.NRSessionManager;
import com.ness.objects.NRJsonObject;
import com.ness.objects.NRLoginInfo;
import com.ness.rest.templatemethods.NRTemplateMethods;
import com.ness.utils.NRRoleUtils;
import com.ness.utils.NRUtils;

@Path("ts")
public class NRTemplateService
{
	/*********************************************
	* NRTemplateService API:
	* 
	* Functionality:
	* --------------
	* The service will handle template creation.
	* 1) Template creation
	* 2) List available templates for unit 
	*
	**********************************************/
	
	/*********************************************
	* Template creation - /create
	* This method will create a new object with a
	* template source
	* --------------------------------------------
	*
	* Input - JSON object that represents and object.
	* 		  Any property can be saved, the following properties are mandatory:
	*
	* {
	* 	"properties": {
	*		"i_folder_id": "Destination folder id",
	*		"object_name": "Object name",
	*       "sender_id": "Object sender id",
	*       "template_id" : "Source template r_object_id",
	*       "template_name": "Source template name"
	*	}
	* }
	*
	* Output - Status code 201 - Template created successfully
	*		   Status code 40X - Template creation failed
	* 
	**********************************************/
	
	@Context
	private HttpServletRequest httpRequest;
	
	@POST
	@Path("/create")
	@Consumes(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response createTemplate(@Context ContainerRequestContext containerRequest, NRJsonObject templateProperties)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.CREATED.getStatusCode();
		String objectId = null;
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRRoleUtils.checkNewObjectSenderNameChanged(session, templateProperties);
			NRTemplateMethods templateMethods = new NRTemplateMethods();
			objectId = templateMethods.createTemplate(session, templateProperties);
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
		
		//return Response.status(statusCode).build();
		
		return Response.status(statusCode).entity(objectId).build();
	}
	
	/*********************************************
	* List available templates - /templates/{unit_id}
	* This method will provide a list of available templates
	* for a given unit
	* --------------------------------------------
	*
	* Input - Unit id (URL parameter)
	*
	* Output - JSON object that represents a list of templates.
	* 
	* [
	* 	{
	* 		"properties": {
	* 			"code" : "Template r_object_id",
	* 			"value": "Template object_name
	* 		}
	* 	},
	* 	{
	* 		"properties": {
	* 			"code" : "Template r_object_id",
	* 			"value": "Template object_name
	* 		}
	* 	}, 
	* ]
	* 
	**********************************************/	
	@GET
	@Path("/templates/{objectId}/{objectType}")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response getTemplates(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId, @PathParam("objectType") String objectType)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRTemplateMethods templateMethods = new NRTemplateMethods();
			results = templateMethods.getTemplates(session, objectId, objectType);
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
}