package com.ness.rest;

import java.lang.reflect.Constructor;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;

@Path("/vs")
public class NRValidationService
{
	@POST
	@Path("/validate")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response validate(NRJsonObject object)
	{
		int status = Response.Status.OK.getStatusCode();
		NRJsonObject validationObject = null;
		
		try
		{
			Class<?> c = Class.forName((String) object.getProperties().get(NRConstants.VALIDATION_CLASS));
			Constructor<?> cons = c.getConstructor();
			INRValidation validator = (INRValidation) cons.newInstance();
			validationObject = validator.validate(object);
			
			if(validationObject != null)
			{
				status = Response.Status.CREATED.getStatusCode();
			}
			else
			{
				//To avoid empty response body
				validationObject = new NRJsonObject();
			}
		}
		catch(Exception e)
		{
			status = Response.Status.BAD_REQUEST.getStatusCode();
		}
		
		return Response.status(status).entity(validationObject).build();
	}
}
