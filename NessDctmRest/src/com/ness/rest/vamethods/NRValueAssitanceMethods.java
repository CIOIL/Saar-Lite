package com.ness.rest.vamethods;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.DfServiceException;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfList;
import com.documentum.fc.common.IDfList;
import com.gov.base.sbo.IGovValueAssistanceService;
import com.ness.objects.NRJsonObject;
import com.ness.rest.NRValueAssitanceService;
import com.ness.utils.NRConstants;
import com.ness.utils.NRUtils;

public class NRValueAssitanceMethods
{
	private static final String DEPENDENCY_VALUES = "dependencyValues";
	private static final String DEPENDENCY_NAMES = "dependencyNames";
	private static final String VALUES = "values";
	private static final String ATTR_NAME = "attrName";
	private static final String OBJECT_TYPE = "objectType";
	private static final String FOLDER_ID = "folderId";
	private static final String VA_SERVICE_CLASS = "com.gov.base.sbo.IGovValueAssistanceService";

	@SuppressWarnings("unchecked")
	public List<NRJsonObject> resolveValueAssitance(IDfSession session, NRJsonObject object) throws Exception
	{

		List<NRJsonObject> result = null;

		String type = (String) object.getProperties().get(OBJECT_TYPE);
		String attrName = (String) object.getProperties().get(ATTR_NAME);
		String values = (String) object.getProperties().get(VALUES);
		String folderId = (String) (object.getProperties().get(FOLDER_ID) + "");

		List<String> dependencyNames = (List<String>) object.getProperties().get(DEPENDENCY_NAMES);
		List<String> dependencyValues = (List<String>) object.getProperties().get(DEPENDENCY_VALUES);


		if (dependencyValues != null && "unit_id".equalsIgnoreCase(dependencyNames.get(0))
				&& !"-1".equalsIgnoreCase(folderId) && !"-10".equalsIgnoreCase(folderId))
		{
			String unitId = dependencyValues.get(0);
			if (unitId == null)
			{
				unitId = NRUtils.getUnitId(session, folderId);
				dependencyValues.set(0, unitId);
			}
		}
		
			IGovValueAssistanceService service = getService(session);

			// *** Note: the following resolveValueAssistance() service method
			// handles automatically both, Value Assistance and Code Table
			// attributes ***
			List<IDfList> list = service.resolveValueAssistance(type, attrName, values, dependencyNames,
					dependencyValues, session.getDocbaseName());
			result = convertToJsonObjectList(list);		

		return result;
	}

	private static IGovValueAssistanceService getService(IDfSession session) throws DfServiceException
	{
		IGovValueAssistanceService service = (IGovValueAssistanceService) session.getClient()
				.newService(VA_SERVICE_CLASS, session.getSessionManager());

		return service;
	}

	private List<NRJsonObject> convertToJsonObjectList(List<IDfList> list) throws Exception
	{
		List<NRJsonObject> results = new ArrayList<NRJsonObject>();

		IDfList values = new DfList();
		IDfList labels = new DfList();

		if (list != null && list.size() == 2)
		{
			values = list.get(0);
			labels = list.get(1);
		}

		if (values.getCount() > 0 && values.getCount() == labels.getCount())
		{
			for (int index = 0; index < values.getCount(); index++)
			{
				NRJsonObject listObject = new NRJsonObject();
				listObject.getProperties().put(NRConstants.VALUE, labels.getString(index));
				listObject.getProperties().put(NRConstants.CODE, values.getString(index));
				results.add(listObject);
			}
		}

		return results;
	}

	public HashMap<String, HashMap<String, HashMap<String, String>>> getAllVa(IDfSession session) throws Exception
	{
		HashMap <String, HashMap <String, HashMap<String, String>>> typeAttributeCodeDescription = new HashMap <String, HashMap <String, HashMap<String, String>>>();
		createAllVaMapFromCTandVA(session, typeAttributeCodeDescription);
		mergeExtendedTypesAttributesWithBasicTypesAttributes(session, typeAttributeCodeDescription);
		//traceAllVa(typeAttributeCodeDescription);
		return typeAttributeCodeDescription;
	}

	private void mergeExtendedTypesAttributesWithBasicTypesAttributes(IDfSession session, HashMap<String, HashMap<String, HashMap<String, String>>> typeAttributeCodeDescription) throws DfException
	{
		Set <String> typeKeys = typeAttributeCodeDescription.keySet();
		
		for (String typeKey : typeKeys)
		{
			if (session.getType(typeKey) != null)
			{
				if (session.getType(typeKey).isSubTypeOf(NRConstants.GOV_DOCUMENT))
				{
					mergeAttributes(typeAttributeCodeDescription, typeKey, NRConstants.GOV_DOCUMENT);
				}
				else if (session.getType(typeKey).isSubTypeOf(NRConstants.GOV_FOLDER))
				{
					mergeAttributes(typeAttributeCodeDescription, typeKey, NRConstants.GOV_FOLDER);
				}
			}
		}
	}

	private void mergeAttributes(HashMap<String, HashMap<String, HashMap<String, String>>> typeAttributeCodeDescription, String mergeTo, String mergeFrom)
	{
		HashMap<String, HashMap <String, String>> mergeFromAttributes = typeAttributeCodeDescription.get(mergeFrom);
		HashMap<String, HashMap <String, String>> mergeToAttributes = typeAttributeCodeDescription.get(mergeTo);
		Set<String> mergeFromKeys = mergeFromAttributes.keySet();
		
		for (String mergeFromKey : mergeFromKeys)
		{
			if (mergeToAttributes.get(mergeFromKey) == null)
			{
				mergeToAttributes.put(mergeFromKey, mergeFromAttributes.get(mergeFromKey));
			}
		}
	}

	private void createAllVaMapFromCTandVA(IDfSession session, HashMap<String, HashMap<String, HashMap<String, String>>> typeAttributeCodeDescription) throws DfException
	{
		IDfCollection col;
		IDfCollection col2;
		IDfCollection col3;
		
		IDfQuery query = new DfQuery();
		query.setDQL("select object_type_name, attr_name, dql from gov_codetable_config where object_type_name is not nullstring and attr_name is not nullstring and dql is not nullstring order by 1");
		col = query.execute(session, IDfQuery.DF_READ_QUERY);
		HashMap <String, HashMap<String, String>> attributeCodeDescription = new HashMap <String, HashMap<String, String>>();
		String objectType = null;
		
		while (col.next())
		{
			String dql = col.getString("dql");
			String newObjectType = col.getString("object_type_name");
			
			if (!dql.contains("gov_ct_"))
			{
				continue;
			}
			
			dql = dql.substring(0, dql.indexOf("where") != -1 ? dql.indexOf("where") : dql.length());
			
			IDfQuery query2 = new DfQuery();
			query2.setDQL(dql);
			col2 = query2.execute(session, IDfQuery.DF_READ_QUERY);
			HashMap<String, String> codeDescription = new HashMap<String, String>();
			
			while (col2.next())
			{
				if ((col2.getString(col2.getAttr(0).getName()) != null && col2.getString(col2.getAttr(0).getName()).length() > 0) && (col2.getString(col2.getAttr(1).getName()) != null && col2.getString(col2.getAttr(1).getName()).length() > 0))
				{
					codeDescription.put(col2.getString(col2.getAttr(0).getName()), col2.getString(col2.getAttr(1).getName()));
				}
			}
			
			col2.close();
			
			boolean hasObjectTypeChanged = hasValueChanged(objectType, newObjectType);
			
			if (hasObjectTypeChanged)
			{
				typeAttributeCodeDescription.put(objectType == null ? newObjectType : objectType, attributeCodeDescription);
				attributeCodeDescription = new HashMap <String, HashMap<String, String>>();
			}
			
			attributeCodeDescription.put(col.getString("attr_name"), codeDescription);
			
			objectType = newObjectType;
		}
		
		typeAttributeCodeDescription.put(objectType, attributeCodeDescription);
		
		IDfQuery query3 = new DfQuery();
		query3.setDQL("select type_name as object_type_name, attr_name, map_data_string as code, map_display_string as description from dmi_dd_attr_info where map_data_string is not null and nls_key='iw' and type_name like 'gov%' and attr_name not in ('owner_permit', 'group_permit', 'world_permit', 'client_capability', 'group_def_permit', 'world_def_permit', 'owner_def_permit') and attr_name is not nullstring enable(row_based)");
		col3 = query3.execute(session, IDfQuery.DF_READ_QUERY);
		
		
		HashMap <String, HashMap<String, String>> vaAttributeCodeDescription = new HashMap <String, HashMap<String, String>>();
		HashMap<String, String> vaCodeDescription = new HashMap<String, String>();
		String typeName = null;
		String attributeName = null;
		
		while (col3.next())
		{
			String newTypeName = col3.getString("object_type_name");
			String newAttributeName = col3.getString("attr_name");
			String code = col3.getString("code");
			String description = col3.getString("description");
			
			if (typeAttributeCodeDescription.get(typeName) != null)
			{
				vaAttributeCodeDescription = typeAttributeCodeDescription.get(typeName);
			}
			else
			{
				vaAttributeCodeDescription = new HashMap <String, HashMap<String, String>>();
			}
			
			boolean hasAttributeNameChanged = hasValueChanged (attributeName, newAttributeName);
			boolean hasTypeNameChanged = hasValueChanged(typeName, newTypeName);
			
			if(hasAttributeNameChanged || (hasTypeNameChanged && !hasAttributeNameChanged))
			{
				vaAttributeCodeDescription.put(attributeName == null ? newAttributeName : attributeName, vaCodeDescription);
				vaCodeDescription = new HashMap<String, String>();
			}

			vaCodeDescription.put(code,description);

			attributeName = newAttributeName;

			if (hasTypeNameChanged)
			{
				typeAttributeCodeDescription.put(typeName == null ? newTypeName : typeName,vaAttributeCodeDescription);				
			}

			typeName = newTypeName;			
		}
		
		vaAttributeCodeDescription.put(attributeName, vaCodeDescription);
		typeAttributeCodeDescription.put(typeName,vaAttributeCodeDescription);
		
		col.close();
		col3.close();
	}

	private boolean hasValueChanged(String value, String newValue)
	{
		return (value == null && newValue != null) || (value != null && !value.equals(newValue));
	}
	
	private void traceAllVa(HashMap<String, HashMap<String, HashMap<String, String>>> typeAttributeCodeDescription) throws IOException
	{
		Set <String> typeKeys = typeAttributeCodeDescription.keySet();
		
		for (String typeKey : typeKeys)
		{
			Logger.getLogger (NRValueAssitanceService.class.getName()).log(Level.FINE, "type: " + typeKey);
			HashMap<String, HashMap<String, String>> attributeCodeDescription = typeAttributeCodeDescription.get(typeKey);
			Set <String> attrKeys = attributeCodeDescription.keySet();
			
			for (String attrKey : attrKeys)
			{
				Logger.getLogger (NRValueAssitanceService.class.getName()).log(Level.FINE, "attribute: " +attrKey);
				HashMap <String, String> codeDescription = attributeCodeDescription.get(attrKey);
				Set <String> codeKeys = codeDescription.keySet();
				
				for (String codeKey: codeKeys)
				{
					Logger.getLogger (NRValueAssitanceService.class.getName()).log(Level.FINE, "code: " + codeKey + ", description: " + codeDescription.get(codeKey));
				}
			}
		}
	}
}