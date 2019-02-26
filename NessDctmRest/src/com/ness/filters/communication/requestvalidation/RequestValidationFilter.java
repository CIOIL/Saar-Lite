package com.ness.filters.communication.requestvalidation;

import java.io.IOException;
import java.lang.reflect.Constructor;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;

@Provider
public class RequestValidationFilter implements ContainerRequestFilter
{
	@Override
	public void filter(ContainerRequestContext containerRequest) throws IOException
	{
		NRJsonObject validationObject = null;

		String requestMethod = containerRequest.getMethod();
		if ("post".equalsIgnoreCase(requestMethod) || "get".equalsIgnoreCase(requestMethod))
		{
			try
			{
				validationObject = runValidation(containerRequest);
			} catch (Exception e)
			{
				e.printStackTrace();
				throw new WebApplicationException(Status.BAD_REQUEST);
			}
		}

		if (validationObject != null)
		{
			int status = Response.Status.BAD_REQUEST.getStatusCode();
			Response.status(status).entity(validationObject).build();
			throw new WebApplicationException(Response.status(status).entity(validationObject).build());
		}
	}

	private String getServiceName(ContainerRequestContext containerRequest)
	{
		String serviceName = containerRequest.getUriInfo().getPath();
		String[] serviceParts = containerRequest.getUriInfo().getPath().split(NRConstants.SLASH, 3);
		serviceName = serviceParts[0] + NRConstants.SLASH + serviceParts[1];

		return serviceName;
	}

	private NRJsonObject runValidation(ContainerRequestContext containerRequest) throws Exception
	{
		NRJsonObject validationObject = null;
		String validationClassName = RequestValidationFilterProperties.getInstance()
				.getField(getServiceName(containerRequest));

		if (validationClassName == null)
		{
			throw new WebApplicationException(Status.BAD_REQUEST);
		}

		Class<?> c = Class.forName((String) validationClassName);
		Constructor<?> cons = c.getConstructor();
		INRValidation validator = (INRValidation) cons.newInstance();
		validationObject = validator.validate(validator.generateObject(containerRequest));

		return validationObject;
	}
}