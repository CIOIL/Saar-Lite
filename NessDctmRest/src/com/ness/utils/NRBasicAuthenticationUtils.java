package com.ness.utils;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.bind.DatatypeConverter;

import com.ness.filters.communication.AuthenticationFilter;
import com.ness.objects.NRLoginInfo;

public class NRBasicAuthenticationUtils
{
	public static NRLoginInfo decode(String auth)
	{
		NRLoginInfo loginInfo = null;
		
        //Replacing "Basic THE_BASE_64" to "THE_BASE_64" directly
        auth = auth.replaceFirst("[B|b]asic ", "");
 
        //Decode the Base64 into byte[]
        byte[] decodedBytes = DatatypeConverter.parseBase64Binary(auth);
 
        //If the decode fails in any case
        if(decodedBytes != null && decodedBytes.length > 0)
        {
        	String[] infoArray = new String(decodedBytes).split(":");
    		//Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "NRBasicAuthenticationUtils: decoded header==" + new String(decodedBytes));

        	
        	if(infoArray != null && infoArray.length == 4)
        	{
        		loginInfo = new NRLoginInfo();
        		loginInfo.setUsername(infoArray[0]);
        		loginInfo.setPassword(infoArray[1]);
        		loginInfo.setDomain(infoArray[2]);
        		loginInfo.setDocbase(infoArray[3]);
        	}
        }
 
        return loginInfo; 
    }
}
