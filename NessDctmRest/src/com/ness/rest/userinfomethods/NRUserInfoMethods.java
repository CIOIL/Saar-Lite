package com.ness.rest.userinfomethods;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfPersistentObject;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.client.IDfType;
import com.documentum.fc.client.IDfUser;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfId;
import com.ness.objects.NRJsonObject;
import com.ness.rest.objectmethods.NRObjectMethods;
import com.ness.rest.vamethods.NRValueAssitanceMethods;
import com.ness.utils.NRConstants;
import com.ness.utils.NRObjectTypeConfigInstance;
import com.ness.utils.NRObjectUtils;
import com.ness.utils.NRRoleUtils;
import com.ness.utils.NRRolesConfigInstance;
import com.ness.utils.NRUtils;

public class NRUserInfoMethods
{	
	/*********************************************
	* This method returns a list of the user last used objects
	* @param session
	* @return List<NRJsonObject>
	**********************************************/		
	public List<NRJsonObject> getUserCheckedoutObjects(IDfSession session) throws Exception
	{
		List<NRJsonObject> userLastObjects = new ArrayList<NRJsonObject>();		
		List<NRJsonObject> lastObjectsResults = NRObjectUtils.getObjectsByDQL(session, NRConstants.QUERY_CHECKED_OUT_DOCUMENTS.replaceAll(NRConstants.PARAM_1, session.getLoginUserName()));
		
		//Add each document to the list
		for(int index = 0 ; index < lastObjectsResults.size() ; index++)
		{
			NRJsonObject currentObject = lastObjectsResults.get(index);
			
		//	IDfPersistentObject dctmObject = (IDfPersistentObject) session.getObject(new DfId((String) currentObject.getProperties().get(NRConstants.R_OBJECT_ID))); 
		//	String objectType = dctmObject.getType().getName();
			
			userLastObjects.add(NRObjectUtils.getObjectById(session, (String) currentObject.getProperties().get(NRConstants.R_OBJECT_ID)));
		}
		
		return userLastObjects;
	}	
	
	/*********************************************
	* This method returns a list of the user last used objects
	* @param session
	* @return List<NRJsonObject>
	**********************************************/		
	public List<NRJsonObject> getUserLastObjects(IDfSession session) throws Exception
	{
		List<NRJsonObject> userLastObjects = new ArrayList<NRJsonObject>();		
		List<NRJsonObject> lastObjectsResults = NRObjectUtils.getObjectsByDQL(session, NRConstants.QUERY_LAST_DOCUMENTS.replaceAll(NRConstants.PARAM_1, session.getLoginUserName()));
		
		//Add each document to the list
		for(int index = 0 ; index < lastObjectsResults.size() ; index++)
		{
			NRJsonObject currentObject = lastObjectsResults.get(index);
			String objID = (String) currentObject.getProperties().get(NRConstants.R_OBJECT_ID);
		
			IDfPersistentObject dctmObject = (IDfPersistentObject) session.getObject(new DfId(objID)); 
			String objectType = dctmObject.getType().getName();
			
			//adding the folder path to the extra properties list:
			List<String> extraProperies = new ArrayList<String>();
			extraProperies.add(NRConstants.ATTR_FOLDER_PATH);
			NRJsonObject newNRJobj = NRObjectUtils.getObjecAndPathtByTypeAndId(session, objID ,objectType , extraProperies);
			userLastObjects.add(newNRJobj);
		}
		
		return userLastObjects;
	}

	/*********************************************
	* This method returns a list of the user favorites
	* Only folders and cabinets will be returned
	* @param session
	* @return List<NRJsonObject>
	**********************************************/	
	public List<NRJsonObject> getUserFavorites(IDfSession session) throws Exception
	{
		List<NRJsonObject> userFavorites = new ArrayList<NRJsonObject>();
		
		userFavorites = creatUserFavoritesList(session, false);
		
		return userFavorites;
	}
		
	/*********************************************
	* This method will add a favorite to the user favorites list
	* We'll build a JSON object to create a new dm_relation.
	* By creating a new dm_relation with relation_name = 'dm_subscription'
	* we declare a new favorite object. 
	* The parent_id is the document/folder child id is the user r_object_id
	* @param session
	* @param objectId: The id of the object that needs to be added 
	**********************************************/	
	public void addFavoriteObject(IDfSession session, String objectId) throws Exception
	{
		NRJsonObject relationObject = new NRJsonObject();
		String childId = null;

		//Retrieving the user r_object_id 
		childId = getUserObjectId(session);
		
		//Initializing the JSON object property
		relationObject.getProperties().put(NRConstants.CHILD_ID, childId);
		relationObject.getProperties().put(NRConstants.R_OBJECT_TYPE, NRConstants.DM_RELATION);
		relationObject.getProperties().put(NRConstants.PARENT_ID, objectId);
		relationObject.getProperties().put(NRConstants.RELATION_NAME_KEY, NRConstants.RELATION_NAME_VALUE);
		relationObject.getProperties().put(NRConstants.PERMANENT_LINK, NRConstants.PERMANNENT_LINK);
		relationObject.getProperties().put(NRConstants.ORDER_NO, getUserMaxFavoritesOrderNo(session, childId) + 1);

		//Create a new favorite object using the creation utility
		NRObjectUtils.updatePersistentObject(session, relationObject, true);
	}

	/*********************************************
	* This method will check if an object is already in
	* the user favorites list
	* @param session
	* @param objectId: The id of the object that needs to be added 
	**********************************************/		
	public boolean isFavoriteObjectExist(IDfSession session, String objectId) throws Exception
	{
		String[] getTemplatesQueryParam = new String[2];
		getTemplatesQueryParam[0] = getUserObjectId(session);
		getTemplatesQueryParam[1] = objectId;
		String dql  = NRUtils.buildText(NRConstants.QUERY_IS_FAVORITE_EXITS, getTemplatesQueryParam);
		List<NRJsonObject> result = NRObjectUtils.getObjectsByDQL(session, dql);
		
		return !result.isEmpty();
	}
	
	/*********************************************
	* This function will retrieve the user max favorites order number
	* commonly used for a new favorite creation (to tell the next order_no)
	* @param session
	* @param userObjectId
	* @return Max order_no
	* @throws Exception
	**********************************************/
	private int getUserMaxFavoritesOrderNo(IDfSession session,String userObjectId) throws Exception
	{
		int maxNumber = 0;
		
		String[] getMaxQueryParam = new String[1];
		getMaxQueryParam[0] = getUserObjectId(session);
		
		String dql  = NRUtils.buildText(NRConstants.QUERY_MAX_FAVORITES_ORDER_NO, getMaxQueryParam);
		List<NRJsonObject> result = NRObjectUtils.getObjectsByDQL(session, dql);

		//Check if there is a result, if no we'll return 0
		if(result.size() == 1)
		{
			maxNumber = (int)result.get(0).getProperties().get(NRConstants.ORDER_NO);
		}
		
		return maxNumber;	
	}
	
	/*********************************************
	* This function will return the content of the 
	* user home directory. 
	* If no home directory is selected, list all cabinets
	* @param session
	* @throws Exception
	**********************************************/	
	public List<NRJsonObject> getUserHomeFolder(IDfSession session) throws Exception
	{
		return NRObjectUtils.getObjectsByDQL(session, NRConstants.QUERY_DEFULT_LOCATION);
	}
	
	/*********************************************
	* This function will update the user favorites 
	* according to the JSON it will receive.
	* The JSON structure is as follow:
	* {
	*	properties:{
	*		updateObjects: [
	*				{
	*					r_object_id:'0b00000001',
	*					order_no: 23
	*				},
	*				{
	*					r_object_id:'0b00000002',
	*					order_no: 44
	*				}
	*		],
	*		deletedObjects: ['0b00000003','0b00000004']
	*	}
	* }
	* 
	* updateObjects - Contains an array of objects that needs 
	* 				 to be update with their new order_no.
	* deleteObjects - Contains an array of r_object_ids that
	* 				  needs to be deleted.
	* 
	* @param session
	* @param updateData - the updates that needs to be applied
	* @throws Exception
	**********************************************/		
	@SuppressWarnings("unchecked")
	public void updateUserFavorites(IDfSession session, NRJsonObject updateData) throws Exception
	{
		List<String> objectsToDelete = (List<String>) updateData.getProperties().get(NRConstants.DELETE_OBJECTS);
		deleteFavorites(session, objectsToDelete);
		List<HashMap<String, Object>> objectsToUpdate = (List<HashMap<String, Object>>)updateData.getProperties().get(NRConstants.UPDATE_OBJECTS);
		updateFavoritesOrder(session, objectsToUpdate);
	}
	
	/*********************************************
	* This function will delete unwanted favorites
	* @param session
	* @param objectToDelete - Array of r_object_id's to delete
	* @throws Exception
	**********************************************/		
	private void deleteFavorites(IDfSession session, List<String> objectsToDelete) throws Exception
	{
		//Check if there are objects to delete
		if(objectsToDelete.size() > 0)
		{
			String inClause;
			StringBuilder inClauseBuilder = new StringBuilder();
			
			//Build in clause to delete multiple objects
			for(String object : objectsToDelete)
			{
				inClauseBuilder.append(NRConstants.APOSTROPHE).append(object).append(NRConstants.APOSTROPHE).append(NRConstants.COMMA);
			}
			
			inClause = inClauseBuilder.toString();
			inClause = inClause.substring(0,inClause.length()-1);
			
			String queryParams[] = new String[2];
			queryParams[0] = inClause;
			queryParams[1] = getUserObjectId(session);
			
			NRUtils.executeUpdateQuery(session, NRUtils.buildText(NRConstants.QUERY_DELETE_FAVORITES,queryParams));
		}
	}
	
	/*********************************************
	* This function will update favorite objects with their
	* new order_no
	* @param session
	* @param objectsToUpdate - Array of r_object_id and order_no
	* 						   that needs to be updated.
	* @throws Exception
	**********************************************/		
	private void updateFavoritesOrder(IDfSession session, List<HashMap<String, Object>> objectsToUpdate) throws Exception
	{
		//Check if there are objects to update
		if(objectsToUpdate.size() > 0)
		{
			//For each object that needs to be updated
			for(HashMap<String, Object> object : objectsToUpdate)
			{
				String queryParams[] = new String[3];
				queryParams[0] =  (String)object.get(NRConstants.ORDER_NO); //Get order_no
				queryParams[1] = getUserObjectId(session); //Get the user r_object_id
				queryParams[2] = (String)object.get(NRConstants.R_OBJECT_ID); //Get the r_object_id of the object

				//Update dm_reltaion table with the new relation properties
				NRUtils.executeUpdateQuery(session, NRUtils.buildText(NRConstants.QUERY_UPDATE_FAVORITES_ORDER_NO,queryParams));
			}
		}
	}
	
	/*********************************************
	* This function will return the user r_object_id
	* @param session
	* @throws Exception
	**********************************************/	
	private String getUserObjectId(IDfSession session) throws Exception
	{
		String user = NRRoleUtils.getUserSession(session);
		String domain = session.getLoginInfo().getDomain();
		IDfUser idfUser = session.getUserByLoginName(user, domain);
		String objectID =idfUser.getObjectId().getId();
		return objectID;	
	}
	
	/**
	 * This Function will return User Name 
	 * @param session
	 * @return User Name
	 * @throws Exception
	 */
	public List<NRJsonObject> getAuthorName(IDfSession session)throws Exception
	{
		List<NRJsonObject> results = authorName(session);
		
		return results;
	}
	
	private List<NRJsonObject> authorName(IDfSession session) throws Exception 
	{
		List<NRJsonObject> userName = new ArrayList<NRJsonObject>();
		String authorId = getUserObjectId(session);
// TODO if we need to support more then one Author need to change to gov_contacts_default_values
		NRJsonObject object =  NRObjectUtils.getObjectById(session,authorId);

		NRJsonObject authorFullName = new NRJsonObject();
		String fullName = createAuthorFullName(object);
		authorFullName.getProperties().put("sender_name", fullName);
		authorFullName.getProperties().put("sender_id", authorId);
		
		String readonly = NRRoleUtils.userInRole(NRConstants.USER_CAN_CHANGE_SENDER_NAME, session) ? "false" : "true";
		
		authorFullName.getProperties().put("readonly", readonly);
		
		userName.add(authorFullName);
			
		return userName;
	}

	private String createAuthorFullName(NRJsonObject object)
	{ 	String firstName = object.getProperties().get("first_name_heb").toString();
	    String lastName = object.getProperties().get("last_name_heb").toString();
		return  firstName + " " + lastName;
	}
/******
 * 	
 * @param session
 * @return
 * @throws Exception
 */
	public List<NRJsonObject> getUserName(IDfSession session)throws Exception
	{
		List<NRJsonObject> results = userName(session);
		return results;
	}
	
	private List<NRJsonObject> userName(IDfSession session) throws Exception 
	{
		List<NRJsonObject> userName = new ArrayList<NRJsonObject>();
		String authorId = getUserObjectId(session);

		NRJsonObject object =  NRObjectUtils.getObjectById(session,authorId);

		NRJsonObject userNameO = new NRJsonObject();
		String fullName = object.getProperties().get("user_name").toString();
		userNameO.getProperties().put("user_name", fullName);
		
		userName.add(userNameO);
		return userName;
	}
	
	/**
	 * Retrieves user's email from gov_user object
	 * @param session
	 * @return
	 * @throws Exception
	 */
	public List<NRJsonObject> getUserAddress(IDfSession session) throws Exception 
	{
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		String authorId = getUserObjectId(session);

		NRJsonObject object =  NRObjectUtils.getObjectById(session,authorId);

		NRJsonObject result = new NRJsonObject();
		String userAddress = object.getProperties().get("user_address").toString();
		result.getProperties().put("user_address", userAddress);
		
		results.add(result);
		return results;
	}

	private List<NRJsonObject> getUserFavoritesOrder(IDfSession session, String dql) throws Exception
	{
		List<NRJsonObject> orderList = new ArrayList<NRJsonObject>();
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		try
		{
			query.setDQL(dql);
			
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			//For each row
			while(col.next())
			{	
				NRJsonObject object = new NRJsonObject();
				
				String objectId = col.getString(col.getAttr(0).getName());
				String orderNo = col.getString(col.getAttr(2).getName());
				String objectType = col.getString(col.getAttr(3).getName());
				
				object.getProperties().put(NRConstants.R_OBJECT_ID, objectId);
				object.getProperties().put(NRConstants.ORDER_NO, orderNo);
				object.getProperties().put(NRConstants.R_OBJECT_TYPE, objectType);
				orderList.add(object);
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
		
		return orderList;
	}
	
	private List<NRJsonObject> creatUserFavoritesList(IDfSession session, boolean documents)
	{
		List<NRJsonObject> userFavorites = new ArrayList<NRJsonObject>();
		List<NRJsonObject> userFavoritesOrder = new ArrayList<NRJsonObject>();
		
		String query = NRConstants.QUERY_USER_FAVORITES;
		if(documents)
		{
			query = NRConstants.QUERY_USER_FAVORITE_DOCS;
		}
		try 
		{
			userFavoritesOrder = getUserFavoritesOrder(session, query.replace(NRConstants.PARAM_1, getUserObjectId(session)));
		} 
		catch (Exception e)
		{
			NRUtils.handleErrors(e);
		}
		
		for(int index = 0; index < userFavoritesOrder.size();index++)
		{
			String userFavoritesOrderNo = (String)userFavoritesOrder.get(index).getProperties().get(NRConstants.ORDER_NO);
			String objectId = (String)userFavoritesOrder.get(index).getProperties().get(NRConstants.R_OBJECT_ID);
			String objectType = (String)userFavoritesOrder.get(index).getProperties().get(NRConstants.R_OBJECT_TYPE);
			NRJsonObject ObjectByTypeAndId;
			try
			{
				if(documents)
				{
				   List<String> extraProperies = new ArrayList<String>();
				   extraProperies.add(NRConstants.ATTR_FOLDER_PATH);
				   ObjectByTypeAndId = NRObjectUtils.getObjecAndPathtByTypeAndId(session, objectId, objectType,extraProperies);
				}
				else
				{
					ObjectByTypeAndId = NRObjectUtils.getObjectById(session, objectId);	
				}
				ObjectByTypeAndId.getProperties().put(NRConstants.ORDER_NO, userFavoritesOrderNo);	
				userFavorites.add(ObjectByTypeAndId);
			} 
			catch(Exception e) 
			{
				NRUtils.handleErrors(e);
			}
		}
		return userFavorites;
	}

	public NRJsonObject getUserCreateFolderTypes(IDfSession session, String folderId, String objectType, boolean checkRole) throws DfException
	{	
		NRJsonObject object = new NRJsonObject();
		
		HashMap <String, String> objectToReturn = new HashMap <String, String>();
		
		IDfSysObject folderObject = (IDfSysObject) session.getObject(new DfId(folderId));
		
		
		boolean isUnitFolder = false;
		while (!isUnitFolder)
		{
			String type = folderObject.getTypeName();
			if (NRConstants.GOV_UNIT_FOLDER.equals(type))
			{
				String unitLayerName = folderObject.getString(NRConstants.UNIT_LAYER_NAME);
				Map <String, String> unitLayerObjectTypes = getUnitLayerObjectTypes(unitLayerName, session, objectType, checkRole);
				for (Entry<String, String> entry : unitLayerObjectTypes.entrySet())
				{
						objectToReturn.put(entry.getKey(), entry.getValue());
				}
				isUnitFolder = true;
			}
			else if (NRConstants.DM_CABINET.equals(type))
			{
				throw new DfException("no unit folder!");
			}
			folderObject = (IDfSysObject) session.getObject(new DfId(folderObject.getString(NRConstants.I_FOLDER_ID)));
		}
		
		object.getProperties().putAll(objectToReturn);
		
		return object;
	}

	
	public HashMap<String, String> getUnitLayerObjectTypes(String unitLayerName, IDfSession session, String objectType, boolean checkRole) throws DfException {
		HashMap <String, String> unitLayerObjectTypes = new HashMap<>();
		HashSet <String>  objectTypes = NRObjectTypeConfigInstance.getInstance().getObjectTypes(objectType+"_"+unitLayerName);
		
		NRRolesConfigInstance roleInstance = NRRolesConfigInstance.getInstance();
		for (String type : objectTypes) 
		{	
			if(checkRole)
			{
				String roleByTypes = roleInstance.getRoleByTypes(type);
				if(roleByTypes != null)
				{
					if(NRRoleUtils.userInRole(roleInstance.getRoleByTypes(type), session))
					{
						unitLayerObjectTypes.put(type,type);
					}
				}
				else
				{
					unitLayerObjectTypes.put(type,type);
				}
			}
			else
			{
				unitLayerObjectTypes.put(type,type);
			}
			
			//no role for discipline folder atm
		
		}
		return unitLayerObjectTypes;
	}

	public List<NRJsonObject> getUserFavoriteDocs(IDfSession session) {
		
		List<NRJsonObject> userFavoriteDocs = new ArrayList<NRJsonObject>();
		
		userFavoriteDocs = creatUserFavoritesList(session, true);
		
		return userFavoriteDocs;
	}

	public void saveColumns(IDfSession session, NRJsonObject object) throws Exception 
	{
		String newColumnsUnit = null;
		
		String unitLayerName = object.getProperties().get(NRConstants.UNIT_LAYER_NAME).toString();
		List<String> newColumnsList = NRUtils.objectToList(object.getProperties().get(NRConstants.COLUMNS_NAME));
		
		String columnsSelected = "";
		if(newColumnsList != null && newColumnsList.size() > 0)
		{
			for (String item : newColumnsList) 
			{
				columnsSelected += item + ";";
			}
			columnsSelected = columnsSelected.substring(0, columnsSelected.length()-1);
			newColumnsUnit = unitLayerName +NRConstants.EQUAL.trim()+ columnsSelected; // finish to save unit+selected columns
		}
		
		IDfUser user = session.getUser(session.getLoginUserName());
		String[] userColumnsSelected = getUserColumnsSelected(session, unitLayerName, true);
		
		int valueCount = user.getValueCount(NRConstants.COLUMNS_SELECTOR);
		
		if(userColumnsSelected == null)
		{
		    user.setRepeatingString(NRConstants.COLUMNS_SELECTOR, valueCount, newColumnsUnit);
		    user.save();
		}
		else if(userColumnsSelected.length > 0)
		{
			int parseInt = Integer.parseInt(userColumnsSelected[1]);
			user.setRepeatingString(NRConstants.COLUMNS_SELECTOR, parseInt, newColumnsUnit);
			user.save();
		}
	}

	public String[] getUserColumnsSelected(IDfSession session, String unitLayerName, boolean onlyMatchUnit) throws Exception 
	{
		IDfUser user = session.getUser(session.getLoginUserName());
		
	    int valueCount = user.getValueCount(NRConstants.COLUMNS_SELECTOR);
	    String[] columnsSelected = null;
		for (Integer index = 0; index < valueCount; ++index)
		{
			String columnsName = user.getRepeatingString(NRConstants.COLUMNS_SELECTOR,index);
			if(columnsName!= null && !columnsName.isEmpty())
			{
				String[] splitColumns = columnsName.split(NRConstants.EQUAL.trim());
				
				if (splitColumns != null && splitColumns[0].equals(unitLayerName)) {
					columnsSelected	= new String[2];
					columnsSelected[0] = columnsName;
					columnsSelected[1] = index.toString();
					break;
				}
				else if(!onlyMatchUnit && splitColumns != null && splitColumns[0].equals(NRConstants.HOME_FOLDER_ID)){
					columnsSelected	= new String[2];
					columnsSelected[0] = columnsName;
					columnsSelected[1] = index.toString();
				}
			}
		}
		return columnsSelected;
	}
	
	public List<NRJsonObject> getListUserColumnsSelected(IDfSession session, Boolean isGetDataType,  String unitLayerName) throws Exception 
	{
		String columnsAlredySelected = "";
		List<NRJsonObject> objectToReturn = new ArrayList<NRJsonObject>();
		List<String> objectTypeList = new ArrayList<>();
		
		HashMap <String, HashMap <String, HashMap<String, String>>> typeAttributeCodeDescription = new HashMap <String, HashMap <String, HashMap<String, String>>>();
		
		if(isGetDataType)
		{
			NRValueAssitanceMethods va = new NRValueAssitanceMethods();
			typeAttributeCodeDescription = va.getAllVa(session);
		}
		
			objectTypeList = NRUtils.getObjectsTypeByUnitId(session, unitLayerName);
		
		String[] userColumnsSelected = getUserColumnsSelected(session, unitLayerName, false);
		
		String[] columnsPerUnit = null;
			
		if(userColumnsSelected!= null && userColumnsSelected.length > 0)
		{
			columnsPerUnit = userColumnsSelected[0].split(NRConstants.EQUAL.trim());
		}
		
		if(columnsPerUnit == null)
		{
			return objectToReturn;
		}
			
		for(String type : objectTypeList) 
		{
			IDfType dctmType = session.getType(type);
			if(columnsPerUnit != null && columnsPerUnit.length>1)
			{
				String columnsUnit = columnsPerUnit[1];
				String[] columnName = columnsUnit.split(";");
				
				for (String column : columnName) 
				{
					if(!columnsAlredySelected.contains(column))
					{
						NRJsonObject addNewColumnAvilable = new NRJsonObject();
						NRObjectMethods method =  new NRObjectMethods();
							
						columnsAlredySelected += column;
						addNewColumnAvilable = method.addNewColumnAvilable(type, column, dctmType.getTypeAttrDataType(column), "", session, false, isGetDataType, typeAttributeCodeDescription);
						
						if(addNewColumnAvilable!= null && addNewColumnAvilable.getProperties().size() > 0)
						{
							objectToReturn.add(addNewColumnAvilable);
						}
					}
				}
			}
		}
		return objectToReturn;
	}
}
