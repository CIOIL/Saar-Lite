package com.ness.validation.custom;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRGovDisciplineFolderPropertiesFormValidation extends NRValidation implements INRValidation
{

	private static final String[] requiredFields =
	{
		NRConstants.OBJECT_NAME,
		NRConstants.CLASSIFICATION, 
        NRConstants.SENSITIVITY,
        NRConstants.ID_NUMBER,
        NRConstants.NAME,
        NRConstants.ORG_OFFICE,
        NRConstants.COMPLAINT_DATE
    };
	
	private static final String[] idFields = {NRConstants.ID_NUMBER};
	
	@Override
	public NRJsonObject validate(Object objectToValidate) throws Exception
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
		
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateIsraeliIdCommand(), object, idFields, NRConstants.VE_NOT_VALID_ISRAELI_ID);
		
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		
		return !mergeValidationObject.getProperties().isEmpty() ? mergeValidationObject : null;
	}
}
