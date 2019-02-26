package com.ness.validation.post;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceTypeAndGovIdValidation  extends NRValidation implements INRValidation
{
	private static final String[] requiredFieldsArr = { NRConstants.GOVID, NRConstants.REQUEST_PARAM_OBJECT_TYPE };
	private static final String[] toValidateFieldsArr = { NRConstants.GOVID};

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

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateRequiredFieldCommand(),
				object, requiredFieldsArr, NRConstants.VE_MUST_HAVE_INPUT);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateGovIdsCommand(),
				object, toValidateFieldsArr, NRConstants.VE_NOT_VALID_GOV_IDS);
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

