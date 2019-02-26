package com.ness.utils;

import java.util.HashSet;
import java.util.Properties;


public class NRObjectTypeConfigInstance
{
	public static NRObjectTypeConfigInstance instance = null;
	private HashSet<String>  objectTypes = null;
	
	private static final String OBJECT_TYPE_PROPERTIES = "object_type.properties";
	private Properties objectTypesFile;	
	
	public static NRObjectTypeConfigInstance getInstance()
	{
		if(instance == null)
		{
			instance = new NRObjectTypeConfigInstance();
		}
		
		return instance;
	}
	
	public NRObjectTypeConfigInstance()
	{		
		initPropertiesHash();
	}
	
	private void initPropertiesHash()
	{
		try
		{
			objectTypesFile = new Properties();
			objectTypesFile.load(getClass().getClassLoader().getResourceAsStream(OBJECT_TYPE_PROPERTIES));
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}		
	}
	
	public  HashSet<String> getObjectTypes(String unitLayerTypes)
	{
		String objectFieldsStr = objectTypesFile.getProperty(unitLayerTypes);
		
		objectTypes = new HashSet<String>();
		
		if(objectFieldsStr != null && objectFieldsStr.length() > 0)
		{
			String[] objectFieldsArray = objectFieldsStr.split(NRConstants.COMMA);
			
			for(int index = 0 ; index < objectFieldsArray.length ; index++)
			{
				objectTypes.add(objectFieldsArray[index]);
			}
		}
		return objectTypes;
	}
}
