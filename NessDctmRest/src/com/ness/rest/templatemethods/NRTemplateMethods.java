package com.ness.rest.templatemethods;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfId;
import com.ness.objects.NRJsonObject;
import com.ness.rest.userinfomethods.NRUserInfoMethods;
import com.ness.utils.NRConstants;
import com.ness.utils.NRObjectUtils;
import com.ness.utils.NROutlookFieldsUtils;
import com.ness.utils.NRUtils;

public class NRTemplateMethods
{
	/*********************************************
	* This method returns a list of available templates
	* @param session
	* @param unitId
	* @return List<NRJsonObject>
	**********************************************/	
	public List<NRJsonObject> getTemplates(IDfSession session, String objectId, String objectType) throws Exception
	{
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		IDfCollection col = null;
		IDfQuery query = new DfQuery();		
		String[] getTemplatesQueryParam = new String[3];
		getTemplatesQueryParam[0] = objectType;
		//getTemplatesQueryParam[1] = NRUtils.getUnitId(session, objectId);
		getTemplatesQueryParam[1] = (String) new NRUserInfoMethods().getUserName(session).get(0).getProperties().get("user_name");
		
		try
		{
			//Run query to get a list of all available templates
			//query.setDQL(NRUtils.buildText(NRConstants.QUERY_GET_TEMPLATES, getTemplatesQueryParam));
			
			query.setDQL(NRUtils.buildText(NRConstants.QUERY_FAVORITE_TEMPLATE, getTemplatesQueryParam));
			
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			//For each row get template id and name
			while(col.next())
			{
				NRJsonObject resultObject = new NRJsonObject();
				resultObject.getProperties().put(NRConstants.CODE, col.getString(NRConstants.R_OBJECT_ID));
				resultObject.getProperties().put(NRConstants.VALUE, col.getString(NRConstants.OBJECT_NAME));
				results.add(resultObject);
			}
			
			if (results.size() > 0)
			{
				NRJsonObject obj = new NRJsonObject();
				obj.getProperties().put("code", "xindex");
				obj.getProperties().put("value", results.size()+"");
				results.add(obj);
			}
			
			query.setDQL(NRUtils.buildText(getNoFavotiteQuery(results.size()), getTemplatesQueryParam));
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			while(col.next())
			{
				NRJsonObject resultObject = new NRJsonObject();
				resultObject.getProperties().put(NRConstants.CODE, col.getString(NRConstants.R_OBJECT_ID));
				resultObject.getProperties().put(NRConstants.VALUE, col.getString(NRConstants.OBJECT_NAME));
				results.add(resultObject);
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
			throw e;
		}
		finally
		{
			col.close();
		}		
		
		return results;
	}
	
	private String getNoFavotiteQuery(int size)
	{
		StringBuffer queryBuffer = new StringBuffer ();
		queryBuffer.append(NRConstants.QUERY_TEMPLATE_WITHOUT_FAVORITE_USER_HAS_NO_FAVORITES);
		
		if (size != 0)
		{
			queryBuffer.append(NRConstants.QUERY_TEMPLATE_WITHOUT_FAVORITE_USER_HAS_FAVORITES_ADDENDUM);
		}
		
		queryBuffer.append(NRConstants.QUERY_TEMPLATE_WITHOUT_FAVORITE_ORDER_BY_ADDENDUM);
		
		return new String(queryBuffer);
	}

	/*********************************************
	* This method will create a new object from a template
	* @param session
	* @param templateProperties
	**********************************************/		
	@SuppressWarnings("unchecked")
	public String createTemplate(IDfSession session,NRJsonObject templateProperties) throws Exception
	{
		//Get the destination folder ID
		List<String> iFolderId = (List<String>) templateProperties.getProperties().get(NRConstants.I_FOLDER_ID);
		String newObjectId = NRObjectUtils.copyObject(session,iFolderId.get(0),templateProperties.getProperties().get(NRConstants.ATTR_TEMPLATE).toString());
		
		//Add new properties to the object
		templateProperties.getProperties().put(NRConstants.R_OBJECT_ID, newObjectId);
		IDfSysObject templateObject = (IDfSysObject) session.getObject(new DfId((String) templateProperties.getProperties().get(NRConstants.ATTR_TEMPLATE)));
		String format = templateObject.getFormat().getName();
		
		if (NRConstants.DOCX.equals(format))
		{
			templateProperties.getProperties().put(NRConstants.IS_TEMPLATE, true);
		}
		
		templateProperties.getProperties().put(NRConstants.R_OBJECT_TYPE, templateProperties.getProperties().get(NRConstants.R_OBJECT_TYPE));
		
		//Handle sender as occasional
		List <String> senderIds = null;
		try
		{
			senderIds = resolveSenderIdsFromSenderNames((String)templateProperties.getProperties().get(NRConstants.SENDER_NAME), session);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		templateProperties.getProperties().put(NRConstants.SENDER_ID, senderIds);

		//Remove unused properties
		templateProperties.getProperties().remove(NRConstants.ATTR_TEMPLATE);
		//Put _NEW_ label for correct cancel checkout operation
		templateProperties.getProperties().put(NRConstants.NEW_OBJECT_LABEL, NRConstants.NEW_OBJECT_LABEL);
		
		NROutlookFieldsUtils.save(session, templateProperties);
		return NRObjectUtils.updateObject(session, templateProperties, false);
	}

	private List <String> resolveSenderIdsFromSenderNames(String senderName, IDfSession session) throws DfException
	{	
		List <String> senderIds = new ArrayList<String>();
		IDfQuery query = new DfQuery();
		IDfCollection col = null;
		List <String> names = Arrays.asList(senderName.split(NRConstants.COMMA)); 
		boolean resultSetEmpty = true;
		
		for (String name : names)
		{
			resultSetEmpty = true;
			String trimmedName = name.trim();
			String firstNameParam = trimmedName.substring(0, trimmedName.indexOf(" "));
			String lastNameParam = trimmedName.substring(trimmedName.indexOf(" ") + 1);			
			String [] params = {firstNameParam != null ? firstNameParam : "", lastNameParam != null ? lastNameParam : ""};
			query.setDQL(NRUtils.buildText(NRConstants.QUERY_USER_ADDRESS_BY_HEB_NAME, params));
			col = query.execute(session, IDfQuery.READ_QUERY);
			
			while (col.next())
			{
				resultSetEmpty = false;
				senderIds.add(col.getString(NRConstants.USER_ADDRESS));
			}
				
			if (resultSetEmpty)
			{
				senderIds.add(name);
			}
		}
		
		return senderIds;
	}
}