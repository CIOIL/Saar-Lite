package com.ness.validation.post;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceAdvancedSearchValidation extends NRValidation implements INRValidation
{
	private static final String[] numericFieldsArr = {NRConstants.ATTR_DOC_TYPE,
														NRConstants.ATTR_STATUS};
	
	private static final String[] dateFieldsArr = {NRConstants.ATTR_FROM_DATE,
													NRConstants.ATTR_TO_DATE};
	
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
		
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateNumericOrEmptyCommand(), object, numericFieldsArr, NRConstants.VE_VALUE_MUST_BE_NUMERIC);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateDateOrEmptyCommand(), object, dateFieldsArr, NRConstants.VE_NOT_VALID_DATE_FORMAT);
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
