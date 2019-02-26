package com.ness.validation;

import java.lang.reflect.Constructor;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response.Status;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.server.ContainerRequest;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;

public abstract class NRValidation
{
	public NRJsonObject getNRJsonFromRequest(ContainerRequestContext containerRequest)
	{
		NRJsonObject objectToReturn = null;
		ContainerRequest cr = (ContainerRequest) containerRequest;
	    cr.bufferEntity();
	    objectToReturn = cr.readEntity(NRJsonObject.class);
	    
		return objectToReturn;
	}
	
	public FormDataMultiPart getFormMultiDataFromRequest(ContainerRequestContext containerRequest)
	{
	    FormDataMultiPart objectToReturn = null;
		ContainerRequest cr = (ContainerRequest) containerRequest;
	    cr.bufferEntity();
	    objectToReturn = cr.readEntity(FormDataMultiPart.class);
	    
		return objectToReturn;
	}
	
	public NRJsonObject validateObjectWithClass(NRJsonObject objectToValidate, String validationClassName)
	{
		NRJsonObject validationObject;
		
		try
		{
			Class<?> c = Class.forName((String) validationClassName);
			Constructor<?> cons = c.getConstructor();
			INRValidation validator = (INRValidation) cons.newInstance();
			validationObject = validator.validate(objectToValidate);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Status.BAD_REQUEST);
		}
		
		return validationObject;
	}
	
	public NRJsonObject runCustomValidation(NRJsonObject object, NRJsonObject mergeValidationObject)
	{
		NRJsonObject validate = mergeValidationObject;
		
		if (object.getProperties().get(NRConstants.VALIDATION_CLASS) != null)
		{
			NRJsonObject customValidation = validateObjectWithClass(object, object.getProperties().get(NRConstants.VALIDATION_CLASS).toString());
			
			if(customValidation!= null && !customValidation.getProperties().isEmpty())
			{
				customValidation.getProperties().putAll(mergeValidationObject.getProperties());
				validate = customValidation;
			}
		}
		
		return validate;
	}
	
	public NRJsonObject convertUriParamsToNRJson(ContainerRequestContext containerRequest) throws Exception
	{
		NRJsonObject convertedObject = null;
		MultivaluedMap<String, String> uriParams = containerRequest.getUriInfo().getPathParameters();
		
		if(!uriParams.isEmpty())
		{
			convertedObject = new NRJsonObject();

			for(String mapKey : uriParams.keySet())
			{
				convertedObject.getProperties().put(mapKey, uriParams.get(mapKey));
			}
		}
		
		return convertedObject;
	}
	
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception
	{
		return null;
	}	
}
