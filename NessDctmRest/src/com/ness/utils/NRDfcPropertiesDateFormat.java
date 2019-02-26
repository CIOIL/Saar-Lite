package com.ness.utils;

import java.io.IOException;
import java.util.Properties;

public class NRDfcPropertiesDateFormat
{
	private static Properties DFC_PROPERTIES = null;
	
	public static String getDfcPropertiesDateFormat() throws IOException
	{
		Properties dfcProperties = DFC_PROPERTIES  == null ? initDfcProperties() : DFC_PROPERTIES;
		return dfcProperties.getProperty("dfc.date_format");
	}
	
	public static String getDfcPropertiesDqlDateFormat() throws IOException
	{
		Properties dfcProperties = DFC_PROPERTIES  == null ? initDfcProperties() : DFC_PROPERTIES;
		return dfcProperties.getProperty("dql.date_format");
	}
	
	private static Properties initDfcProperties() throws IOException
	{
		Properties dfcProperties = new Properties();
		dfcProperties.load(NRObjectUtils.class.getClassLoader().getResourceAsStream("dfc.properties"));
		return dfcProperties;
	}
}
