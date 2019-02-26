	package com.ness.validation.get;

	import javax.ws.rs.container.ContainerRequestContext;

	import com.ness.objects.NRJsonObject;
	import com.ness.utils.NRConstants;
	import com.ness.validation.INRValidation;
	import com.ness.validation.NRValidation;
	import com.ness.validation.NRValidationUtills;

public class NRServiceFolderValidation extends NRValidation implements INRValidation{

		private static final String[] objectIdsFieldsArr = {NRConstants.REQUEST_PARAM_OBJECT_ID};

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
			
			validationObject = NRValidationUtills.validateFieldsArray(new NRValidationUtills.ValidateFolderIdsCommand(), object, objectIdsFieldsArr, NRConstants.VE_NOT_VALID_OBJECT_IDS);
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
