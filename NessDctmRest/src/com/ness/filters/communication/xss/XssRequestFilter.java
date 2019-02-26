package com.ness.filters.communication.xss;

import java.io.IOException;
import java.io.InputStream;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;

import org.apache.commons.io.IOUtils;

import com.ness.utils.NRSanitizingUtils;
import com.ness.utils.NRUtils;

@Provider  //commented in order to stop trigger
public class XssRequestFilter implements ContainerRequestFilter 
{
	
	@Override
    public void filter(ContainerRequestContext request) {
        if (isJson(request)) {
            try {
                //String json = IOUtils.toString(request.getEntityStream(), "UTF-8");
            	String json = NRUtils.getRequestBody(request);
            	if (json == null || json.length() == 0){
    				return;
    			}
                // do whatever you need with json
                
                json = NRSanitizingUtils.sanitize(json);

                // replace input stream for Jersey as we've already read it
                InputStream in = IOUtils.toInputStream(json);
                request.setEntityStream(in);

            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }

    }

    boolean isJson(ContainerRequestContext request) {
    	if (request.getMediaType() == null){
    		return false;
    	}
        return request.getMediaType().toString().contains("application/json"); 
    }	
}