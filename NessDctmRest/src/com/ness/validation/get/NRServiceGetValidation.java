package com.ness.validation.get;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceGetValidation extends NRValidation implements INRValidation
{
	private static final String[] ObjectTypeFieldsArr = {NRConstants.ATTR_OBJECT_TYPE_VA};
	private static final String[] objectIdsFieldsArr = {NRConstants.REQUEST_PARAM_OBJECT_ID};

	@Override
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception
	{
		return super.convertUriParamsToNRJson(containerRequest);
	}
	
	@Override
	public NRJsonObject validate(Object objectToValidate) throws Exception
	{
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;
		
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateLettersOnlyCommand(), object, ObjectTypeFieldsArr, NRConstants.VE_NOT_VALID_OBJECT_TYPE);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateObjectIdsCommand(), object, objectIdsFieldsArr, NRConstants.VE_NOT_VALID_OBJECT_IDS);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
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
