package com.ness.validation.custom;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRNewDocumentValidation extends NRValidation implements INRValidation
{
	private static final String[] fieldsArr = {	NRConstants.OBJECT_NAME, 
												NRConstants.I_FOLDER_ID,
												NRConstants.CLASSIFICATION, 
												NRConstants.SENSITIVITY, 
												NRConstants.SENDER_NAME,												
												NRConstants.ATTR_TEMPLATE,
												NRConstants.DOC_DATE,
												NRConstants.ATTR_DOC_TYPE};

	private static final String[] hebrewHebrewInputLengthFields = {NRConstants.OBJECT_NAME};
	
	@Override
	public NRJsonObject validate(Object objectToValidate)
	{	
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;
		
		for (int index = 0; index < fieldsArr.length; index++) 
		{
			if(!(object.getProperties().get(fieldsArr[index]) != null && object.getProperties().get(fieldsArr[index]).toString().length() > 0))
			{
				if(validationObject == null)
				{
					validationObject = new NRJsonObject();
				}
	
				validationObject.getProperties().put(fieldsArr[index], NRConstants.VE_MUST_HAVE_INPUT);
			}
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
		
		return !mergeValidationObject.getProperties().isEmpty() ? mergeValidationObject : null;
	}

}
