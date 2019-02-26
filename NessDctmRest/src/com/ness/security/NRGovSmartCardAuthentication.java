package com.ness.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.container.ContainerRequestContext;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.codecs.Codec;
import org.owasp.esapi.codecs.OracleCodec;

import com.ness.communication.NRSessionManager;
import com.ness.objects.NRLoginInfo;
import com.ness.utils.NRConstants;

public class NRGovSmartCardAuthentication
{
	private static Codec ORACLE_CODEC = new OracleCodec();
	
	public static NRLoginInfo createLoginInfo(ContainerRequestContext containerRequest, HttpServletRequest httpRequest) throws Exception
	{
		HttpSession httpSession = httpRequest.getSession(true);
        NRLoginInfo loginInfo = new NRLoginInfo();
        loginInfo.setCanUseSuperUser(true);
        loginInfo.setUsername(ESAPI.encoder().encodeForSQL(ORACLE_CODEC, containerRequest.getHeaderString(NRConstants.EPPN)));
        loginInfo.setDocbase(ESAPI.encoder().encodeForSQL(ORACLE_CODEC, containerRequest.getHeaderString(NRConstants.DOCBASE)));
        boolean isValid = new NRSessionManager().isValidLoginAndSetSessionManager(loginInfo, httpSession);
        
        if(!isValid)
        {
        	loginInfo = null;
        }
        
		return loginInfo;
	}	
}
