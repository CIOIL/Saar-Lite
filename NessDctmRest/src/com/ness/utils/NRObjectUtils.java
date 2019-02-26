package com.ness.utils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.documentum.com.DfClientX;
import com.documentum.com.IDfClientX;
import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfPersistentObject;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.client.IDfType;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfId;
import com.documentum.fc.common.DfTime;
import com.documentum.fc.common.IDfAttr;
import com.documentum.fc.common.IDfId;
import com.documentum.fc.common.IDfList;
import com.documentum.operations.IDfCopyNode;
import com.documentum.operations.IDfCopyOperation;
import com.documentum.operations.IDfCopyOperationInternal;
import com.documentum.operations.IDfDeleteOperation;
import com.documentum.operations.IDfOperationError;
import com.documentum.operations.impl.DfOperationError;
import com.ness.filters.object.NRObjectFilter;
import com.ness.objects.NRJsonObject;
import com.ness.rest.userinfomethods.NRUserInfoMethods;
import com.ness.services.NRSuperUserService;


public class NRObjectUtils 
{
	private static NRUserInfoMethods nRUserInfoMethods = new NRUserInfoMethods();

	public static List<NRJsonObject> getObjectsByDQL(IDfSession session, String dql) throws Exception
	{
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		IDfCollection col = null;
		IDfQuery query = new DfQuery();

		try
		{
			query.setDQL(dql);

			col = query.execute(session, IDfQuery.DF_READ_QUERY);

			// For each row
			while (col.next())
			{
				// Create new object, jersey will convert it automatically to XML
				NRJsonObject object = new NRJsonObject();

				// For each column set the attribute name and it's values to the object
				for (int index = 0; index < col.getAttrCount(); index++)
				{
					object.getProperties().put(col.getAttr(index).getName(), getAttributeValue(col, index));
				}

				results.add(object);
			}
		} catch (Exception e)
		{
			NRUtils.handleErrors(e);
		} finally
		{
			if (col != null)
			{
				col.close();
			}
		}

		return results;
	}

	private static Object getAttributeValue(IDfCollection col, int attributeIndex) throws Exception
	{
		Object value = null;
		List<Object> valuesList = new ArrayList<Object>();

		boolean found = false;
		String attributeName = col.getAttr(attributeIndex).getName();
		int attributeType = col.getAttrDataType(attributeName);
		int attributeValueCount = col.getValueCount(attributeName);

		switch (attributeType)
		{
		case IDfType.DF_BOOLEAN:
			found = true;

			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(col.getRepeatingBoolean(attributeName, valueNumber));
			}
			break;

		case IDfType.DF_INTEGER:
			found = true;

			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(col.getRepeatingInt(attributeName, valueNumber));
			}
			break;

		case IDfType.DF_STRING:
			found = true;

			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(col.getRepeatingString(attributeName, valueNumber));
			}
			break;
		}

		if (!found && attributeValueCount > 0)
		{
			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(col.getRepeatingString(attributeName, valueNumber));
			}
		}

		if (valuesList.size() == 1)
		{
			value = valuesList.get(0);
		} else if (valuesList.size() > 1)
		{
			value = valuesList;
		}

		return value;
	}

	/*
	 * This method return NRJsonObject with basic properties .
	 */
	public static String getSuperType(IDfSession session, String objectType)throws Exception
	{
		IDfType dctmType = session.getType(objectType);
		return dctmType.getSuperName();
	}
	
	public static NRJsonObject getObjectById(IDfSession session, String objectId)throws Exception		
	{
		// Get the object from DFC
		IDfPersistentObject dctmObject = (IDfPersistentObject) session.getObject(new DfId(objectId));
		// Get the object type attributes details
		String objectType = dctmObject.getType().getName();
		IDfType dctmType = session.getType(objectType);

		NRJsonObject object = getObject(session, objectId,  dctmObject ,dctmType ,objectType);
		return object;
	}
	
	
	/*
	 * This method returns NRJsonObject  with basic , and extra properties .
	 */
	public static NRJsonObject getObjecAndPathtByTypeAndId(IDfSession session, String objectId, String objectType ,
			List<String> extraPropertiesList)throws Exception			
	{
		// Get the object from DFC
		IDfPersistentObject dctmObject = (IDfPersistentObject) session.getObject(new DfId(objectId));

		// Get the object type attributes details
		IDfType dctmType = session.getType(objectType);
		
		NRJsonObject object = getObject(session, objectId,  dctmObject ,dctmType ,objectType);
		
		//if extra properties list includes folder path attribute 
		if(extraPropertiesList.contains(NRConstants.ATTR_FOLDER_PATH))
		{
			setFolderPath(object, dctmObject ,session, objectId, objectType);
		}
		return object;
	}
	
	/*
	 * This method sets the folder path property on the NRJsonObject. 
	 */
	private static void setFolderPath(NRJsonObject object, IDfPersistentObject dctmObject ,IDfSession session, String objectId, String objectType)throws Exception
	{
		try {
			IDfId folderId = ((IDfSysObject) dctmObject).getFolderId(0);
			IDfSysObject folder = (IDfSysObject) session.getObject(folderId);
			String folderPath = folder.getRepeatingString(NRConstants.ATTR_FOLDER_PATH, 0);
			object.getProperties().put(NRConstants.ATTR_FOLDER_PATH, folderPath);
		} catch (Exception e) {
			
		}
	}
	
	
	private static NRJsonObject getObject(IDfSession session, String objectId , IDfPersistentObject dctmObject , 
			IDfType dctmType ,String objectType)throws Exception
	{

		IDfQuery query = new DfQuery();
		IDfCollection col = null;
		NRJsonObject objectToReturn = null;


		// For each attribute, add the attribute to the XML object
		for (int index = 0; index < dctmType.getTypeAttrCount(); index++)
		{
			if (index == 0)
			{
				objectToReturn = new NRJsonObject();
				objectToReturn.getProperties().put(NRConstants.R_OBJECT_ID, objectId);
			}

			// Get the attribute details from DFC
			IDfAttr attribute = dctmType.getTypeAttr(index);

			// Check if the specific attribute needs to be return
			if (NRObjectFilter.getInstance().hasField(attribute.getName()))
			{
				//this attribute has to be querried from database 
				if(NRConstants.RELATION_COUNT.equals(attribute.getName()))
				{
					query.setDQL(NRConstants.QUERY_RELATION_COUNT_BY_TYPE_AND_ID.replace(NRConstants.PARAM_1, objectType).replace(NRConstants.PARAM_2, objectId));
					col = query.execute(session, IDfQuery.DF_READ_QUERY);
					while(col.next())
					{
						String relationCount = col.getString(NRConstants.RELATION_COUNT);
						objectToReturn.getProperties().put(NRConstants.RELATION_COUNT, relationCount);
					}
				}
				else
				{
					// Set the attribute and his values to the object
					objectToReturn.getProperties().put(attribute.getName(), getAttributeValue(dctmObject, attribute));
				}
			}
		}

		if (objectToReturn != null
				&& !NRUtils.isEmpty((String) objectToReturn.getProperties().get(NRConstants.R_LOCK_OWNER)))
		{
			boolean lockedByMe = false;

			if (session.getLoginUserName().equals(objectToReturn.getProperties().get(NRConstants.R_LOCK_OWNER)))
			{
				lockedByMe = true;
			}

			objectToReturn.getProperties().put(NRConstants.LOCKED_BY_ME, lockedByMe);
		}
		
		if(NRConstants.DM_CABINET.equals(dctmObject.getType().getName()) || NRConstants.GOV_UNIT_FOLDER.equals(dctmObject.getType().getName()))
			objectToReturn.getProperties().put(NRConstants.PRIORITY, "5");
		else if(NRConstants.GOV_FOLDER.equals(dctmObject.getType().getName()) || dctmObject.getType().isSubTypeOf(NRConstants.GOV_FOLDER))
			objectToReturn.getProperties().put(NRConstants.PRIORITY, "4");
		else if(NRConstants.DM_DOCUMENT.equals(dctmObject.getType().getName()) || NRConstants.GOV_DOCUMENT.equals(dctmObject.getType().getName()) || dctmObject.getType().isSubTypeOf(NRConstants.GOV_DOCUMENT))
			objectToReturn.getProperties().put(NRConstants.PRIORITY, "2"); 
		if(objectToReturn != null && !NRUtils.isEmpty((String) objectToReturn.getProperties().get(NRConstants.R_LOCK_OWNER)))
			objectToReturn.getProperties().put(NRConstants.PRIORITY, "3");
		
		// Add current user's permission to this object
		try
		{
			int permit = ((IDfSysObject) dctmObject).getPermit();
			objectToReturn.getProperties().put(NRConstants.USER_PERMIT, permit);
		} catch (ClassCastException e)
		{
			// IDfSysobject casting might failed, we don't need to handle it
			// the return object won't have the user_permit property
		}

		boolean user_subscribed = nRUserInfoMethods.isFavoriteObjectExist(session, objectId);
		objectToReturn.getProperties().put(NRConstants.USER_SUBSCRIBED, user_subscribed);
		
		if(objectId.startsWith(NRConstants.DOCUMENT_OBJECT_PREFIX) || objectId.startsWith(NRConstants.FOLDER_OBJECT_PREFIX))
		{
			String unitLayerName = getUnitLayerName(session, objectId);
			objectToReturn.getProperties().put(NRConstants.UNIT_LAYER_NAME, unitLayerName);
		}
		
		if(col != null)
		{
			col.close();
		}
		
		return objectToReturn;
	}

	private static String getUnitLayerName(IDfSession session, String objectId) throws DfException 
	{
		boolean successByNormalUser = true; 
		String unitLayerName = null;
		
		try
		{	
			IDfSysObject folderObject = (IDfSysObject) session.getObject(new DfId(objectId));
			boolean isUnitFolder = false;
			
			while (!isUnitFolder)
			{
				String type = folderObject.getTypeName();
				if (NRConstants.GOV_UNIT_FOLDER.equals(type))
				{
					unitLayerName = folderObject.getString(NRConstants.UNIT_LAYER_NAME);
					isUnitFolder = true;
				}
				else if (NRConstants.DM_CABINET.equals(type))
				{
					return null;
				}
				
				folderObject = (IDfSysObject) session.getObject(new DfId(folderObject.getString(NRConstants.I_FOLDER_ID)));
			}
		}
		catch (Exception e)
		{
			successByNormalUser = false;
		}
		
		if (!successByNormalUser)
		{
			IDfSession superUserSession = null;
			
			try
			{
				superUserSession = NRSuperUserService.getSuperUserSession(session.getDocbaseName(), session.getLoginInfo().getDomain());
				IDfSysObject folderObject = (IDfSysObject) superUserSession.getObject(new DfId(objectId));
				boolean isUnitFolder = false;

				while (!isUnitFolder)
				{
					String type = folderObject.getTypeName();

					if (NRConstants.GOV_UNIT_FOLDER.equals(type))
					{
						unitLayerName = folderObject.getString(NRConstants.UNIT_LAYER_NAME);
						isUnitFolder = true;
					}
					else if (NRConstants.DM_CABINET.equals(type))
					{
						return null;
					} 

					folderObject = (IDfSysObject) superUserSession.getObject(new DfId(folderObject.getString(NRConstants.I_FOLDER_ID)));
				}
			}
			catch (Exception e)
			{
				
			}
			finally
			{
				if (superUserSession != null)
				{
					superUserSession.disconnect();
				}
			}
		}
		
		return unitLayerName;
	}

	public static Object getAttributeValue(IDfPersistentObject dctmObject, IDfAttr attribute) throws Exception
	{
		Object value = null;
		List<Object> valuesList = new ArrayList<Object>();

		boolean found = false;
		String attributeName = attribute.getName();
		int attributeType = attribute.getDataType();
		int attributeValueCount = dctmObject.getValueCount(attributeName);

		switch (attributeType)
		{
		case IDfType.DF_BOOLEAN:
			found = true;

			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(dctmObject.getRepeatingBoolean(attributeName, valueNumber));
			}
			break;

		case IDfType.DF_INTEGER:
			found = true;

			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(dctmObject.getRepeatingInt(attributeName, valueNumber));
			}
			break;

		case IDfType.DF_STRING:
			found = true;

			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(dctmObject.getRepeatingString(attributeName, valueNumber));
			}
			break;
		}

		if (!found && attributeValueCount > 0)
		{
			for (int valueNumber = 0; valueNumber < attributeValueCount; valueNumber++)
			{
				valuesList.add(dctmObject.getRepeatingString(attributeName, valueNumber));
			}
		}

		if (valuesList.size() == 1)
		{
			value = valuesList.get(0);
		} else if (valuesList.size() > 1)
		{
			value = valuesList;
		}

		return value;
	}

	/******************************************************************
	 * This method will create or update a XML object using DFC
	 * @param session  (DFC session)
	 * @param object - JSON object
	 * @param isNew - The object is new or not
	 * @return
	 ******************************************************************/
	public static String updateObject(IDfSession session, NRJsonObject object, boolean isNew) throws Exception
	{
		String objectId = null;
		IDfSysObject dctmObject = null;
		String objectType = (String) object.getProperties().get(NRConstants.R_OBJECT_TYPE);

		// If the object is new create a new instance
		if (isNew)
		{
			// To link an object to a folder use the i_folder_id property
			if (objectType != null)
			{
				dctmObject = (IDfSysObject) session.newObject(objectType);
			}
		}
		// The object need to be updated so it must already have r_object_id
		// attribute, find it
		else
		{
			String currentObjectId = (String) object.getProperties().get(NRConstants.R_OBJECT_ID);

			if (currentObjectId != null)
			{
				dctmObject = (IDfSysObject) session.getObject(new DfId(currentObjectId));
			}
		}

		if (object.getProperties().get(NRConstants.SENDER_ID) == null)
		{
			if (object.getProperties().get(NRConstants.SENDER_NAME) == null)
			{
				object.getProperties().remove(NRConstants.SENDER_ID);
			} else
			{
				object.getProperties().put(NRConstants.SENDER_ID, object.getProperties().get(NRConstants.SENDER_NAME));
			}
		}

		if (object.getProperties().get(NRConstants.OBJECT_NAME) != null)
		{
			object.getProperties().put(NRConstants.OBJECT_NAME,
					NRUtils.processObjectNameLength((String) object.getProperties().get(NRConstants.OBJECT_NAME)));
		}

		Object[] objectPropertiesNames = object.getProperties().keySet().toArray();

		// Insert or update each property to the DCTM object
		for (int index = 0; index < objectPropertiesNames.length; index++)
		{
			String propertyName = (String) objectPropertiesNames[index];

			// Don't update r_object_id and r_object_type
			if (!NRConstants.R_OBJECT_ID.equals(propertyName) && !NRConstants.R_OBJECT_TYPE.equals(propertyName)
					&& !NRConstants.I_FOLDER_ID.equals(propertyName) && !NRConstants.R_CREATOR_NAME.equals(propertyName)
					&& !NRConstants.VALIDATION_CLASS.equals(propertyName)
					&& !NRConstants.NEW_OBJECT_LABEL.equals(propertyName))
			{
				setValueToAttribute(dctmObject, propertyName,
						NRUtils.objectToList(object.getProperties().get(propertyName)),
						getAttributeDataType(session, objectType, propertyName));
			}
		}

		if (object.getProperties().get(NRConstants.I_FOLDER_ID) != null
				&& object.getProperties().get(NRConstants.I_FOLDER_ID).toString().length() > 0)
		{
			if (!isNew)
			{
				ArrayList <String> folderIds = new ArrayList <String>();
				
				for (int index = 0; index < dctmObject.getFolderIdCount(); index++)
				{
					folderIds.add(dctmObject.getFolderId(index).getId());
				}
				
				for (int i = 0; i < folderIds.size(); i++)
				{
					try
					{
						dctmObject.unlink(folderIds.get(i));
					}
					catch (DfException e)
					{
						continue;
					}
				}
				
				@SuppressWarnings("unchecked")
				List<String> iFolderIds = (List<String>) object.getProperties().get(NRConstants.I_FOLDER_ID);
				
				for (int index = 0; index < iFolderIds.size(); index++)
				{
					try
					{
						dctmObject.link(iFolderIds.get(index));
					}
					catch (DfException e)
					{
						continue;
					}
				}
			}
			else
			{
				dctmObject.link(object.getProperties().get(NRConstants.I_FOLDER_ID).toString());
			}
		}
		// Set _NEW_ label for correct cancel checkout
		if (object.getProperties().get(NRConstants.NEW_OBJECT_LABEL) != null)
		{
			dctmObject.mark((String) object.getProperties().get(NRConstants.NEW_OBJECT_LABEL));
		}

		dctmObject.save();
		objectId = dctmObject.getObjectId().getId();

		return objectId;
	}

	public static String updatePersistentObject(IDfSession session, NRJsonObject object, boolean isNew) throws Exception
	{
		String objectId = null;
		IDfPersistentObject dctmObject = null;
		String objectType = (String) object.getProperties().get(NRConstants.R_OBJECT_TYPE);

		// If the object is new create a new instance
		if (isNew)
		{
			// To link an object to a folder use the i_folder_id property
			if (objectType != null)
			{
				dctmObject = (IDfPersistentObject) session.newObject(objectType);
			}
		}
		// The object need to be updated so it must already have r_object_id
		// attribute, find it
		else
		{
			String currentObjectId = (String) object.getProperties().get(NRConstants.R_OBJECT_ID);

			if (currentObjectId != null)
			{
				dctmObject = (IDfPersistentObject) session.getObject(new DfId(currentObjectId));
			}
		}

		Object[] objectPropertiesNames = object.getProperties().keySet().toArray();

		// Insert or update each property to the DCTM object
		for (int index = 0; index < objectPropertiesNames.length; index++)
		{
			String propertyName = (String) objectPropertiesNames[index];

			// Don't update r_object_id and r_object_type
			if (!NRConstants.R_OBJECT_ID.equals(propertyName) && !NRConstants.R_OBJECT_TYPE.equals(propertyName)
					&& !NRConstants.I_FOLDER_ID.equals(propertyName))
			{
				setValueToAttribute(dctmObject, propertyName,
						NRUtils.objectToList(object.getProperties().get(propertyName)),
						getAttributeDataType(session, objectType, propertyName));
			}
		}

		dctmObject.save();
		objectId = dctmObject.getObjectId().getId();

		return objectId;
	}

	/******************************************************************
	 * This method sets the given list of values to an object attribute
	 * @param dctmObject
	 * @param attributeName
	 * @param attributeValues
	 * @param attributeType
	 * @throws Exception
	 ******************************************************************/
	private static void setValueToAttribute(IDfPersistentObject dctmObject, String attributeName,
			List<String> attributeValues, int attributeType) throws Exception
	{
		String attributeValue = null;

		// If the attribute type couldn't be resolved
		if (attributeType == -1)
		{
			System.out.println("attributeName" + attributeName);
			throw new Exception(NRConstants.ERROR_ATTRIBUTE_TYPE.replace(NRConstants.PARAM_1, attributeName));
		}

		// If the attribute is repeating
		if (dctmObject.isAttrRepeating(attributeName))
		{
			// Remove previous values
			dctmObject.removeAll(attributeName);

			// Add the new values to the repeating attribute
			for (int index = 0; index < attributeValues.size(); index++)
			{
				attributeValue = attributeValues.get(index);

				// Different handling for each type of data
				switch (attributeType)
				{
				case IDfType.DF_BOOLEAN:
					if (NRConstants.FALSE.equals(attributeValue.toLowerCase())
							| NRConstants.F.equals(attributeValue.toLowerCase())
							| NRConstants.ZERO.equals(attributeValue))
					{
						dctmObject.appendBoolean(attributeName, false);
					}

					if (NRConstants.TRUE.equals(attributeValue.toLowerCase())
							| NRConstants.T.equals(attributeValue.toLowerCase())
							| NRConstants.ONE.equals(attributeValue))
					{
						dctmObject.appendBoolean(attributeName, true);
					}
					break;

				case IDfType.DF_INTEGER:
					dctmObject.appendInt(attributeName, Integer.parseInt(attributeValue));
					break;

				case IDfType.DF_STRING:
					dctmObject.appendString(attributeName, NRSanitizingUtils.sanitize(attributeValue));
					break;

				case IDfType.DF_ID:
					IDfId newId = new DfId(attributeValue);
					dctmObject.appendId(attributeName, newId);
					break;

				case IDfType.DF_TIME:
					if (attributeValue != null && attributeValue.length() > 0)
					{
						String dfcPropertiesDateFormat = NRDfcPropertiesDateFormat.getDfcPropertiesDateFormat();
						SimpleDateFormat df = new SimpleDateFormat(dfcPropertiesDateFormat);
						Date date = df.parse(attributeValue);
						DfTime newTime = new DfTime(date);

						if (newTime.isValid())
						{
							dctmObject.appendTime(attributeName, newTime);
						}
					}
					
					break;

				case IDfType.DF_DOUBLE:
					dctmObject.appendDouble(attributeName, Double.parseDouble(attributeValue));
					break;
				}
			}
		}
		// Attribute is not repeating and there is only one value to add
		else if (attributeValues != null && attributeValues.size() == 1)
		{
			attributeValue = attributeValues.get(0);

			// Different handling for each type of data
			switch (attributeType)
			{
			case IDfType.DF_BOOLEAN:
				if (NRConstants.FALSE.equals(attributeValue.toLowerCase())
						| NRConstants.F.equals(attributeValue.toLowerCase()) | NRConstants.ZERO.equals(attributeValue))
				{
					dctmObject.setBoolean(attributeName, false);
				}

				if (NRConstants.TRUE.equals(attributeValue.toLowerCase())
						| NRConstants.T.equals(attributeValue.toLowerCase()) | NRConstants.ONE.equals(attributeValue))
				{
					dctmObject.setBoolean(attributeName, true);
				}
				break;

			case IDfType.DF_INTEGER:
				dctmObject.setInt(attributeName, Integer.parseInt(attributeValue));
				break;

			case IDfType.DF_STRING:
				dctmObject.setString(attributeName, NRSanitizingUtils.sanitize(attributeValue));
				break;

			case IDfType.DF_ID:
				IDfId newId = new DfId(attributeValue);
				dctmObject.setId(attributeName, newId);
				break;

			case IDfType.DF_TIME:
				if (attributeValue != null && attributeValue.length() > 0)
				{
					String dfcPropertiesDateFormat = NRDfcPropertiesDateFormat.getDfcPropertiesDateFormat();
					SimpleDateFormat df = new SimpleDateFormat(dfcPropertiesDateFormat);
					Date date = df.parse(attributeValue);
					DfTime newTime = new DfTime(date);
					
					if (newTime.isValid())
					{
						dctmObject.setTime(attributeName, newTime);
					}
				}
				
				break;

			case IDfType.DF_DOUBLE:
				dctmObject.setDouble(attributeName, Double.parseDouble(attributeValue));
				break;
			}
		}
	}

	/******************************************************************
	 * This method returns the attribute data type from an object type
	 * @param session
	 * @param objectType
	 * @param attrbuteName
	 * @return
	 * @throws Exception
	 ******************************************************************/
	private static int getAttributeDataType(IDfSession session, String objectType, String attrbuteName) throws Exception
	{
		int dataType = -1;

		IDfType dctmType = session.getType(objectType);

		// First try to use DFC getAttrDataType, most times it won't work
		try
		{
			dataType = dctmType.getAttrDataType(attrbuteName);
		} catch (DfException e)
		{

			dataType = -1;
		}

		// The data type couldn't be found, look for the specific attribute
		if (dataType == -1)
		{
			for (int index = 0; index < dctmType.getTypeAttrCount(); index++)
			{
				IDfAttr oAttr = dctmType.getTypeAttr(index);

				// if the attribute was found, get his data type
				if (oAttr != null && attrbuteName.equals(oAttr.getName()))
				{
					dataType = oAttr.getDataType();
					break;
				}
			}
		}

		return dataType;
	}

	/******************************************************************
	 * This method create a copy of an object (strObjectId) within a folder
	 * (strFolderId) the attribute data type from an object type
	 * @param session
	 * @param strFolder  - destination folder
	 * @param strObjectId  - source object
	 * @return strNewId - the new object id
	 * @throws Exception
	 ******************************************************************/
	public static String copyObject(IDfSession session, String strFolderId, String strObjectId) throws Exception
	{
		String strNewId = null;

		IDfCopyOperation copyOperation = new DfClientX().getCopyOperation();

		if (copyOperation instanceof IDfCopyOperationInternal)

		{
			IDfCopyOperationInternal copyOperationInt = (IDfCopyOperationInternal) copyOperation;
			copyOperationInt.enableRemoteMode(true);
		}

		DfId objectId = new DfId(strObjectId);
		IDfSysObject templateObj = (IDfSysObject) session.getObject(objectId);

		DfId folderId = new DfId(strFolderId);
		copyOperation.setDestinationFolderId(folderId);

		IDfCopyNode copyNode = null;
		copyNode = (IDfCopyNode) copyOperation.add(templateObj);

		IDfCopyOperationInternal copyOpInternal = (IDfCopyOperationInternal) copyOperation;
		copyOpInternal.setLifecycleState(2);

		boolean executeSucceeded = copyOperation.execute();

		if (executeSucceeded)
		{
			IDfId newId = copyNode.getNewObjectId();
			strNewId = newId.toString();
		} else
		{
			String strCopyExecuteError = NRConstants.EMPTY;
			IDfList list = copyOperation.getErrors();
			int count = list.getCount();

			if (count > 0)
			{
				IDfOperationError opErr = (IDfOperationError) list.get(0);
				strCopyExecuteError = opErr.getMessage();
			}

			throw new Exception(strCopyExecuteError);
		}

		return strNewId;
	}

	public static String deleteObjects(IDfSession session, ArrayList<IDfSysObject> objectsToDelete) throws DfException
	{
		String result = "";
		boolean successful = false;
		IDfClientX clientx = new DfClientX();
		IDfDeleteOperation deleteOperation = clientx.getDeleteOperation();

		for (IDfSysObject objectToDelete : objectsToDelete)
		{
			deleteOperation.add(objectToDelete);
		}

		deleteOperation.setSession(session);
		deleteOperation.setDeepFolders(true);
		deleteOperation.setVersionDeletionPolicy(IDfDeleteOperation.ALL_VERSIONS);
		successful = deleteOperation.execute();

		if (!successful)
		{
			StringBuffer buf = new StringBuffer();

			for (int i = 0; i < deleteOperation.getErrors().getCount(); i++)
			{
				DfOperationError error = (DfOperationError) deleteOperation.getErrors().get(i);
				buf.append(error.getMessage() + System.getProperty("line.separator"));
			}

			result = new String(buf);
		}

		return result;
	}

	public static List<String> getRepeatingAttribute(IDfSession session, String objectId, String attrName)
	{
		List<String> values = new ArrayList<>();

		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
			for (int i = 0; i < dctmObject.getValueCount(attrName); i++)
			{
				values.add(dctmObject.getRepeatingString(attrName, i));
			}
		} catch (Exception e)
		{
			e.printStackTrace();
		}

		return values;
	}

	public static List<NRJsonObject> getDocumentVersions(IDfSession session, String objectId) throws Exception
	{
		String[] params = { objectId };
		IDfCollection iDfCollection = NRQueryUtils.executeSelectQuery(session, NRConstants.QUERY_DOCUMENT_VERSIONS,
				params);
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		while (iDfCollection.next())
		{
			NRJsonObject resultObject = new NRJsonObject();
			int labelCount = iDfCollection.getValueCount(NRConstants.R_VERSION_LABEL);
			if (labelCount > 1)
			{
				StringBuilder labelBuilder = new StringBuilder();
				for (int i = 0; i < labelCount; i++)
				{
					labelBuilder.append(",").append(iDfCollection.getRepeatingString(NRConstants.R_VERSION_LABEL, i));
				}
				resultObject.getProperties().put(NRConstants.VERSION, labelBuilder.substring(1));
			} else
			{
				resultObject.getProperties().put(NRConstants.VERSION,
						iDfCollection.getString(NRConstants.R_VERSION_LABEL));
			}

			results.add(resultObject);
		}
		return results;
	}
}
