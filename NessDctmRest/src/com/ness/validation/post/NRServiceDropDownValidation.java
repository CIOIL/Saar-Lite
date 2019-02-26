package com.ness.validation.post;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceDropDownValidation extends NRValidation implements INRValidation
{
	
	private static final String[] requiredFieldsArr = {NRConstants.ATTR_OBJECT_TYPE_VA,
														NRConstants.ATTR_ATTR_NAME};
	
	private static final String[] ObjectTypeFieldsArr = {NRConstants.ATTR_OBJECT_TYPE_VA};
	
	@Override
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception
	{
		return getNRJsonFromRequest(containerRequest);
	}
	
	@Override
	public NRJsonObject validate(Object objectToValidate)
	{	
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateRequiredFieldCommand(), object, requiredFieldsArr, NRConstants.VE_MUST_HAVE_INPUT);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateLettersOnlyCommand(), object, ObjectTypeFieldsArr, NRConstants.VE_NOT_VALID_OBJECT_TYPE);
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
