package com.ness.utils;

import java.util.HashSet;
import java.util.Properties;

import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;


public class NRExcludedColumns
{
	public static NRExcludedColumns instance = null;
	private HashSet<String> properties = null;
	
	private static final String EXCLUDED_COLUMNS = "excluded_columns";
	private static final String EXCLUDED_COLUMNS_PROPERTIES = "excluded_columns.properties";	
	
	public static NRExcludedColumns getInstance()
	{
		if(instance == null)
		{
			instance = new NRExcludedColumns();
		}
		
		return instance;
	}
	
	public NRExcludedColumns()
	{		
		initPropertiesHash();
	}
	
	private void initPropertiesHash()
	{
		try
		{
			Properties objectPropertiesFile = new Properties();
			objectPropertiesFile.load(getClass().getClassLoader().getResourceAsStream(EXCLUDED_COLUMNS_PROPERTIES));

			String objectFieldsStr = objectPropertiesFile.getProperty(EXCLUDED_COLUMNS);
			
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

	public HashSet<String> getProperties() {
		return properties;
	}

	public void setProperties(HashSet<String> properties) {
		this.properties = properties;
	}
}
