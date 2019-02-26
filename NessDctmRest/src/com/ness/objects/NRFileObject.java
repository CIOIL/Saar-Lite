package com.ness.objects;

import java.io.ByteArrayInputStream;

import com.ness.utils.NRConstants;

public class NRFileObject
{
	private ByteArrayInputStream inputStream;
	private String type;
	private String name;
	private String extension;
	private String govId;
	private String unitLayer;
	
	public String getGovId()
	{
		return govId;
	}
	
	public void setGovId(String govId)
	{
		this.govId = govId;
	}
	
	public String getType()
	{
		return type;
	}
	
	public void setType(String type)
	{
		this.type = type;
	}

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getExtension()
	{
		return extension;
	}

	public void setExtension(String extension)
	{
		this.extension = extension;
	}
	
	public void setTypeAndExtension(String[] typeAndextension)
	{
		setType(typeAndextension[0]);
		setExtension(typeAndextension[1]);
	}
	
	public String getFullNameForDownload()
	{
		String name = removeLastDotAndWindowsProhibitedCharactersIfExist(getName());
		String fullName = new StringBuffer(name).append(NRConstants.DOT).append(getExtension()).toString();
		return fullName != null && fullName.length() < 250 ? fullName : fullName.substring(0, 251);
	}

	private static String removeLastDotAndWindowsProhibitedCharactersIfExist(String objectName)
	{
		StringBuffer buf = new StringBuffer();
		
		for (int i = 0; i < objectName.length(); i++)
		{
			String character = String.valueOf(objectName.charAt(i));
			
			if(!character.matches(NRConstants.REGEX_WINDOWS_FILE_NAME_PROHIBITED_CHARACTERS))
			{
				buf.append(character);
			}
		}
		
		while (buf.length() > 0 && buf.lastIndexOf(String.valueOf(NRConstants.DOT)) == buf.length() - 1)
		{
			buf.deleteCharAt(buf.length() - 1);
		}
		
		String objectNewName = new String(buf);
		
		if (objectNewName.length() == 0)
		{
			objectNewName = NRConstants.UNTITLED;
		}
		
		return objectNewName;
	}
	
	public ByteArrayInputStream getInputStream()
	{
		return inputStream;
	}

	public void setInputStream(ByteArrayInputStream inputStream)
	{
		this.inputStream = inputStream;
	}

	public String getUnitLayer()
	{
		return unitLayer;
	}
	
	public void setUnitLayer(String unitLayer)
	{
		this.unitLayer = unitLayer;
	}
}
