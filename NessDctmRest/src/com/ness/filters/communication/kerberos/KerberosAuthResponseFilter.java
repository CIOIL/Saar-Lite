package com.ness.filters.communication.kerberos;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

@Provider
public class KerberosAuthResponseFilter implements ContainerResponseFilter {

	@Context HttpServletResponse resp;
	@Override
	public void filter(ContainerRequestContext request, ContainerResponseContext response) throws IOException {
		
 		if (request.getHeaderString("sendNegotiate") != null){
			response.setStatus(401);
			response.getHeaders().add("WWW-Authenticate", "Negotiate");
			Logger.getLogger (KerberosAuthResponseFilter.class.getName()).log(Level.INFO, "added response header WWW-Authenticate with value: Negotiate");
			return;
		}
//		
//		String kerberosUsername = request.getHeaderString("kerberosUsername");
//		if (kerberosUsername != null){
//			String jwToken = NRJWTUtils.generateJWToken(kerberosUsername);
//			//response.getHeaders().add("kauth", jwToken);
//			response.getHeaders().add("Set-Cookie", NRConstants.KJWT + "="+jwToken);
//			//response.getHeaders().add("Set-Cookie", new NewCookie(NRConstants.KJWT, jwToken));
////			NewCookie kjwtCookie = new NewCookie(NRConstants.KJWT, jwToken);
////			response.getCookies().put(NRConstants.KJWT, kjwtCookie);
//			
//			Cookie cookie = new Cookie(NRConstants.KJWT, jwToken);
//			resp.addCookie(cookie);
//			resp.addHeader("Set-Cookie", NRConstants.KJWT + "="+jwToken);
//		}
	}

}
