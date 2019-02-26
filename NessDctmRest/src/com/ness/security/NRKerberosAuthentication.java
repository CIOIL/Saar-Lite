package com.ness.security;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Response.Status;

import com.ness.communication.NRSessionManager;
import com.ness.filters.communication.AuthenticationFilter;
import com.ness.objects.NRLoginInfo;
import com.ness.utils.NRConstants;
import com.ness.utils.NRKerberosUtils;

public class NRKerberosAuthentication
{

	public static NRLoginInfo createLoginInfo(ContainerRequestContext containerRequest, HttpServletRequest httpRequest)
			throws Exception
	{

		String docbase = containerRequest.getHeaderString(NRConstants.DOCBASE);
		if (docbase == null)
		{
			Logger.getLogger(AuthenticationFilter.class.getName()).log(Level.INFO,
					"NRKerberosAuthentication: exception!! In case AuthenticationType is Kerberos docbase header should be sent!!!!");
			throw new WebApplicationException(Status.UNAUTHORIZED);
		}
		Logger.getLogger(AuthenticationFilter.class.getName()).log(Level.INFO,
				"NRKerberosAuthentication: docbase==" + docbase);
		HttpSession httpSession = httpRequest.getSession(true);
		String username = (String) httpSession.getAttribute(NRConstants.KERBEROS_USERNAME);
		Logger.getLogger(AuthenticationFilter.class.getName()).log(Level.INFO,
				"kerberos username from session = " + username);
		if (username == null)
		{
			String authorization = containerRequest.getHeaderString(NRConstants.AUTHORIZATION);
			Logger.getLogger(AuthenticationFilter.class.getName()).log(Level.INFO,
					"authorization header = " + authorization);
			if (authorization == null || !authorization.contains(NRConstants.NEGOTIATE))
			{
				containerRequest.getHeaders().add("sendNegotiate", "true");
				return null;
			}

			if (NRConstants.LOCALHOST.equals(httpRequest.getServerName()))
			{
				username = NRKerberosUtils.authWithKerberosMock(containerRequest);
			} else
			{
				username = NRKerberosUtils.authWithKerberos(containerRequest);
			}
			Logger.getLogger(AuthenticationFilter.class.getName()).log(Level.INFO,
					"kerberos username from kerberos server = " + username);

		}

		NRLoginInfo loginInfo = new NRLoginInfo();
		loginInfo.setCanUseSuperUser(true);
		loginInfo.setUsername(username);

		loginInfo.setDocbase(docbase);

		boolean isValid = new NRSessionManager().isValidLoginAndSetSessionManager(loginInfo, httpSession);
		Logger.getLogger(AuthenticationFilter.class.getName()).log(Level.INFO,
				"NRKerberosAuthentication: isValid==" + isValid);
		if (!isValid)
		{
			loginInfo = null;
		} else
		{
			httpSession.setAttribute(NRConstants.KERBEROS_USERNAME, username);
		}

		return loginInfo;
	}

}
