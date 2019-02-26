package com.ness.communication;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpSession;
import javax.ws.rs.container.ContainerRequestContext;

import com.documentum.fc.client.DfClient;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSessionManager;
import com.documentum.fc.common.DfLoginInfo;
import com.documentum.fc.common.IDfLoginInfo;
import com.ness.filters.communication.AuthenticationFilter;
import com.ness.objects.NRLoginInfo;
import com.ness.services.NRSuperUserService;
import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;

public class NRSessionManager
{

	private IDfSessionManager sessionManager;


	public  IDfSessionManager getIDfSessionManager(NRLoginInfo loginInfo) throws Exception
	{

	    if (loginInfo.getDocbase() == null)
		{
			throw new Exception(NRConstants.ERROR_NRSESSION_MANAGER_ONE);
		}
	    IDfLoginInfo li = new DfLoginInfo();
	    li.setUser(loginInfo.getUsername());
		if (loginInfo.getPassword() == null && loginInfo.isCanUseSuperUser())
		{			 			
			li.setPassword(NRSuperUserService.getInstance().getUserLoginTicket(loginInfo.getUsername(),
					loginInfo.getDocbase(), loginInfo.getDomain(), 60));
		} else
		{			
			li.setPassword(loginInfo.getPassword());
		}

		if (sessionManager == null)
		{
			sessionManager = DfClient.getLocalClient().newSessionManager();
		}
		if (!li.equals(sessionManager.getIdentity(loginInfo.getDocbase())))
		{
			try
			{
				sessionManager.clearIdentity(loginInfo.getDocbase());
				sessionManager.setIdentity(loginInfo.getDocbase(), li);
			} catch (Exception e)
			{
				// System.out.println("EXCEPTION: " + e.getMessage());
				e.printStackTrace();
			}
		}

		return sessionManager;
	}


	public  synchronized boolean isValidLoginAndSetSessionManager(NRLoginInfo loginInfo, HttpSession httpSession)
	{
		boolean isValidLogin = true;

		try
		{
			IDfSessionManager sessionManager = ((IDfSessionManager)httpSession.getAttribute(NRConstants.SESSION_MANAGER));
			
			if (sessionManager == null || !isSameCredentials(sessionManager, loginInfo))
			{
					sessionManager = getIDfSessionManager(loginInfo);
					httpSession.setAttribute(NRConstants.SESSION_MANAGER, sessionManager);
			}

			IDfSession session  = sessionManager.getSession(loginInfo.getDocbase());
			
			if (session == null)
			{
				isValidLogin = false;
				httpSession.removeAttribute(NRConstants.SESSION_MANAGER);
			}
			else
			{
				sessionManager.release(session);
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "NRSessionManager: exception==" + e.getMessage());
			isValidLogin = false;
		}

		return isValidLogin;
	
	}
	
	private boolean isSameCredentials(IDfSessionManager sessionManager, NRLoginInfo loginInfo) throws Exception
	{
		if (loginInfo.getDocbase() == null)
		{
			throw new Exception(NRConstants.ERROR_NRSESSION_MANAGER_ONE);
		}
	    IDfLoginInfo li = new DfLoginInfo();
	    li.setUser(loginInfo.getUsername());
		if (loginInfo.getPassword() == null && loginInfo.isCanUseSuperUser())
		{			 			
			li.setPassword(NRSuperUserService.getInstance().getUserLoginTicket(loginInfo.getUsername(),
					loginInfo.getDocbase(), loginInfo.getDomain(), 60));
		} else
		{			
			li.setPassword(loginInfo.getPassword());
		}
		if (!li.equals(sessionManager.getIdentity(loginInfo.getDocbase())))
		{
			return false;
		}
		return true;
	}

	public IDfSessionManager getIDfSessionManagerFromHttpSession(ContainerRequestContext containerRequest, HttpSession httpSession){
		IDfSessionManager sessionManager = ((IDfSessionManager)httpSession.getAttribute(NRConstants.SESSION_MANAGER));
		if (sessionManager == null){
			try
			{
				sessionManager = getIDfSessionManager(NRUtils.getRequestLoginInfo(containerRequest));
			} catch (Exception e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return sessionManager;
	}
	
	public IDfSessionManager getIDfSessionManagerFromHttpSession(NRLoginInfo loginInfo, HttpSession httpSession){
		IDfSessionManager sessionManager = ((IDfSessionManager)httpSession.getAttribute(NRConstants.SESSION_MANAGER));
		if (sessionManager == null){
			try
			{
				sessionManager = getIDfSessionManager(loginInfo);
			} catch (Exception e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return sessionManager;
	}

}
