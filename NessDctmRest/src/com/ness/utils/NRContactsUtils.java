package com.ness.utils;

import java.util.ArrayList;
import java.util.List;

import com.documentum.fc.client.IDfPersistentObject;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfType;
import com.documentum.fc.common.DfId;
import com.ness.objects.NRJsonObject;

public class NRContactsUtils
{
	public static NRJsonObject getContactsByTypeAndId(IDfSession session, String objectId, String objectType)
			throws Exception
	{
		NRJsonObject objectToReturn = new NRJsonObject();
			objectToReturn.getProperties().put(NRConstants.R_OBJECT_ID, objectId);
			String[] contactsAttributes = { "addressee_id", "addressee_name", "cc_id", "cc_name", "sender_id",
					"sender_name" };

			IDfPersistentObject dctmObject = (IDfPersistentObject) session.getObject(new DfId(objectId));
			
			IDfType dctmType = session.getType(objectType);
			
			for (String attrName : contactsAttributes){
				List<String> values = new ArrayList<>();
				for (int i = 0;i < dctmObject.getValueCount(attrName); i++){
					values.add(dctmObject.getRepeatingString(attrName, i));
				}
				objectToReturn.getProperties().put(attrName, values);
			}
			
			//add data from gov_outlook_fields
			NROutlookFieldsUtils.fillJsonFromDB(session, objectToReturn);
		

		return objectToReturn;
	}
}
