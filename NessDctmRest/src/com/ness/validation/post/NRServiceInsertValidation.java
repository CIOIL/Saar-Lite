package com.ness.validation.post;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceInsertValidation extends NRValidation implements INRValidation
{
	private static final String[] requiredFieldsArr = {//NRConstants.SENDER_NAME,
													   NRConstants.OBJECT_NAME,
													   NRConstants.R_OBJECT_TYPE};
	
	@Override
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception
	{
		return getNRJsonFromRequest(containerRequest);
	}	
	
	@Override
	public NRJsonObject validate(Object objectToValidate) throws Exception
	{
		//This service can be activated by multiple actions, all of which must have r_object_id
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateRequiredFieldCommand(), object, requiredFieldsArr, NRConstants.VE_MUST_HAVE_INPUT);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		
		mergeValidationObject = runCustomValidation(object,mergeValidationObject);

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
