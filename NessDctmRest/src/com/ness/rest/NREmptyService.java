package com.ness.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * @author yurin
 * Used to renew session in case of kerberos authentication.
 * Needed in case of applet sends request. 
 */
@Path("/es")
public class NREmptyService
{

	@GET
	@Path("/doNothing")
	public Response doNothing()
	{
		//return Response.ok().build();
		return Response.status(Response.Status.OK).build();
	}

}
