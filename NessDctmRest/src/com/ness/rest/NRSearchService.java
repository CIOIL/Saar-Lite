package com.ness.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
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
import com.ness.rest.searchmethods.NRSearchMethods;
import com.ness.utils.NRUtils;

@Path("ss")
public class NRSearchService
{
	@Context
	private HttpServletRequest httpRequest;
	
	
	/*****************************************************************
	* JSON example
	* 
	* {
	*	"properties":{
	*		"object_type": "gov_document",
	*		"search_value": "����� ����"
	*	}
	* }
	* 
	* 
	/******************************************************************/
	@POST
	@Path("/search")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	@Consumes(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response xploreSearch(@Context ContainerRequestContext containerRequest, NRJsonObject searchProperties)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<NRJsonObject> searchResult = new ArrayList<NRJsonObject>();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRSearchMethods searchMethods = new NRSearchMethods();
			searchResult = searchMethods.xploreSearch(session, searchProperties);
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
		
		return Response.status(statusCode).entity(searchResult).build();
	}

	/*****************************************************************
	* JSON example
	* 
	* {
	*	"properties":{
	*		"object_name": "�����",
	*		"sender_name": "����� ����",
	*		"doc_type": "20004",
	*		"status": "999901",
	*		"from_date": "04/08/2015",
	*		"to_date": "05/08/2015"
	*	}
	* }
	* 
	* 
	/******************************************************************/
	@POST
	@Path("/advsearch")
	@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	@Consumes(MediaType.APPLICATION_JSON + ";charset=UTF-8")
	public Response advSearch(@Context ContainerRequestContext containerRequest, NRJsonObject searchProperties)
	{
		
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		List<NRJsonObject> searchResult = new ArrayList<NRJsonObject>();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRSearchMethods searchMethods = new NRSearchMethods();
			searchResult = searchMethods.advSearch(session, searchProperties);
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
		
		return Response.status(statusCode).entity(searchResult).build();
	}
}