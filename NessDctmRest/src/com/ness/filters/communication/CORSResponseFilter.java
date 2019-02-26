package com.ness.filters.communication;

import java.io.IOException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.Provider;

@Provider
public class CORSResponseFilter implements ContainerResponseFilter
{
	private static final String HEADERS = "X-Requested-With, Content-Type, Content-Disposition, X-Codingpedia, "
		   	                            + "Authorization, authenticationType, authentication, eppn, docbase";
	private static final String EXPOSE_HEADERS = "Content-Disposition";  
	private static final String OPTIONS = "GET, POST";
	private static final String ASTRIX = "*";
	private static final String ACCESS_CONTROL_ALLOW_HEADERS = "Access-Control-Allow-Headers";
	private static final String ACCESS_CONTROL_ALLOW_METHODS = "Access-Control-Allow-Methods";
	private static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
	private static final String ACCESS_CONTROL_EXPOSE_HEADERS = "Access-Control-Expose-Headers";

	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException
	{
		MultivaluedMap<String, Object> headers = responseContext.getHeaders();

		headers.add(ACCESS_CONTROL_ALLOW_ORIGIN, ASTRIX);		
		headers.add(ACCESS_CONTROL_ALLOW_METHODS, OPTIONS);			
		headers.add(ACCESS_CONTROL_ALLOW_HEADERS, HEADERS);
		headers.add(ACCESS_CONTROL_EXPOSE_HEADERS, EXPOSE_HEADERS);
	}
}