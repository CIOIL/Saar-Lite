package com.ness.rest.objectmethods;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.core.Response.Status;

import com.documentum.fc.client.DfAlreadyLinkedException;
import com.documentum.fc.client.DfClient;
import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfACL;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfFolder;
import com.documentum.fc.client.IDfPersistentObject;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.client.IDfType;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfId;
import com.documentum.fc.common.IDfAttr;
import com.gov.base.sbo.IGovShareAclService;
import com.ness.filters.object.NRObjectFilter;
import com.ness.objects.NRJsonObject;
import com.ness.rest.userinfomethods.NRUserInfoMethods;
import com.ness.rest.vamethods.NRValueAssitanceMethods;
import com.ness.utils.NRConstants;
import com.ness.utils.NREmlUtils;
import com.ness.utils.NRExcludedColumns;
import com.ness.utils.NRObjectUtils;
import com.ness.utils.NRRoleUtils;
import com.ness.utils.NRUtils;

public class NRObjectMethods
{
	private final static int PAGE_SIZE = 100;

	public List<NRJsonObject> getAllObjectsInObject(IDfSession session, String objectId, String orderBy, int page)
			throws Exception
	{
		List<NRJsonObject> allObjects = new ArrayList<NRJsonObject>();
		List<NRJsonObject> folderObjects = getFoldersInObject(session, objectId, orderBy, page);
		List<NRJsonObject> notFolderObjects = getNotFoldersInObject(session, objectId, orderBy, page,
				folderObjects.size());

		if (folderObjects != null && folderObjects.size() > 0)
		{
			allObjects.addAll(folderObjects);
		}

		if (notFolderObjects != null && notFolderObjects.size() > 0)
		{
			allObjects.addAll(notFolderObjects);
		}

		return allObjects;
	}

	public List<NRJsonObject> getFoldersInObject(IDfSession session, String objectId, String orderBy, int page)
			throws Exception
	{
		List<NRJsonObject> folders = new ArrayList<NRJsonObject>();

		IDfCollection col = null;
		IDfQuery query = new DfQuery();

		try
		{
			String startRowNum = String.valueOf(page * PAGE_SIZE - PAGE_SIZE + 1);
			String endRowNum = String.valueOf(page * PAGE_SIZE);
			query.setDQL(NRConstants.QUERY_FOLDERS_FROM_OBJECT.replace(NRConstants.PARAM_1, objectId)
					.replace(NRConstants.PARAM_2, startRowNum).replace(NRConstants.PARAM_3, endRowNum)
					.replace(NRConstants.PARAM_4, orderBy));

			col = query.execute(session, IDfQuery.DF_READ_QUERY);

			// For each row
			while (col.next())
			{
				NRJsonObject tempObject = NRObjectUtils.getObjectById(session,
						col.getString(NRConstants.R_OBJECT_ID));
				folders.add(tempObject);
			}
		} catch (Exception e)
		{
			NRUtils.handleErrors(e);
		} finally
		{
			col.close();
		}

		return folders;
	}

	public List<NRJsonObject> getNotFoldersInObject(IDfSession session, String objectId, String orderBy, int page, int rowCountInit) throws Exception
	{
		List<NRJsonObject> objects = new ArrayList<NRJsonObject>();
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		if (PAGE_SIZE-rowCountInit<=0)
		{
			return objects;
		}
		try
		{
			String startRowNum = String.valueOf(page * PAGE_SIZE - PAGE_SIZE + 1);
			String endRowNum = String.valueOf(page * PAGE_SIZE - rowCountInit);
			query.setDQL(NRConstants.QUERY_NOT_FOLDERS_FROM_OBJECT.replace(NRConstants.PARAM_1, objectId).replace(NRConstants.PARAM_2, startRowNum).replace(NRConstants.PARAM_3, endRowNum).replace(NRConstants.PARAM_4, orderBy));
		
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			//add sender_name_readonly
			boolean userCanChangeSenderName =  NRRoleUtils.userInRole(NRConstants.USER_CAN_CHANGE_SENDER_NAME, session);
			
			//For each row
			while(col.next())
			{
				NRJsonObject tempObject = NRObjectUtils.getObjectById(session, col.getString(NRConstants.R_OBJECT_ID));
				if (!userCanChangeSenderName){
				    tempObject.getProperties().put(NRConstants.SENDER_NAME_READONLY, String.valueOf(true));
				}
				objects.add(tempObject);
			}
		}
		catch(Exception e)
		{
			NRUtils.handleErrors(e);
		}
		finally
		{
			col.close();
		}
		
		return objects;
	}

	public List<NRJsonObject> getFoldersPath(IDfSession session, NRJsonObject object) throws Exception
	{
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		StringBuffer dqlFolderList = new StringBuffer();

		List<String> folderList = NRUtils.objectToList(object.getProperties().get(NRConstants.FOLDER_IDS));

		for (int index = 0; index < folderList.size(); index++)
		{
			if (index > 0)
			{
				dqlFolderList.append(NRConstants.COMMA);
			}

			dqlFolderList.append(NRConstants.APOSTROPHE + folderList.get(index) + NRConstants.APOSTROPHE);
		}

		String queryStr = NRConstants.QUERY_FOLDERS_PATH.replace(NRConstants.PARAM_1, dqlFolderList.toString());
		results = NRObjectUtils.getObjectsByDQL(session, queryStr);

		return results;
	}

	public List<NRJsonObject> getObjectsDetails(IDfSession session, String objectId) throws Exception
	{
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();
		IDfSysObject sysObject = null;

		try
		{
			sysObject = (IDfSysObject) session.getObject(new DfId(objectId));
			objectId = sysObject.getObjectId().getId();

			while (objectId.indexOf(NRConstants.CABINET_OBJECT_PREFIX) != 0)
			{
				NRJsonObject objectDetails = NRObjectUtils.getObjectById(session, objectId);
				results.add(objectDetails);
				objectId = sysObject.getFolderId(0).getId();
				sysObject = (IDfSysObject) session.getObject(new DfId(objectId));
			}

			objectId = sysObject.getCabinetId().getId();
			NRJsonObject objectDetails = NRObjectUtils.getObjectById(session, objectId);
			results.add(objectDetails);
		}
		catch(DfException e)
		{
			getSearchResultsInsufficientPermissionsRecords(results);
			return results;
		}

		return results;
	}

	private NRJsonObject getSearchResultsInsufficientPermissionsRecords(List<NRJsonObject> results) throws IOException {
		NRJsonObject objectDetails;
		objectDetails = new NRJsonObject();
		objectDetails.getProperties().put(NRConstants.R_OBJECT_ID, "-100");
		objectDetails.getProperties().put(NRConstants.OBJECT_NAME, "...");
		results.add(objectDetails);
		
		objectDetails = new NRJsonObject();
		objectDetails.getProperties().put(NRConstants.R_OBJECT_ID, "-100");
		objectDetails.getProperties().put(NRConstants.OBJECT_NAME, NREmlUtils.getHebrewStrings().getProperty("search_results"));
		results.add(objectDetails);
		return objectDetails;
	}
	
	public String getFolderId(IDfSession session, String objectId) throws Exception
	{
		IDfSysObject sysObject = (IDfSysObject) session.getObject(new DfId(objectId));
		return sysObject.getFolderId(0).getId();

	}

	public int linkItems(IDfSession session, List<String> objectIds) throws Exception
	{
		if (objectIds == null || objectIds.size() == 1)
		{
			throw new Exception ("bad ids");
		}
		String linksExistDQL = NRConstants.QUERY_LINKS_EXIST;
		HashMap <String, HashSet<String>> linksMap = new HashMap <String, HashSet<String>>();
		IDfCollection col = null;

		String dqlizedIds = dqlizeIds(objectIds);
		boolean createDmRelation = false;
		IDfQuery query = new DfQuery();
		query.setDQL(linksExistDQL.replace(NRConstants.PARAM_1, dqlizedIds));
		col = query.execute(session, IDfQuery.DF_READ_QUERY);

		while(col.next())
		{
			String firstId = col.getString(NRConstants.CHILD_ID);
			String secondId = col.getString(NRConstants.PARENT_ID);
			boolean isExists = false;
			Iterator <String> itr = linksMap.keySet().iterator();
			
			while (itr.hasNext()){

				if (firstId.equals(itr.next()))
				{
					isExists = true;
					linksMap.get(firstId).add(secondId);
				}
			}

			if (!isExists)
			{
				HashSet <String> set = new HashSet<String>();
				set.add(secondId);
				linksMap.put(firstId, set);
			}
			createDmRelation = true;
		}


		if (!createDmRelation && linksMap.isEmpty())
		{
			createAllDmRelations(session, objectIds);
		}
		else
		{
			createDmRelations(session, objectIds, linksMap);
		}
		
		col.close();
		return Status.OK.getStatusCode();
	}

	private void createDmRelations(IDfSession session, List<String> objectIds, HashMap<String, HashSet<String>> linksMap) throws DfException
	{
		String firstId, secondId;
		HashSet <String> firstIdLinks, secondIdLinks;
		for (int i = 0; i < objectIds.size(); i++)
		{
			// go over all the couples
			for (int j = i + 1; j < objectIds.size(); j++)
			{
				firstId = objectIds.get(i);
				secondId = objectIds.get(j);
				firstIdLinks = linksMap.get(firstId);
				secondIdLinks = linksMap.get(secondId);

				if (!((firstIdLinks != null && firstIdLinks.contains(secondId)) || secondIdLinks != null
								&& (secondIdLinks.contains(firstId))))
				{
					createDmRealtion(session.getObject(new DfId(firstId)), secondId);
				}
			}
		}		
	}

	private void createAllDmRelations(IDfSession session, List<String> objectIds) throws DfException
	{
		String firstId, secondId;

		for (int i = 0; i < objectIds.size(); i++)
		{
			for (int j = i + 1; j < objectIds.size(); j++)
			{
				firstId = (String) objectIds.get(i);
				secondId = (String) objectIds.get(j);
				createDmRealtion((IDfSysObject) session.getObject(new DfId(firstId)), secondId);
			}
		}
		
	}

	private void createDmRealtion(IDfPersistentObject obj, String childId) throws DfException
	{
		obj.addChildRelative(NRConstants.GOV_BASE_RELATION, new DfId(childId), "", false, "");
	}
	
	private String dqlizeIds(List<String> objectIds) throws Exception
	{
		StringBuffer buf = new StringBuffer();
		int i = 0;
		
		for (; i < objectIds.size() - 1; i++)
		{

			buf.append("'").append(objectIds.get(i)).append("'");
			buf.append(", ");
		}
		
		buf.append("'").append(objectIds.get(i)).append("'");
		
		return new String (buf);
	}

	public List<NRJsonObject> getLinkedObjects(IDfSession session, String objectId) throws DfException, Exception
	{
		List<NRJsonObject> objects = new ArrayList<NRJsonObject>();
		List<NRJsonObject> results = NRObjectUtils.getObjectsByDQL(session, NRConstants.QUERY_LINKED_OBJECTS.replace(NRConstants.PARAM_1, objectId));
		
		for(int i = 0 ; i < results.size() ; i++)
		{
			NRJsonObject currentObject = results.get(i);
			objects.add(NRObjectUtils.getObjectById(session, (String) currentObject.getProperties().get(NRConstants.R_OBJECT_ID)));
		}
		
		return objects;
	}

	public List<NRJsonObject> getVersions(IDfSession session, String objectId) throws DfException, Exception
	{
		IDfSysObject object = (IDfSysObject) session.getObject(new DfId(objectId));
		String govId = object.getString(NRConstants.GOV_ID);
		List<NRJsonObject> objects = new ArrayList<NRJsonObject>();
		List<NRJsonObject> results = NRObjectUtils.getObjectsByDQL(session, NRConstants.QUERY_VERSIONS.replace(NRConstants.PARAM_1, govId));
		
		for(int i = 0 ; i < results.size() ; i++)
		{
			NRJsonObject currentObject = results.get(i);
			objects.add(NRObjectUtils.getObjectById(session, (String) currentObject.getProperties().get(NRConstants.R_OBJECT_ID)));
		}
		
		return objects;
	}
	
	public int deleteLinks(IDfSession session, List<String> objectIds) throws DfException
	{
		IDfQuery query = new DfQuery();
		IDfCollection col = null;
		String parentId = null;
		String childId = null;
		query.setDQL(NRConstants.QUERY_LINKED_OBJECTS_PARENT_ID.replace("%1", objectIds.get(0)).replace("%2", objectIds.get(1)));
		col = query.execute(session, IDfQuery.DF_READ_QUERY);
		
		while(col.next())
		{
			parentId = col.getString(NRConstants.PARENT_ID);
		}
		
		childId = objectIds.get(0).equals(parentId) ? objectIds.get(1) : objectIds.get(0);
		IDfSysObject object = (IDfSysObject) session.getObject(new DfId(parentId));
		object.removeChildRelative(NRConstants.GOV_BASE_RELATION, new DfId(childId), "");
		col.close();
		
		return Status.OK.getStatusCode();
	}

	public List<NRJsonObject> getAvailableColumnsInfo(IDfSession session, String unitLayerName) throws Exception 
	{
		List<String> objectTypeList = new ArrayList<>();
		
		String[] columnsPerUnit = null;
		NRUserInfoMethods  nrUserInfoMethods = new NRUserInfoMethods();
		String[] userColumnsSelected = nrUserInfoMethods.getUserColumnsSelected(session, unitLayerName, false);
		
		if(userColumnsSelected != null && userColumnsSelected.length > 0){
			columnsPerUnit = userColumnsSelected[0].split(NRConstants.EQUAL.trim());
		}
		
		objectTypeList = NRUtils.getObjectsTypeByUnitId(session, unitLayerName);
		
		List<NRJsonObject> objectToReturn = new ArrayList<NRJsonObject>();
		
		String columnsAvailable = "";
		for (String type : objectTypeList)
		{
			IDfType dctmType = session.getType(type);
			for (int index = 0; index <  dctmType.getTypeAttrCount(); index++)
			{
				IDfAttr attr = dctmType.getTypeAttr(index);
				
				if(!columnsAvailable.contains(attr.getName()))
				{
					boolean isExcludedColumn = NRExcludedColumns.getInstance().hasField(attr.getName());
					if(!isExcludedColumn)
					{
						boolean hasField = NRObjectFilter.getInstance().hasField(attr.getName());
						if(hasField)
						{
							NRJsonObject addNewColumnAvilable = new NRJsonObject();
							
							if(columnsPerUnit != null)
							{
								if(!checkIfAttributeAlreadySelected(attr.getName(), columnsPerUnit[1]))
								{
										addNewColumnAvilable = addNewColumnAvilable(type, attr.getName(), null, "", session, true, false,null);
								}
							}
							else
							{
								addNewColumnAvilable = addNewColumnAvilable(type, attr.getName(), null, "", session, true, false,null);
							}
							
							if(addNewColumnAvilable!= null && addNewColumnAvilable.getProperties().size() > 0)
							{
								objectToReturn.add(addNewColumnAvilable);
								columnsAvailable = columnsAvailable + attr.getName();
							}
						}
					}
				}
			}
		}

		return objectToReturn;
	}

	public NRJsonObject addNewColumnAvilable(String objectType, String attrName, Integer dataType, String labelText,IDfSession session, boolean isAvilable, Boolean isGetDataType, HashMap <String, HashMap <String, HashMap<String, String>>> typeVa) throws Exception 
	{
			NRJsonObject listObject = new NRJsonObject();
			listObject.getProperties().put("columns_name", attrName);
			listObject.getProperties().put("columns_desc", labelText);
			if(isGetDataType)
			{
				if(dataType == Integer.parseInt(NRConstants.DATA_TYPE_STRING))
				{
					HashMap<String, HashMap<String, String>> hashMap = typeVa.get(objectType);
					if(hashMap.containsKey(attrName))
						listObject.getProperties().put("columns_type",  "codetable");
					else
						listObject.getProperties().put("columns_type",  dataType);
				}
				else
				{
					listObject.getProperties().put("columns_type", dataType);
				}
			}
		return listObject;
	}

	private boolean checkIfAttributeAlreadySelected(String attrName, String userColumnsSelected) 
	{
		return userColumnsSelected.toLowerCase().contains(attrName.toLowerCase());
	}
	

	public void writeToCSVTempFile(IDfSession session, ArrayList<String> columnDataIndexes, ArrayList<String> columnNames, ArrayList<String> objectIds, OutputStreamWriter writer) throws Exception
	{	
		writeColumnHeaders(columnNames, writer);
		writeColumnContent(session, columnDataIndexes, objectIds, writer);
	}

	private void writeColumnContent(IDfSession session, ArrayList<String> columnDataIndexes, ArrayList<String> objectIds, OutputStreamWriter writer) throws Exception
	{
		HashMap<String, HashMap<String, HashMap<String, String>>> va = new NRValueAssitanceMethods().getAllVa(session);
		StringBuffer propertyBuf;
		
		for (int i = 0; i < objectIds.size(); i++)
		{
			try
			{
				NRJsonObject object = NRObjectUtils.getObjectById(session, objectIds.get(i));
				
				for (int j = 0; j < columnDataIndexes.size(); j++)
				{
					Object property = object.getProperties().get(columnDataIndexes.get(j));
					
					if (property == null)
					{
						property = "";
					}
					
					if (property instanceof String)
					{
						String value = (String) property;
						
						try
						{
							property = va.get(object.getProperties().get(NRConstants.R_OBJECT_TYPE)).get(columnDataIndexes.get(j)).get(property);
						}
						catch (Exception e)
						{
							property = value;
						}
						
						writer.write(formatStringForCSV((String) property));
					}
					else if (property instanceof ArrayList<?>)
					{
						propertyBuf = new StringBuffer();
						
						for (int k = 0; k < ((ArrayList<String>) property).size(); k++)
						{
							String value = ((ArrayList<String>) property).get(k);
							
							try
							{
								value = va.get(object.getProperties().get(NRConstants.R_OBJECT_TYPE)).get(columnDataIndexes.get(j)).get(value);
							}
							catch (Exception e)
							{
								value = ((ArrayList<String>) property).get(k);;
							}
							
							propertyBuf.append(value == null ? "" : value);
							
							if (k == ((ArrayList<String>) property).size() - 1 || value == null)
							{
								continue;
							}
							else
							{
								propertyBuf.append(NRConstants.COMMA);
							}
						}
						
						writer.write(formatStringForCSV(new String(propertyBuf)));
					}
					
					if (j == columnDataIndexes.size() - 1)
					{
						continue;
					}
					else
					{
						writer.write("\t");
					}
				}

				writer.write("\r\n");
				writer.flush();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}

	private void writeColumnHeaders(ArrayList<String> columnNames, OutputStreamWriter writer) throws IOException
	{
		for (int i = 0; i < columnNames.size(); i++)
		{
			writer.write(formatStringForCSV(columnNames.get(i)));
			
			if (i == columnNames.size() - 1)
			{
				continue;
			}
			else
			{
				writer.write("\t");
			}
		}
		
		writer.write("\r\n");
		writer.flush();
	}

	private String formatStringForCSV(String s)
	{
		if (s == null)
		{
			return "";
		}
		
		String retStr = s;
		boolean bEncloseDoubleQuote = false;

		if ((retStr.contains(",")) || (retStr.contains("\n")) || (retStr.startsWith(" ")) || (retStr.endsWith(" ")))
		{
			bEncloseDoubleQuote = true;
		}

		if (s.contains("\""))
		{
			retStr = retStr.replaceAll("\"", "\"\"");
			bEncloseDoubleQuote = true;
		}

		if (bEncloseDoubleQuote)
		{
			retStr = "\"" + retStr + "\"";
		}

		return retStr;
	}

	public ArrayList<NRJsonObject> moveObjects(IDfSession session, ArrayList<String> objectIds, ArrayList<String> addedFromIds, String moveToId) throws DfException
	{
		ArrayList<NRJsonObject> checkedErrors = null;
		for (int i = 0; i < objectIds.size(); i++)
		{
			IDfSysObject object = (IDfSysObject) session.getObject(new DfId(objectIds.get(i)));
			
			if((object.getTypeName().equals(NRConstants.GOV_DOCUMENT)
				|| object.getType().isSubTypeOf(NRConstants.GOV_DOCUMENT))
				&& object.getBoolean(NRConstants.ATTR_IS_FINAL)
			)
			{
				if (checkedErrors == null)
				{
					checkedErrors = new ArrayList<NRJsonObject>();
				}
				
				NRJsonObject jsonObject = new NRJsonObject();
				jsonObject.getProperties().put("error", "error_final_document");
				jsonObject.getProperties().put("objectName", object.getObjectName());
				jsonObject.getProperties().put("objectId", object.getObjectId().getId());
				checkedErrors.add(jsonObject);
				continue;
			}
			else if ((object.getTypeName().equals(NRConstants.GOV_DOCUMENT)
				|| object.getType().isSubTypeOf(NRConstants.GOV_DOCUMENT))
				&& object.isCheckedOut()
			)
			{
				if (checkedErrors == null)
				{
					checkedErrors = new ArrayList<NRJsonObject>();
				}
				
				NRJsonObject jsonObject = new NRJsonObject();
				jsonObject.getProperties().put("error", "error_document_is_checked_out");
				jsonObject.getProperties().put("objectName", object.getObjectName());
				jsonObject.getProperties().put("objectId", object.getObjectId().getId());
				checkedErrors.add(jsonObject);
				continue;
			}
			else if ((object.getTypeName().equals(NRConstants.GOV_DOCUMENT)
				|| object.getType().isSubTypeOf(NRConstants.GOV_DOCUMENT))
				&& object.getPermit() < IDfACL.DF_PERMIT_WRITE)
			{
				if (checkedErrors == null)
				{
					checkedErrors = new ArrayList<NRJsonObject>();
				}
				
				NRJsonObject jsonObject = new NRJsonObject();
				jsonObject.getProperties().put("error", "error_no_permission_to_link");
				jsonObject.getProperties().put("objectName", object.getObjectName());
				jsonObject.getProperties().put("objectId", object.getObjectId().getId());
				checkedErrors.add(jsonObject);
				continue;
			}
			else
			{
				try
				{
					object.link(moveToId);
				}
				catch (DfAlreadyLinkedException e)
				{
					if (checkedErrors == null)
					{
						checkedErrors = new ArrayList<NRJsonObject>();
					}
					
					NRJsonObject jsonObject = new NRJsonObject();
					jsonObject.getProperties().put("error", "error_already_linked");
					jsonObject.getProperties().put("objectName", object.getObjectName());
					jsonObject.getProperties().put("objectId", object.getObjectId().getId());
					checkedErrors.add(jsonObject);
					continue;
				}
				
				object.unlink(addedFromIds.get(i));
				object.save();
			}
		}
		
		return checkedErrors;
	}

	public ArrayList<NRJsonObject> extraLinkObjects(IDfSession session, ArrayList<String> objectIds, String linkToId) throws DfException
	{
		ArrayList<NRJsonObject> checkedErrors = null;
		
		for (int i = 0; i < objectIds.size(); i++)
		{
			IDfSysObject object = (IDfSysObject) session.getObject(new DfId(objectIds.get(i)));
			
			if((object.getTypeName().equals(NRConstants.GOV_DOCUMENT)
				|| object.getType().isSubTypeOf(NRConstants.GOV_DOCUMENT))
				&& object.getBoolean(NRConstants.ATTR_IS_FINAL)
			)
			{
				if (checkedErrors == null)
				{
					checkedErrors = new ArrayList<NRJsonObject>();
				}
				
				NRJsonObject jsonObject = new NRJsonObject();
				jsonObject.getProperties().put("error", "error_final_document");
				jsonObject.getProperties().put("objectName", object.getObjectName());
				jsonObject.getProperties().put("objectId", object.getObjectId().getId());
				checkedErrors.add(jsonObject);
				continue;
			}
			else
			{
				try
				{
					object.link(linkToId);
				}
				catch(DfAlreadyLinkedException e)
				{
					if (checkedErrors == null)
					{
						checkedErrors = new ArrayList<NRJsonObject>();
					}
					
					NRJsonObject jsonObject = new NRJsonObject();
					jsonObject.getProperties().put("error", "error_already_linked");
					jsonObject.getProperties().put("objectName", object.getObjectName());
					jsonObject.getProperties().put("objectId", object.getObjectId().getId());
					checkedErrors.add(jsonObject);
					continue;
				}
				
				object.save();
			}
		}
		
		return checkedErrors;
	}

	public ArrayList<NRJsonObject> shareAndLinkObjects(IDfSession session, ArrayList<String> objectIds, String shareAndLinkToId) throws Exception
	{
		ArrayList<NRJsonObject> checkedErrors = null;
		IGovShareAclService shareAcl = (IGovShareAclService) DfClient.getLocalClient().newService(NRConstants.SHARE_ACL_CLASS, null);
		
		for (int i = 0; i < objectIds.size(); i++)
		{
			IDfSysObject object = (IDfSysObject) session.getObject(new DfId(objectIds.get(i)));
			
			if((object.getTypeName().equals(NRConstants.GOV_DOCUMENT)
				|| object.getType().isSubTypeOf(NRConstants.GOV_DOCUMENT))
				&& object.getBoolean(NRConstants.ATTR_IS_FINAL)
			)
			{
				if (checkedErrors == null)
				{
					checkedErrors = new ArrayList<NRJsonObject>();
				}
				
				NRJsonObject jsonObject = new NRJsonObject();
				jsonObject.getProperties().put("error", "error_final_document");
				jsonObject.getProperties().put("objectName", object.getObjectName());
				jsonObject.getProperties().put("objectId", object.getObjectId().getId());
				checkedErrors.add(jsonObject);
				continue;
			}
			else
			{
				try
				{
					object.link(shareAndLinkToId);
				}
				catch (DfAlreadyLinkedException e)
				{
					if (checkedErrors == null)
					{
						checkedErrors = new ArrayList<NRJsonObject>();
					}
					
					NRJsonObject jsonObject = new NRJsonObject();
					jsonObject.getProperties().put("error", "error_already_linked");
					jsonObject.getProperties().put("objectName", object.getObjectName());
					jsonObject.getProperties().put("objectId", object.getObjectId().getId());
					checkedErrors.add(jsonObject);
					continue;
				}
				
				IDfACL customAcl = null;
				customAcl = shareAcl.createShareAcl(object, shareAndLinkToId, session);
				object.setACL(customAcl);
				object.save();
			}
		}
		
		return checkedErrors;
	}

	public ArrayList<NRJsonObject> copyObjects(IDfSession session, ArrayList<String> objectIds, String copyToId)
	{
		ArrayList<NRJsonObject> checkedErrors = null;
		IDfSysObject copyToObject = null;
		try
		{
			copyToObject = (IDfSysObject) session.getObject(new DfId(copyToId));
			
			if (copyToObject.getPermit() < IDfACL.DF_PERMIT_WRITE)
			{
				throw new DfException();
			}
		}
		catch(DfException e)
		{
			checkedErrors = new ArrayList<NRJsonObject>();
			
			for (String objectId : objectIds)
			{
				NRJsonObject jsonObject = new NRJsonObject();
				IDfSysObject obj;
				try
				{
					obj = (IDfSysObject) session.getObject(new DfId(objectId));
					jsonObject.getProperties().put("error", "error_no_permission_to_copy");
					jsonObject.getProperties().put("objectName", obj.getObjectName());
					jsonObject.getProperties().put("objectId", obj.getObjectId().getId());
				}
				catch (DfException e1)
				{
					e1.printStackTrace();
				}
				
				checkedErrors.add(jsonObject);
			}
			
			return checkedErrors;
		}
		
		for (String objectId : objectIds)
		{
			IDfSysObject obj;
			
			try
			{
				obj = (IDfSysObject) session.getObject(new DfId(objectId));

				if((obj.getTypeName().equals(NRConstants.GOV_DOCUMENT)
					|| obj.getType().isSubTypeOf(NRConstants.GOV_DOCUMENT))
					&& obj.getBoolean(NRConstants.ATTR_IS_FINAL)
				)
				{
					NRJsonObject jsonObject = new NRJsonObject();
					jsonObject.getProperties().put("error", "error_final_document");
					jsonObject.getProperties().put("objectName", obj.getObjectName());
					jsonObject.getProperties().put("objectId", obj.getObjectId().getId());
					checkedErrors.add(jsonObject);
					continue;
				}
				else
				{
					NRObjectUtils.copyObject(session, copyToId, objectId);
				}
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
		
		return checkedErrors;
	}

	public NRJsonObject isLinkOrSource(IDfSession session, String objectId, String currentFolderPath) throws DfException
	{
		NRJsonObject result = new NRJsonObject();
		IDfSysObject object = (IDfSysObject) session.getObject(new DfId(objectId));
		IDfFolder folder = (IDfFolder) session.getObject(object.getFolderId(0));
		
		for (int i = 0; i < folder.getFolderIdCount(); i++)
		{
			String folderPath = folder.getFolderPath(i);

			if (currentFolderPath.equals(folderPath))
			{
				result.getProperties().put("origin", "source");
				break;
			}
			else if (i == folder.getFolderIdCount() - 1)
			{
				result.getProperties().put("origin", "link");
			}
		}
		
		return result;
	}

	public ArrayList<NRJsonObject> attributesByObjectType(IDfSession session, String objectType)
	{
		ArrayList <NRJsonObject> result = new ArrayList<NRJsonObject>();
		
		try
		{
			IDfType type = session.getType(objectType);
			Class<IDfType> c = IDfType.class;
			HashMap<Integer, String> typeNameMap = new HashMap<Integer, String>();
			Field [] fields = c.getDeclaredFields(); 
			
			for (int i = 0; i < fields.length; i++)
			{
				Field f = fields[i];
				
				if (f.getType().getName().equals(Integer.TYPE.getName()))
				{
					typeNameMap.put((Integer) f.get(null), f.getName());
				}
			}
			
			for (int i = 0; i < type.getTypeAttrCount(); i++)
			{
				IDfAttr attribute = type.getTypeAttr(i);
				
				if (NRObjectFilter.getInstance().hasField(attribute.getName()))
				{
					NRJsonObject attributeJson = new NRJsonObject();
					attributeJson.getProperties().put("name", attribute.getName());
					attributeJson.getProperties().put("length", attribute.getLength());
					attributeJson.getProperties().put("type", typeNameMap.get(attribute.getDataType()));
					attributeJson.getProperties().put("isRepeating", String.valueOf(attribute.isRepeating()));
					result.add(attributeJson);
				}
			}
		}
		catch (DfException e)
		{
			e.printStackTrace();
			result = null;
		}
		catch (IllegalArgumentException e)
		{	
			e.printStackTrace();
			result = null;
		}
		catch (IllegalAccessException e)
		{
			e.printStackTrace();
			result = null;
		}
		catch (SecurityException e)
		{
			e.printStackTrace();
			result = null;
		}
		
//		for (int i = 0; i < result.size(); i++)
//		{
//			NRJsonObject obj = result.get(i);
//			System.out.println(obj.getProperties().get("name") + "; " + obj.getProperties().get("length") + "; " + obj.getProperties().get("type") + "; " + obj.getProperties().get("isRepeating") + ";");
//		}
		
		return result;
	}
}