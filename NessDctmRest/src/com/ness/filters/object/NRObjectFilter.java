package com.ness.filters.object;

import java.util.HashSet;
import java.util.Properties;

import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;


public class NRObjectFilter
{
	public static NRObjectFilter instance = null;
	private HashSet<String> properties = null;
	
	private static final String OBJECT_FIELDS = "object_fields";
	private static final String OBJECT_PROPERTIES_PROPERTIES = "object_properties.properties";	
	
	public static NRObjectFilter getInstance()
	{
		if(instance == null)
		{
			instance = new NRObjectFilter();
		}
		
		return instance;
	}
	
	public NRObjectFilter()
	{		
		initPropertiesHash();
	}
	
	private void initPropertiesHash()
	{
		try
		{
			Properties objectPropertiesFile = new Properties();
			objectPropertiesFile.load(getClass().getClassLoader().getResourceAsStream(OBJECT_PROPERTIES_PROPERTIES));

			String objectFieldsStr = objectPropertiesFile.getProperty(OBJECT_FIELDS);
			
			if(objectFieldsStr != null && objectFieldsStr.length() > 0)
			{
				properties = new HashSet<String>();
				
				String[] objectFieldsArray = objectFieldsStr.split(NRConstants.COMMA);
				
				for(int index = 0 ; index < objectFieldsArray.length ; index++)
				{
					properties.add(objectFieldsArray[index]);
				}
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}		
	}
	
	public boolean hasField(String fieldName)
	{
		boolean hasField = true;
		
		if(properties != null)
		{
			hasField = properties.contains(fieldName);
		}
		
		return hasField;
	}
}
