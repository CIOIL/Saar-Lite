package com.ness.utils;

import com.documentum.fc.client.IDfSession;
import com.ness.objects.NRJsonObject;

public class NRObjectPermissionUtils {

	public static final String GOV_USER = "gov_user";
	public static final String USER_NAME = "user_name";
	
	
	public static String getUserName(IDfSession session)
	{
		NRJsonObject user = null;
		try
		{
			String userSession = NRRoleUtils.getUserSession(session);
			String authorId = session.getUserByLoginName(userSession , session.getLoginInfo().getDomain()).getObjectId().getId();
			user = NRObjectUtils.getObjectById(session,authorId);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		return user.getProperties().get(USER_NAME).toString();
	}
}
