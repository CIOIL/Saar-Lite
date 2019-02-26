package com.ness.validation.post;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceFoldersLocationValidation extends NRValidation implements INRValidation
{
	private static final String[] requiredFieldsArr = {NRConstants.FOLDER_IDS};
	
	private static final String[] folderIdsFieldsArr = {NRConstants.FOLDER_IDS};

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
	
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateFolderIdsCommand(), object, folderIdsFieldsArr, NRConstants.VE_NOT_VALID_FOLDER_IDS);
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
