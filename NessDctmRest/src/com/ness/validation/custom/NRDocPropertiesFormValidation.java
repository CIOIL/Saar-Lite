package com.ness.validation.custom;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRDocPropertiesFormValidation extends NRValidation implements INRValidation
{
	private static final String[] requiredFieldsArr = {	NRConstants.OBJECT_NAME, 
												NRConstants.DOC_DATE,
												NRConstants.I_FOLDER_ID, 
												NRConstants.CLASSIFICATION, 
												NRConstants.SENSITIVITY, 
												NRConstants.SENDER_NAME};

	
	private static final String[] folderIdsFieldsArr = {NRConstants.I_FOLDER_ID};
	private static final String[] dateFieldsArr = {NRConstants.DOC_DATE};
	private static final String[] ObjectTypeFieldsArr = {NRConstants.R_OBJECT_TYPE};
	private static final String[] documentIdFieldsArr = {NRConstants.R_OBJECT_ID};
	private static final String[] senderFieldsArr = {NRConstants.SENDER_NAME};
	private static final String[] statusDateFieldsArr = {NRConstants.ATTR_STATUS_DATE};
	private static final String[] hebrewHebrewInputLengthFields = {NRConstants.OBJECT_NAME};

	
	@Override
	public NRJsonObject validate(Object objectToValidate)
	{
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;
		
		if(object.getProperties().get(NRConstants.R_OBJECT_TYPE).equals(NRConstants.GOV_DOCUMENT) || ((String) object.getProperties().get(NRConstants.R_OBJECT_TYPE)).indexOf("document")>0)
		{
			validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateRequiredFieldCommand(), object, requiredFieldsArr, NRConstants.VE_MUST_HAVE_INPUT);
		}
		
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		if(((String) object.getProperties().get(NRConstants.R_OBJECT_TYPE)).indexOf("folder")==-1)
		{
			validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateFolderIdsCommand(), object, folderIdsFieldsArr, NRConstants.VE_NOT_VALID_FOLDER_IDS);
		}
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		if(object.getProperties().get(NRConstants.R_OBJECT_TYPE).equals(NRConstants.GOV_DOCUMENT) || ((String) object.getProperties().get(NRConstants.R_OBJECT_TYPE)).indexOf("document")>0)
		{
				validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateDateCommand(), object, dateFieldsArr, NRConstants.VE_NOT_VALID_DATE_FORMAT);
			if (validationObject != null)
			{
				mergeValidationObject.getProperties().putAll(validationObject.getProperties());
			}
		}
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateLettersOnlyCommand(), object, ObjectTypeFieldsArr, NRConstants.VE_NOT_VALID_OBJECT_TYPE);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
				if(object.getProperties().get(NRConstants.R_OBJECT_TYPE).equals(NRConstants.GOV_DOCUMENT) || ((String) object.getProperties().get(NRConstants.R_OBJECT_TYPE)).indexOf("document")>0)
		{
			validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateObjectIdsCommand(), object, documentIdFieldsArr, NRConstants.VE_NOT_VALID_OBJECT_IDS);
		}
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		if(object.getProperties().get(NRConstants.R_OBJECT_TYPE).equals(NRConstants.GOV_DOCUMENT) || ((String) object.getProperties().get(NRConstants.R_OBJECT_TYPE)).indexOf("document")>0)
		{
			validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateSenderNameValidCommand(), object, senderFieldsArr, NRConstants.VE_NOT_VALID_SENDER_NAME);
		}
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		String status = (String)object.getProperties().get(NRConstants.ATTR_STATUS);
		if(status != null && status.length() > 0)
		{
			validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateDateCommand(), object, statusDateFieldsArr, NRConstants.VE_NOT_VALID_DATE_FORMAT);
		}
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
