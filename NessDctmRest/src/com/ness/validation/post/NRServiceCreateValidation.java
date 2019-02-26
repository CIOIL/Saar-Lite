package com.ness.validation.post;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceCreateValidation extends NRValidation implements INRValidation
{
	
	private static final String[] requiredFieldsArr = {NRConstants.I_FOLDER_ID,
														NRConstants.ATTR_OBJECT_NAME,
														NRConstants.SENDER_NAME,
														NRConstants.ATTR_TEMPLATE};
	
	private static final String[] folderIdFieldsArr = {NRConstants.I_FOLDER_ID};
	private static final String[] documentIdFieldsArr = {NRConstants.ATTR_TEMPLATE};
	private static final String[] senderFieldsArr = {NRConstants.SENDER_NAME};
	
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
	
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateFolderIdsCommand(), object, folderIdFieldsArr, NRConstants.VE_NOT_VALID_FOLDER_IDS);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateObjectIdsCommand(), object, documentIdFieldsArr, NRConstants.VE_NOT_VALID_OBJECT_IDS);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateSenderNameValidCommand(), object, senderFieldsArr, NRConstants.VE_NOT_VALID_SENDER_NAME);
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
