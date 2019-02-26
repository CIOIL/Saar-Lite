package com.ness.filters.communication.requestvalidation;

import java.util.Properties;
import com.ness.utils.NRUtils;

public class RequestValidationFilterProperties
{
	public static RequestValidationFilterProperties instance = null;
	private Properties requestValidationProperties = null;
	private static final String REQUEST_VALIDATION_PROPERTIES = "request_validation_filter.properties";	
	
	public static RequestValidationFilterProperties getInstance()
	{
		if(instance == null)
		{
			instance = new RequestValidationFilterProperties();
		}
		
		return instance;
	}
	
	public RequestValidationFilterProperties()
	{		
		initProperties();
	}
	
	private void initProperties()
	{
		try
		{
			requestValidationProperties = new Properties();
			requestValidationProperties.load(getClass().getClassLoader().getResourceAsStream(REQUEST_VALIDATION_PROPERTIES));
		}
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
	}
	
	public String getField(String fieldName)
	{
		String result = null;
		
		if(requestValidationProperties != null)
		{
			result = (String)requestValidationProperties.get(fieldName);
		}
		
		return result.trim();
	}
}
