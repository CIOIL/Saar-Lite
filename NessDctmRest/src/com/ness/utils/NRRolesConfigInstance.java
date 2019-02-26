package com.ness.utils;

import java.util.Properties;


public class NRRolesConfigInstance
{
	public static NRRolesConfigInstance instance = null;
														  
	private static final String OBJECT_ROLE_PROPERTIES = "object_roles.properties";
	private Properties objectRolesFile;	
	
	public static NRRolesConfigInstance getInstance()
	{
		if(instance == null)
		{
			instance = new NRRolesConfigInstance();
		}
		
		return instance;
	}
	
	public NRRolesConfigInstance()
	{		
		initRolesHash();
	}
	
	private void initRolesHash()
	{
		try
		{
			objectRolesFile = new Properties();
			objectRolesFile.load(getClass().getClassLoader().getResourceAsStream(OBJECT_ROLE_PROPERTIES));
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}		
	}
	
	public  String getRoleByTypes(String objectType)
	{
		return objectRolesFile.getProperty(objectType);
	}
}
