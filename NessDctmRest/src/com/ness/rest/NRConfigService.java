package com.ness.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.documentum.fc.client.DfClient;
import com.documentum.fc.client.IDfClient;
import com.documentum.fc.client.IDfDocbaseMap;
import com.documentum.fc.client.IDfTypedObject;
import com.ness.communication.NRSessionManager;
import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;

@Path("/cs")
public class NRConfigService
{
	@GET
	@Path("/docbases")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDocbases()
	{
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		
		try
		{
			IDfClient client = DfClient.getLocalClient();
			IDfDocbaseMap docbaseMap = client.getDocbaseMap();
			
			for(int index = 0 ; index < docbaseMap.getDocbaseCount() ; index++)
			{
				NRJsonObject docbaseObject = new NRJsonObject();
				docbaseObject.getProperties().put(NRConstants.CODE, docbaseMap.getDocbaseName(index));
				docbaseObject.getProperties().put(NRConstants.VALUE, docbaseMap.getDocbaseName(index));
				
				results.add(docbaseObject);
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		return Response.ok(results, MediaType.APPLICATION_JSON).build();
	}
	
	@GET
	@Path("/config/{repositoryId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getConfig(@PathParam("repositoryId") String repositoryId)
	{
		int statusCode = Response.Status.OK.getStatusCode();
		NRJsonObject objectToReturn = new NRJsonObject();
		IDfTypedObject docbrokerMap = null;
		try
		{
			IDfClient client = DfClient.getLocalClient();
			String docbaseName = client.getDocbaseNameFromDocbaseId(Long.parseLong(repositoryId));
			docbrokerMap = client.getDocbrokerMap();
			String hostName = docbrokerMap.getString("host_name");
			String portNumber = docbrokerMap.getString("port_number");
			objectToReturn.getProperties().put("docbaseName", docbaseName);
			objectToReturn.getProperties().put("hostName", hostName);
			objectToReturn.getProperties().put("portNumber", portNumber);
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			statusCode = Response.Status.BAD_REQUEST.getStatusCode();
		}	
	
	return Response.status(statusCode).entity(objectToReturn).build();
	}
}
