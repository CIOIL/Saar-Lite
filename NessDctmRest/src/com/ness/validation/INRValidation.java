package com.ness.validation;

import javax.ws.rs.container.ContainerRequestContext;

import com.ness.objects.NRJsonObject;

public interface INRValidation
{
	public Object generateObject(ContainerRequestContext containerRequest) throws Exception;
	public NRJsonObject validate(Object objectToValidate) throws Exception;
}
