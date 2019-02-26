package com.ness.services;

import java.util.Enumeration;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import com.documentum.fc.client.DfClient;
import com.documentum.fc.client.IDfClient;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfLoginInfo;
import com.documentum.fc.common.IDfLoginInfo;
import com.ness.utils.NRSecurityUtils;

public class NRSuperUserService
{
	private static NRSuperUserService instance;
	private static final String GLOBAL = "global";
	private static final String SUPER_USER_SUFFIX = ".superuser.name";
	private static final String SUPER_USER_PASS_SUFFIX = ".superuser.password";
	private static final String GLOBAL_USER = "*".concat(SUPER_USER_SUFFIX);
	private static final String GLOBAL_USER_PASS = "*".concat(SUPER_USER_PASS_SUFFIX);
	private static ResourceBundle bundle = ResourceBundle.getBundle("superuser");
	
	public static NRSuperUserService getInstance()
	{
		if(instance == null)
		{
			instance = new NRSuperUserService();
		}
		
		return instance;
	}
	
	public String getPropertiesAsString()
	{
		Enumeration<String> keys = bundle.getKeys();
		StringBuffer buf = new StringBuffer();
		String strKey;
		
		while (keys.hasMoreElements())
		{
			strKey = keys.nextElement();
			buf.append(strKey).append("=").append(bundle.getString(strKey));
			if (keys.hasMoreElements())
			{
				buf.append("~");
			}
		}
		
		return buf.toString();
	}

	private String getUserName(String docbaseName)
	{
		String userName;
		
		try
		{
			userName = bundle.getString(docbaseName.concat(SUPER_USER_SUFFIX));
		}
		catch (MissingResourceException e)
		{
			userName = bundle.getString(GLOBAL_USER);
		}
		
		return userName;
	}

	private String getPassword(String docbaseName)
	{
		String userPass;
		
		try
		{
			userPass = bundle.getString(docbaseName.concat(SUPER_USER_PASS_SUFFIX));
		}
		catch (MissingResourceException e)
		{
			userPass = bundle.getString(GLOBAL_USER_PASS);
		}
		
		try
		{
			return NRSecurityUtils.decrypt(userPass);
		}
		catch (Exception e)
		{
			throw new RuntimeException("NRSuperUserService.getPassword exception, can't decrypt the super user password, " + e.getMessage(), e);
		}
	}

	public String getUserLoginTicket(String strUserName, String strDocbase, String strDomain, int timeout) throws DfException
	{
		String strTicket = null;
		IDfSessionManager sm = null;
		IDfSession session = null;
		
		try
		{
			sm = getSuperUserSessionManager(strDocbase, strDomain);
    		if (sm == null)
    		{
    			throw new RuntimeException("NRSuperUserService.getUserLoginTicket exception, missing super user information");
    		}
    		
    		session = sm.getSession(strDocbase);
			strTicket = session.getLoginTicketEx(strUserName, GLOBAL, timeout, false, null);
		}
		finally
		{
			if (sm != null && session != null)
			{
				sm.release(session);
			}
		}
		
		return strTicket;
	}

	public IDfSessionManager getSuperUserSessionManager(String strDocbase, String strDomain) throws DfException
	{
		IDfSessionManager sessionManager = null;
		
		String strUserName = getUserName(strDocbase);
		String strPassword = getPassword(strDocbase);
		
		if (strDocbase != null && strUserName != null && strPassword != null)
		{
			IDfClient dfClient = DfClient.getLocalClient();
			if (dfClient != null)
			{
				IDfLoginInfo li = new DfLoginInfo();
				li.setUser(strUserName);
				li.setPassword(strPassword);
				li.setDomain(strDomain);
				
				sessionManager = dfClient.newSessionManager();
				sessionManager.setIdentity(strDocbase, li);

			}
		}
		
		return sessionManager;
	}
	
	public static IDfSession getSuperUserSession(String strDocbase, String strDomain) throws DfException{
		IDfSessionManager sessionManager = NRSuperUserService.getInstance().getSuperUserSessionManager(strDocbase, strDomain);
		return sessionManager.getSession(strDocbase);
	}
}
