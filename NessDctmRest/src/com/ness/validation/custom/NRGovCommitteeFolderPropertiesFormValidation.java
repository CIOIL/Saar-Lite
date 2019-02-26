package com.ness.validation.custom;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRGovCommitteeFolderPropertiesFormValidation extends NRValidation implements INRValidation
{

	private static final String[] committeeFieldFolder = { NRConstants.OBJECT_NAME, NRConstants.CLASSIFICATION,
			NRConstants.SENSITIVITY };
	
	private static final String[] hebrewHebrewInputLengthFields = {NRConstants.OBJECT_NAME};

	@Override
	public NRJsonObject validate(Object objectToValidate)
	{
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateRequiredFieldCommand(),
				object, committeeFieldFolder, NRConstants.VE_MUST_HAVE_INPUT);

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
