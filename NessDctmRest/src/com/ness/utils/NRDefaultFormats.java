package com.ness.utils;

import java.util.Properties;

public class NRDefaultFormats
{
	public static NRDefaultFormats instance = null;
	private Properties properties = null;
	
	private static final String DEFAULT_FORMATS_PROPERTIES = "default_formats.properties";	
	
	public static NRDefaultFormats getInstance()
	{
		if(instance == null)
		{
			instance = new NRDefaultFormats();
		}
		
		return instance;
	}
	
	public NRDefaultFormats()
	{		
		initPropertiesHash();
	}
	
	private void initPropertiesHash()
	{
		try
		{
			Properties objectPropertiesFile = new Properties();
			objectPropertiesFile.load(getClass().getClassLoader().getResourceAsStream(DEFAULT_FORMATS_PROPERTIES));
			properties = objectPropertiesFile;
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}		
	}
	
	public boolean containsKey(String key)
	{
		return properties != null ? properties.containsKey(key) : false;
	}
	
	public String getValueByKey(String key)
	{
		return properties != null ? properties.getProperty(key) : null;
	}
}