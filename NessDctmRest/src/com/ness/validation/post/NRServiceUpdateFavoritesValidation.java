package com.ness.validation.post;

import java.util.HashMap;
import java.util.List;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidateFieldCommand;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;
import com.ness.validation.NRValidationUtills.ValidateNumericCommand;

public class NRServiceUpdateFavoritesValidation extends NRValidation implements INRValidation
{
	private static final String[] requiredFieldsArr = {NRConstants.UPDATE_OBJECTS,
														NRConstants.DELETE_OBJECTS};

	private static final String[] updateObjectsFieldsArr = {NRConstants.UPDATE_OBJECTS};
	private static final String[] folderIdsFieldsArr = {NRConstants.DELETE_OBJECTS};
	
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

		validationObject = NRValidationUtills.validateFieldsArray(new ValidateUpdateFavoritesCommand(), object, updateObjectsFieldsArr, NRConstants.VE_NOT_VALID_UPDATE_OBJECTS);
		if (validationObject != null)
		{
			mergeValidationObject.getProperties().putAll(validationObject.getProperties());
		}

		validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateObjectIdsCommand(), object, folderIdsFieldsArr, NRConstants.VE_NOT_VALID_FOLDER_IDS);
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
	
	public static class ValidateUpdateFavoritesCommand implements INRValidateFieldCommand
	{
		@SuppressWarnings("unchecked")
		@Override
		public boolean execute(List<Object> updateObjects)
		{
			boolean result = true;
			
			if(updateObjects.size() > 0)
			{
				for (Object element : updateObjects)
				{
					HashMap<String, Object> object = (HashMap<String, Object>)element;
					
					if (!(object.get(NRConstants.ORDER_NO) != null && object.get(NRConstants.ORDER_NO).toString().length() > 0 &&
							object.get(NRConstants.R_OBJECT_ID) != null && object.get(NRConstants.R_OBJECT_ID).toString().length() > 0))
					{
						result = false;
						break;
					}

					List<Object> fieldAsArray = NRValidationUtills.convertFieldValueToArray(object.get(NRConstants.ORDER_NO));
					if (!(new ValidateNumericCommand()).execute(fieldAsArray))
					{
						result = false;
						break;
					}

					if (!NRValidationUtills.isValidObjectId(object.get(NRConstants.R_OBJECT_ID).toString()))
					{
						result = false;
						break;
					}
				}
			}
			
			return result;
		}
	}
}
