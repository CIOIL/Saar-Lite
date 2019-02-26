package com.ness.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfPersistentObject;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfType;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.IDfAttr;
import com.ness.objects.NRJsonObject;

public class NROutlookFieldsUtils
{
	public static String [] outlookFields = {"outlook_id","full_name","first_name","last_name",
			                "phone_number","fax_number","full_address","city_address","job_title",
			                "alias","postal_code","company_name","department","initials","title",
			                "pager","state_province","home_phone"};
	
	public static int [] fieldLenghts = {512,512,512,512,512,512,512,512,512,512,512,512,512,64,512,32,512,10};
	
	public static String [] contactTypes = {"sender", "addressee", "cc"};
	
	public static void save (IDfSession session, NRJsonObject object) throws Exception{
		Map<String, Object> properties = object.getProperties();
		for (String type : contactTypes){
			saveContact(session, properties, type);
		}
		
	}
	
	/** Saves all senders or all addressees or all ccs. 
	 * @param session
	 * @param templateProperties
	 * @param type
	 * @throws Exception 
	 */
	@SuppressWarnings("unchecked")
	private static void saveContact(IDfSession session,Map<String, Object> properties, String type) throws Exception
	{
		Map<String, List<String>> field2Values = new HashMap<>();
		if ("sender".equalsIgnoreCase(type)){
			if (properties.get(type + "_name") instanceof String){ // single sender_name 
				for (int i = 2; i < outlookFields.length; i++){
					properties.remove(type + "_" + outlookFields[i]);
				}
				return;
			}
		}
		List<String> ids = (List<String>)properties.get(type + "_id");
		if (ids == null || ids.size() == 0){
			for (int i = 2; i < outlookFields.length; i++){
				properties.remove(type + "_" + outlookFields[i]);
			}
			return;
		}
		field2Values.put("outlook_id", ids);
		List<String> names = (List<String>)properties.get(type + "_name");
		if (names != null)
		{
			field2Values.put("full_name", names);
		}
		for (int i = 2; i < outlookFields.length; i++){
			if (properties.get(type + "_" + outlookFields[i]) == null){
				field2Values.put(outlookFields[i], createListWithNulls(ids.size()));
			} else {
				field2Values.put(outlookFields[i], (List<String>)properties.get(type + "_" + outlookFields[i]));
			}
		}
			
		for (int i = 0; i < ids.size(); i++){
			IDfPersistentObject outlookFieldsObject = (IDfPersistentObject) session.newObject(NRConstants.GOV_OUTLOOK_FIELDS);
			for (String name : outlookFields){
				List<String> lp = field2Values.get(name);
				if (lp!=null)
				{

					int attrLength = fieldLenghts[Arrays.asList(outlookFields).indexOf(name)];
					String	property = lp.get(i);
					if (property != null && property.length() > attrLength){
						property = property.substring(0, attrLength);
					}
					outlookFieldsObject.setString(name, isUndefined(property) ? "undefined" : property);
				}
			}
			outlookFieldsObject.setInt("contact_type", 1);
			try
			{
				outlookFieldsObject.save();
			}
			catch (DfException e)
			{
				//print nothing
			}
		}
		
		// remove outlook properties from json as we do not need them anymore
		for (int i = 2; i < outlookFields.length; i++){
			properties.remove(type + "_" + outlookFields[i]);
		}
		
		
	}

	private static List<String> createListWithNulls(int size)
	{
		List<String> listWithNulls = new ArrayList<>();
		for (int i = 0; i < size; i++){
			listWithNulls.add(null);
		}
		return listWithNulls;
	}

	private static boolean isUndefined (String property){
		if (property == null || property.length() == 0){
			return true;
		}
		return false;
	}

	@SuppressWarnings("unchecked")
	public static void fillJsonFromDB(IDfSession session, NRJsonObject objectToReturn) throws Exception
	{
		Map <String, Object> properties = objectToReturn.getProperties();
		for (String type : contactTypes){
			if ("sender".equalsIgnoreCase(type)){
				continue;
			}
			List<String> ids = (List<String>)properties.get(type + "_id");
			if(ids.size() == 0){
				properties.remove(type + "_id");
				properties.remove(type + "_name");
				continue;
			}
			Map<String, Map<String, String>> id2fields = new HashMap<>();
			for(String id : ids){
				Map<String, String> fields = getOutlookFieldsById(session, id);
				id2fields.put(id, fields);
			}
			for (int i = 2; i < outlookFields.length; i++){
				List<String> list = new ArrayList<>();
				Iterator<String> iteratorId2fields = id2fields.keySet().iterator();
				while (iteratorId2fields.hasNext()){
					Map<String, String> fields = id2fields.get(iteratorId2fields.next());
					list.add(fields.get(outlookFields[i]));
				}
				properties.put(type + "_" + outlookFields[i], list);
			}
		}
		
		
//		Map <String, Object> properties = objectToReturn.getProperties();
//		List<String> addresseeIds = (List<String>)properties.get(NRConstants.ATTR_ADDRESSEE_ID);
//		Map<String, Map<String, String>> id2fields = new HashMap<>();
//		for(String addresseeId : addresseeIds){
//			Map<String, String> fields = getOutlookFieldsById(session, addresseeId);
//			id2fields.put(addresseeId, fields);
//		}
//		for (int i = 2; i < outlookFields.length; i++){
//			List<String> list = new ArrayList<>();
//			String propertyName = "addressee_" + outlookFields[i]; 
//			Iterator<String> iteratorId2fields = id2fields.keySet().iterator();
//			while (iteratorId2fields.hasNext()){
//				Map<String, String> fields = id2fields.get(iteratorId2fields.next());
//				list.add(fields.get(propertyName));
//			}
//			properties.put(propertyName, list);
//		}
//		
//		List<String> ccIds = (List<String>)properties.get(NRConstants.ATTR_CC_ID);
//		id2fields = new HashMap<>();
//		for(String ccId : ccIds){
//			Map<String, String> fields = getOutlookFieldsById(session, ccId);
//			id2fields.put(ccId, fields);
//		}
//		for (int i = 2; i < outlookFields.length; i++){
//			List<String> list = new ArrayList<>();
//			String propertyName = "cc_" + outlookFields[i]; 
//			Iterator<String> iteratorId2fields = id2fields.keySet().iterator();
//			while (iteratorId2fields.hasNext()){
//				Map<String, String> fields = id2fields.get(iteratorId2fields.next());
//				list.add(fields.get(propertyName));
//			}
//			properties.put(propertyName, list);
//		}
		
	}
	
	public static Map<String, String> getOutlookFieldsById(IDfSession session, String outlook_id) throws Exception
	{
		Map<String, String> fields = new HashMap<String, String>();
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		try
		{
			query.setDQL(NRConstants.QUERY_OUTLOOK_FIELDS.replace(NRConstants.PARAM_1, outlook_id.replace(NRConstants.APOSTROPHE, NRConstants.DOUBLE_APOSTROPHE)));
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			//If result was found
			if(col.next())
			{
				for (String field : outlookFields){
					String value = col.getString(field);
					fields.put(field, "undefined".equalsIgnoreCase(value)? null : value);
				}
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		finally
		{
			if (col != null)
			{
				col.close();
			}
		}		
		
		return fields;
	}

}
