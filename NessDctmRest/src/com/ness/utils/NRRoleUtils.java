package com.ness.utils;

import com.documentum.fc.client.IDfGroup;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.client.IDfUser;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfId;
import com.ness.objects.NRJsonObject;

public class NRRoleUtils
{
	public static boolean userInRole(String roleName, IDfSession session) throws DfException
	{

		boolean userInRole = false;

		String userSession = getUserSession(session);

		IDfGroup role = (IDfGroup) session
				.getObjectByQualification(NRConstants.QUERY_ROLE_BY_NAME + roleName + NRConstants.APOSTROPHE);

		IDfUser user = (IDfUser) session
				.getObjectByQualification(NRConstants.QUERY_USER_BY_LOGIN_NAME + userSession + NRConstants.APOSTROPHE);
		
		String username = user.getUserName();

		// check users that are not in groups
		int i = 0;
		while (true)
		{
			String nameFromRole = null;
			try
			{
				nameFromRole = role.getUsersNames(i);
			} catch (Exception e)
			{
				// do nothing, exception is thrown when names are finished and
				// no name at index i exists
			}
			if (nameFromRole == null)
			{
				break;
			} else
			{
				i++;
				if (username.equalsIgnoreCase(nameFromRole) || nameFromRole.contains(username))
				{
					return true;
				}
			}
		}

		// check users in groups
		i = 0;
		while (true)
		{
			String nameFromRole = null;
			try
			{
				nameFromRole = role.getAllUsersNames(i);
			} catch (Exception e)
			{
				// do nothing, exception is thrown when names are finished and
				// no name at index i exists
			}
			if (nameFromRole == null)
			{
				break;
			} else
			{
				i++;
				if (username.equalsIgnoreCase(nameFromRole) || nameFromRole.contains(username))
				{
					return true;
				}
			}
		}

		return userInRole;
	}
	
	public static String getUsernameFromSession(IDfSession session) throws DfException
	{
		
		String userSession = getUserSession(session);
		
		IDfUser user = (IDfUser) session
				.getObjectByQualification(NRConstants.QUERY_USER_BY_LOGIN_NAME + userSession + NRConstants.APOSTROPHE);
		
		//TODO don't commit code below
		if ("saaradmin".equals(userSession)){
			return "saaradmin_saaradmin";
		}
		
		String firstName = user.getString("first_name_heb").toString();
	    String lastName = user.getString("last_name_heb").toString();
		return  firstName + " " + lastName;
	}

	public static void checkNewObjectSenderNameChanged(IDfSession session, NRJsonObject jsonObject) throws Exception
	{
		boolean userCanChangeSenderName =  NRRoleUtils.userInRole(NRConstants.USER_CAN_CHANGE_SENDER_NAME, session);
		String username = getUsernameFromSession(session);
		Object senderName = jsonObject.getProperties().get(NRConstants.SENDER_NAME);
		boolean canChange = false;
		
		if (senderName instanceof String)
		{	
				if (!userCanChangeSenderName && !username.equalsIgnoreCase((String)senderName))
				{
					throw new Exception ("Unauthorized action"); 
				}
		}
		else if (senderName instanceof String[])
		{
			
			for (String name : (String[])senderName)
			{
				if (userCanChangeSenderName && name.equalsIgnoreCase(username))
				{
					canChange = false;
				}
			}
			if (!canChange)
			{
				throw new Exception ("Unauthorized action");
			}
		}
	}
	
	public static void checkExistingObjectSenderNameChanged(IDfSession session, NRJsonObject jsonNewObject ) throws Exception
	{
		boolean userCanChangeSenderName =  NRRoleUtils.userInRole(NRConstants.USER_CAN_CHANGE_SENDER_NAME, session);
		String currentObjectId = (String) jsonNewObject.getProperties().get(NRConstants.R_OBJECT_ID);
		IDfSysObject oldObject = (IDfSysObject) session.getObject(new DfId(currentObjectId));
		
		String senderNameOld = oldObject.getString(NRConstants.SENDER_NAME);
		String senderNameNew = (String)jsonNewObject.getProperties().get(NRConstants.SENDER_NAME);
		if (!userCanChangeSenderName && !senderNameOld.equalsIgnoreCase(senderNameNew)){
			throw new Exception ("Unauthorized action"); 
		}
	}
	
	/*
	 * This method gives the user name as it is in the DocBase .
	 */
	public static String getUserSession(IDfSession session)throws DfException
	{
		String userLoginName = session.getUser(null).getUserLoginName();
		return userLoginName;
	}
}
