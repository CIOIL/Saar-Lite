package com.ness.validation.custom;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRGovGiyurFolderPropertiesFormValidation extends NRValidation implements INRValidation
{

	private static final String[] requiredFields = { NRConstants.OBJECT_NAME, NRConstants.ATTR_OPEN_DATE,
			                                         NRConstants.ATTR_FIRST_NAME, NRConstants.ATTR_LAST_NAME,
			                                         NRConstants.ATTR_DISTRICT, NRConstants.ATTR_CLASSIFICATION,
			                                         NRConstants.ATTR_SENSITIVITY, NRConstants.ATTR_BIRTH_DATE,
			                                         NRConstants.ATTR_STREET_ADDRESS,}; //NRConstants.ATTR_PHONE,
			                                         //NRConstants.ATTR_COMMUNITY_DATE };//, NRConstants.ATTR_STATUS_DATE};

	private static final String[] hebrewHebrewInputLengthFields = {NRConstants.OBJECT_NAME};
	
	@Override
	public NRJsonObject validate(Object objectToValidate)
	{
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateRequiredFieldCommand(),
				object, requiredFields, NRConstants.VE_MUST_HAVE_INPUT);

		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateHebrewInputLengthObjectNameCommand(), object, hebrewHebrewInputLengthFields, NRConstants.VE_NOT_VALID_OBJECT_NAME_LENGTH);
		
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
