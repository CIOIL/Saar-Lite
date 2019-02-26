package com.ness.filters.communication;

import java.io.IOException;
import java.io.OutputStream;
import javax.annotation.Priority;
import javax.ws.rs.ext.Provider;
import javax.ws.rs.ext.WriterInterceptor;
import javax.ws.rs.ext.WriterInterceptorContext;
import org.apache.commons.io.output.ProxyOutputStream;

/**  
 *  created by Fedor Odinokin on 28.11.16
 *  This set of classes is used to wrap the ClientAbortException caused if the user aborts an ajax request on client side.
 *  The exception is intercepted and not logged or processed in any other manner since the behavior is within
 *  the scope of normal flow.
 * 
 * */

@Provider
@Priority(2)
public class ClientAbortExceptionWriterInterceptor implements WriterInterceptor
{
    @Override
    public void aroundWriteTo(WriterInterceptorContext context) throws IOException
    {
        context.setOutputStream(new ClientAbortExceptionOutputStream(context.getOutputStream()));
        try
        {
            context.proceed();
        }
        catch (Throwable t)
        {
            for (Throwable cause = t; cause != null; cause = cause.getCause())
            {
                if (cause instanceof org.apache.catalina.connector.ClientAbortException || cause instanceof ClientAbortException)
                {
                    return;
                }
            }
            throw t;
        }
    }

    public static class ClientAbortExceptionOutputStream extends ProxyOutputStream
    {
        public ClientAbortExceptionOutputStream(OutputStream out)
        {
            super(out);
        }

        protected void handleIOException(IOException e) throws IOException
        {
            throw new ClientAbortException(e);
        }
    }

    @SuppressWarnings("serial")
    public static class ClientAbortException extends IOException
    {
        public ClientAbortException(IOException e)
        {
            super(e);
        }
    }
}