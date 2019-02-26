package com.ness.filters.communication.xss;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRSanitizingUtils;

@Provider
public class XssResponseFilter implements ContainerResponseFilter
{
	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
			throws IOException
	{
		if (isJson(responseContext))
		{
			List<NRJsonObject> jsonObjects = null;
			try
			{
				jsonObjects = (List<NRJsonObject>) responseContext.getEntity();
			} catch (Exception e)
			{
				return;
			}
			if (jsonObjects == null || jsonObjects.size() == 0)
			{
				return;
			}

			for (NRJsonObject jsonObject : jsonObjects)
			{
				Map<String, Object> properties = jsonObject.getProperties();
				Iterator<String> iterator = properties.keySet().iterator();
				while (iterator.hasNext())
				{
					String propertyKey = iterator.next();
					if (properties.get(propertyKey) instanceof String)
					{
						String propertyValue = (String) properties.get(propertyKey);
						propertyValue = NRSanitizingUtils.sanitize(propertyValue);
						properties.put(propertyKey, propertyValue);
					}
				}
			}
		}
	}

	boolean isJson(ContainerResponseContext responseContext)
	{
		if (responseContext.getMediaType() == null)
		{
			return false;
		}
		return responseContext.getMediaType().toString().contains("application/json");
	}

}