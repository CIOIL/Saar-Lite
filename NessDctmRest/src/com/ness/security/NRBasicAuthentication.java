package com.ness.security;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.container.ContainerRequestContext;

import com.ness.communication.NRSessionManager;
import com.ness.filters.communication.AuthenticationFilter;
import com.ness.objects.NRLoginInfo;
import com.ness.utils.NRBasicAuthenticationUtils;
import com.ness.utils.NRConstants;

public class NRBasicAuthentication
{
	public static NRLoginInfo createLoginInfo(ContainerRequestContext containerRequest, HttpServletRequest httpRequest) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);

		//String authorization = containerRequest.getHeaderString(NRConstants.AUTHORIZATION);
		String authentication = containerRequest.getHeaderString(NRConstants.AUTHENTICATION);
		if (authentication == null){
			return null;
		}
		Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "NRBasicAuthentication: authorization header==" + authentication);
        NRLoginInfo loginInfo = NRBasicAuthenticationUtils.decode(authentication);
        if (loginInfo == null){
        	return null;
        }
        boolean isValid = new NRSessionManager().isValidLoginAndSetSessionManager(loginInfo, httpSession);
        
        if(!isValid)
        {
        	loginInfo = null;
        }
        
		return loginInfo;
	}


}
