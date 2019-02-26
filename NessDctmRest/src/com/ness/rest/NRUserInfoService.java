package com.ness.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

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

import org.glassfish.jersey.media.multipart.FormDataMultiPart;

import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.documentum.fc.common.DfException;
import com.ness.communication.NRSessionManager;
import com.ness.objects.NRJsonObject;
import com.ness.objects.NRLoginInfo;
import com.ness.rest.userinfomethods.NRUserInfoMethods;
import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;

/******************************************************************
 * This class handles User Info
 *******************************************************************/	
@Path("/uis")
public class NRUserInfoService 
{
	@Context
	private HttpServletRequest httpRequest;
	
	@GET
	@Path("/homeFolder")
	@Produces(MediaType.APPLICATION_JSON)
	public Response homeFolder(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserHomeFolder(session);
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
	
	/******************************************************************
	 * This method returns the checkout documents of the current user
	 * @param headers
	 * @param 
	 * @return
	 ******************************************************************/
	@GET
	@Path("/checkoutDocs")
	@Produces(MediaType.APPLICATION_JSON)
	public Response checkoutDocs(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserCheckedoutObjects(session);
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
	
	/******************************************************************
	 * This method returns the last documents the user used
	 * @param headers
	 * @param 
	 * @return
	 ******************************************************************/
	@GET
	@Path("/lastDocs")
	@Produces(MediaType.APPLICATION_JSON)
	public Response lastDocs(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserLastObjects(session);
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
	
	/******************************************************************
	 * This method retrieves the user favorites list
	 * @param headers
	 * @param 
	 * @return
	 ******************************************************************/
	@GET
	@Path("/favorites")
	@Produces(MediaType.APPLICATION_JSON)
	public Response favorites(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserFavorites(session);
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
	@Path("/favoritedocs")
	@Produces(MediaType.APPLICATION_JSON)
	public Response favoritedocs(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserFavoriteDocs(session);
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

	/******************************************************************
	 * This method adds a new object to the favorites list
	 * @param headers
	 * @param objectId - r_object_id
	 * @return
	 ******************************************************************/
	@POST
	@Path("/addFavorite/{objectId}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addFavorite(@Context ContainerRequestContext containerRequest, @PathParam("objectId") String objectId)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		 
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();

			//If the given object doesn't exists
			if(!userInfoMethods.isFavoriteObjectExist(session, objectId))
			{
				userInfoMethods.addFavoriteObject(session, objectId);
				statusCode = Response.Status.OK.getStatusCode();
			}
			//The object already in the user favorite list, return 201 status
			else
			{
				statusCode = Response.Status.CREATED.getStatusCode();
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

		return Response.status(statusCode).build();
	}
	
	/*********************************************
	* This method will update the user favorites 
	* according to the JSON it will receive.
	* The JSON structure is as follow:
	* {
	*	"properties":{
	*		"updateObjects": [
	*				{
	*					"r_object_id":"0b01b20780028738",
	*					"order_no": 23
	*				},
	*				{
	*					"r_object_id":"0b01b20780028954",
	*					"order_no": 44
	*				}
	*		],
	*		"deleteObjects": ["0b01b20780028739","0b01b20780028956"]
	*	}
	* }
	* 
	* updateObjects - Contains an array of objects that needs 
	* 				 to be update with their new order_no.
	* deleteObjects - Contains an array of r_object_ids that
	* 				  needs to be deleted.
	**********************************************/	
	@POST
	@Path("/updateFavorites")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateOrderFavorite(@Context ContainerRequestContext containerRequest,NRJsonObject updateData)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			userInfoMethods.updateUserFavorites(session, updateData);
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
	
	/******************************************************************
	 * This method retrieves the user favorites list
	 * @param headers
	 * @param 
	 * @return
	 ******************************************************************/
	@GET
	@Path("/author")
	@Produces(MediaType.APPLICATION_JSON)
	public Response authorName(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getAuthorName(session);
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
	@Path("/userName")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userName(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserName(session);
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
	
	/**
	 * Returns email of loged in user
	 * @param containerRequest
	 * @return
	 */
	@GET
	@Path("/userEmail")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userEmail(@Context ContainerRequestContext containerRequest)
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
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserAddress(session);
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
	/**
	 * 	get folder object types the user can create
	 *  
	 *  */
	@POST
	@Path("/createobjecttypes")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createObjecTypes(@Context ContainerRequestContext containerRequest,  FormDataMultiPart form)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();
		NRJsonObject objectToReturn = null;
		String folderId = form.getField("folderLocation").getValue();
		String objectType = form.getField("objectType").getValue();
		
		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			objectToReturn = userInfoMethods.getUserCreateFolderTypes(session, folderId, objectType, true);
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
	@Path("/getColumnSelected/{getDataType}/{unitLayerName}")
	public Response getColumnSelected(@Context ContainerRequestContext containerRequest,  @PathParam("getDataType") String getDataType, @PathParam("unitLayerName") String unitLayerName)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		IDfSession session = null;
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		List<NRJsonObject> objectToReturn = null;
		
		int statusCode = Response.Status.OK.getStatusCode();
		
		try 
		{		
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRUserInfoMethods ntUserInfoMethod = new NRUserInfoMethods();
			
			Boolean isGetDataType = Boolean.valueOf(getDataType);
			
			try {
				objectToReturn = ntUserInfoMethod.getListUserColumnsSelected(session, isGetDataType, unitLayerName);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		catch (DfException e) {
			e.printStackTrace();
		}
		finally
		{
			sessionManager.release(session);
			NRUtils.clearSensitiveData(loginInfo);
		}
		return Response.status(statusCode).entity(objectToReturn).build();
		
		
	}
	
	@GET
	@Path("/checkoutPath")
	public Response checkoutPath(@Context ContainerRequestContext containerRequest)
	{
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		
		int statusCode = Response.Status.OK.getStatusCode();
		String checkoutPath = null;

		try
		{
			Properties properties = new Properties();
			properties.load(getClass().getClassLoader().getResourceAsStream(NRConstants.ENVIRONMENT_PROPERTIES));
			checkoutPath = properties.getProperty("checkout_path");
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}
		finally
		{
			NRUtils.clearSensitiveData(loginInfo);
		}
		
		return Response.status(statusCode).entity(checkoutPath).build();
	}
	
	@POST
	@Path("/saveColumnsSelectedToUser")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response saveColumnsSelectedToUser(@Context ContainerRequestContext containerRequest, NRJsonObject object)
	{
		IDfSession session = null;
		NRLoginInfo loginInfo = NRUtils.getRequestLoginInfo(containerRequest);
		HttpSession httpSession = httpRequest.getSession(true);
		IDfSessionManager sessionManager = new NRSessionManager().getIDfSessionManagerFromHttpSession(containerRequest, httpSession);
		
		int statusCode = Response.Status.OK.getStatusCode();

		try
		{
			session = sessionManager.getSession(loginInfo.getDocbase());
			NRUserInfoMethods userInfoMethods = new NRUserInfoMethods();
			userInfoMethods.saveColumns(session, object);
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
	
}