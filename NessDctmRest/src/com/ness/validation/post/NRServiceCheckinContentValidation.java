package com.ness.validation.post;

import javax.ws.rs.container.ContainerRequestContext;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceCheckinContentValidation extends NRValidation implements INRValidation
{
	private static final String[] requiredHeaderFieldsArr = {NRConstants.REQUEST_PARAM_OBJECT_ID};

	@Override
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception
	{
		//we need to check header params and json payload data, so return the whole request to validate() method
		return containerRequest;
	}
	
	@Override
	public NRJsonObject validate(Object containerRequest) throws Exception
	{
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;

		Object payloadObjectToValidate = getFormMultiDataFromRequest((ContainerRequestContext)containerRequest);
		NRJsonObject uriParamsObjectToValidate = convertUriParamsToNRJson((ContainerRequestContext)containerRequest);
		
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateRequiredFieldCommand(), uriParamsObjectToValidate, requiredHeaderFieldsArr, NRConstants.VE_MUST_HAVE_INPUT);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		
		FormDataMultiPart form = (FormDataMultiPart) payloadObjectToValidate;
		FormDataBodyPart filePart = form.getField(NRConstants.FILE);
		
		if(filePart.getContentDisposition().getFileName() == null)
		{
			mergeValidationObject.getProperties().put(NRConstants.FILE, NRConstants.VE_NO_FILE_SELCTED);
		}
		
		if (!mergeValidationObject.getProperties().isEmpty())
		{
			return mergeValidationObject;
		}

		else
		{
			return null;
		}
	}
}
