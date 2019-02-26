package com.ness.filters.communication;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import com.ness.communication.NRSessionManager;
import com.ness.objects.NRLoginInfo;
import com.ness.security.NRBasicAuthentication;
import com.ness.security.NRGovSmartCardAuthentication;
import com.ness.security.NRKerberosAuthentication;
import com.ness.utils.NRConstants;

/**
 * @author yurin
 *
 */
@Provider
@Priority(1)
public class AuthenticationFilter implements ContainerRequestFilter
{
	private static final Set<String> authFreeUrls = new HashSet<String>(Arrays.asList(new String[] { "cs/docbases" }));
	@Context
	private HttpServletRequest httpRequest;
	@Context
	private HttpServletResponse httpResponse;

	@Override

	public void filter(ContainerRequestContext containerRequest) throws IOException
	{

		// if options type of request method -- do nothing
		if (NRConstants.OPTIONS.equals(containerRequest.getMethod().toLowerCase()))
		{
			return;
		}
		// if free url -- do nothing
		if (authFreeUrls.contains(containerRequest.getUriInfo().getPath()))
		{
			return;
		}

		NRLoginInfo loginInfo;
		try
		{
			String authenticationType = containerRequest.getHeaderString(NRConstants.AUTHENTICATION_TYPE);
			Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "Authentication filter: AuthenticationType==" + authenticationType);
			if (authenticationType == null){
				System.err.println("AuthenticationType header should be sent!!!!");
				throw new WebApplicationException(Status.UNAUTHORIZED);
			}
			if (NRConstants.AUTH_GOV_SMART_CARD.equals(authenticationType))
			{
				loginInfo = NRGovSmartCardAuthentication.createLoginInfo(containerRequest, httpRequest);
			} else if (NRConstants.AUTH_KERBEROS.equals(authenticationType))
			{				
				loginInfo = NRKerberosAuthentication.createLoginInfo(containerRequest, httpRequest);
			} else if (NRConstants.AUTH_BASIC.equals(authenticationType))
			{
				loginInfo = NRBasicAuthentication.createLoginInfo(containerRequest, httpRequest);
			} else
			{
				throw new WebApplicationException(Status.UNAUTHORIZED);
			}
			if (loginInfo == null)
			{
				throw new WebApplicationException(Status.UNAUTHORIZED);
			}
			login(containerRequest, loginInfo);
		} catch (Exception e)
		{
			//e.printStackTrace();
			System.out.println("exception==" + e.getMessage());
			Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "exception==" + e.getMessage());
			throw new WebApplicationException(Status.UNAUTHORIZED);
		}

		

	}

	private void login(ContainerRequestContext containerRequest, NRLoginInfo loginInfo) throws Exception
	{

		containerRequest.setProperty(NRConstants.REQUEST_LOGIN_INFO, loginInfo);
		HttpSession session = httpRequest.getSession(true);
		if (session.getAttribute(NRConstants.SESSION_MANAGER) == null)
		{
			session.setAttribute(NRConstants.SESSION_MANAGER,
					new NRSessionManager().getIDfSessionManager(loginInfo));
		}

	}

	
}