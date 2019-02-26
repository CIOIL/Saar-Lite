package com.ness.validation.get;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.validation.INRValidation;
import com.ness.validation.NRValidation;
import com.ness.validation.NRValidationUtills;

public class NRServiceEmptyValidation extends NRValidation implements INRValidation
{

	@Override
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception
	{
		return null;
	}
	
	@Override
	public NRJsonObject validate(Object objectToValidate) throws Exception
	{
		return null;
	}
}
