package com.ness.validation.get;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceFolderOnlyObjectsValidation extends NRValidation implements INRValidation
{
	private static final String[] folderIdsFieldsArr = {NRConstants.REQUEST_PARAM_OBJECT_ID};

	private static final String[] numericFieldsArr = {NRConstants.REQUEST_PARAM_PAGE};

	@Override
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception
	{
		return super.convertUriParamsToNRJson(containerRequest);
	}
	
	@Override
	public NRJsonObject validate(Object objectToValidate) throws Exception
	{
		NRJsonObject object = (NRJsonObject) objectToValidate;
		NRJsonObject mergeValidationObject = new NRJsonObject();
		NRJsonObject validationObject = null;
		
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateFolderIdsCommand(), object, folderIdsFieldsArr, NRConstants.VE_NOT_VALID_FOLDER_IDS);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}
		
		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateNumericCommand(), object, numericFieldsArr, NRConstants.VE_VALUE_MUST_BE_NUMERIC);
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
