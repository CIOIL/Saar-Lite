package com.ness.utils;

import java.io.IOException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.container.ContainerRequestContext;

import org.ietf.jgss.GSSCredential;

import com.emc.documentum.kerberos.utility.AcceptResult;
import com.emc.documentum.kerberos.utility.KerberosUtility;
import com.ness.filters.communication.AuthenticationFilter;

public class NRKerberosUtils
{

	final static String KERBEROS_PROPERTIES = "kerberos.properties";
	static Properties kerberosProperties;

	{
		try
		{
			kerberosProperties.load(getClass().getClassLoader().getResourceAsStream(KERBEROS_PROPERTIES));
		} catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static String authWithKerberosMock(ContainerRequestContext containerRequest)
	{
		return "yurin"; 
	}

	public static String authWithKerberos(ContainerRequestContext containerRequest) throws Exception
	{


		String serverName = containerRequest.getUriInfo().getAbsolutePath().getHost();
		String protocol = containerRequest.getUriInfo().getAbsolutePath().getScheme();
		String spn = getSPN(serverName, protocol);
		System.out.println("NRKerberosAuthentication: spn==" + spn);
		Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "NRKerberosAuthentication: spn==" + spn);
		String authorizationHeader = containerRequest.getHeaderString("Authorization");
		String spnegoTkn = authorizationHeader.substring("Negotiate".length() + 1);
		System.out.println("NRKerberosAuthentication: authorizationHeader==" + authorizationHeader);
		Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "NRKerberosAuthentication: authorizationHeader==" + authorizationHeader);
		String serviceTkn = KerberosUtility.getSTFromSpenegoToken(spnegoTkn);
		AcceptResult acceptResult = KerberosUtility.accept(spn, serviceTkn);
		GSSCredential gssCred = acceptResult.getDelegatedCred();
		System.out.println("NRKerberosAuthentication: gssCred.getName()==" + gssCred.getName());
		Logger.getLogger (AuthenticationFilter.class.getName()).log(Level.INFO, "NRKerberosAuthentication: gssCred.getName()==" + gssCred.getName());		
		String username = gssCred.getName().toString().substring(0, gssCred.getName().toString().indexOf("@"));
		return username;
	}

	private static String getSPN(String serverName, String protocol)
	{
		String domain = getDomain().toUpperCase();
		StringBuilder builder = new StringBuilder();
		builder.append(protocol.toUpperCase()).append("/").append(serverName).append("@").append(domain);
		return builder.toString();
	}

	public static String getDocbase()
	{
		if (kerberosProperties == null)
		{
			kerberosProperties = new Properties();
			load();
		}

		return kerberosProperties.getProperty("docbase");
	}

	public static String getDomain()
	{
		if (kerberosProperties == null)
		{
			kerberosProperties = new Properties();
			load();
		}

		return kerberosProperties.getProperty("domain");
	}

	public static String getTimeout()
	{
		if (kerberosProperties == null)
		{
			kerberosProperties = new Properties();
			load();
		}

		return kerberosProperties.getProperty("jwt_timeout_in_min");
	}

	public static String getJWT_key()
	{
		if (kerberosProperties == null)
		{
			kerberosProperties = new Properties();
			load();
		}

		return kerberosProperties.getProperty("jwt_key");
	}

	public static void load()
	{
		try
		{
			kerberosProperties.load(NRKerberosUtils.class.getClassLoader().getResourceAsStream(KERBEROS_PROPERTIES));
		} catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
