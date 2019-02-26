package com.ness.rest.searchmethods;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfType;
import com.documentum.fc.impl.util.StringUtil;
import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.utils.NRDfcPropertiesDateFormat;
import com.ness.utils.NRObjectUtils;
import com.ness.utils.NRUtils;

public class NRSearchMethods
{
	private static final String QUERY_FOLDERS_PATH = "select r_object_id, r_folder_path from dm_folder where r_object_id = '%1'";
	private static final String[] operator = {"OP_SMALL_EQ","OP_GREAT_EQ"}; 
	private static final String[] lables = 
	{
		"word",
		"excel",
		"powerpoint",
		"outlook",
		"pdf",
		"tiff",
		"image",
		"audio",
		"video",
		"text",
		"html",
		"archive",
		"xml",
		"autocad",
		"css",
		"csv",
		"java"
	};
	
	public List<NRJsonObject> xploreSearch(IDfSession session, NRJsonObject searchProperties) throws Exception
	{
		List<NRJsonObject> searchResult = new ArrayList<NRJsonObject>();
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		String objectType = (String) searchProperties.getProperties().get(NRConstants.ATTR_OBJECT_TYPE);
		String searchValue = (String) searchProperties.getProperties().get(NRConstants.ATTR_SEARCH_VALUE);
		Boolean searchInFolder = (Boolean) searchProperties.getProperties().get(NRConstants.SEARCH_IN_FOLDER);
		String searchFolderPath = (String) searchProperties.getProperties().get(NRConstants.FOLDER_PATH);
		
		searchValue = dqlizeAposrophsAndQuotes(searchValue);
				
		if(!NRUtils.isEmpty(objectType) && !NRUtils.isEmpty(searchValue))
		{
			try
			{
				StringBuffer dql = new StringBuffer();
				dql.append(NRConstants.QUERY_XPLORE_SEARCH.replace(NRConstants.PARAM_1, objectType).replace(NRConstants.PARAM_2, searchValue));
				
				if (searchInFolder)
				{	
					dql.append(" and Folder('").append(searchFolderPath).append("', descend)");
				}
				
				dql.append(" ENABLE (SQL_DEF_RESULT_SET 350)");
				query.setDQL(new String(dql));
				
				//NOFTDQL query a replacement for SEARCH DOCUMENT CONTAINS that documentum provides
				//query.setDQL(NRConstants.QUERY_NOFTDQL_SEARCH.replace(NRConstants.PARAM_1, objectType).replace(NRConstants.PARAM_2, searchValue));
				col = query.execute(session, IDfQuery.DF_READ_QUERY);
				
				//For each row
				List<String> extraProperies = new ArrayList<String>();
				extraProperies.add(NRConstants.ATTR_FOLDER_PATH);
				while(col.next())
				{
					NRJsonObject tempObject = NRObjectUtils.getObjecAndPathtByTypeAndId(session, col.getString(NRConstants.R_OBJECT_ID), col.getString(NRConstants.R_OBJECT_TYPE), extraProperies);
					
//					if(!NRUtils.isRecordFolder(tempObject.getProperties().get(NRConstants.R_OBJECT_ID).toString()))
//					{
//						String folderPath = getFolderPath(session,QUERY_FOLDERS_PATH, new String[]{tempObject.getProperties().get(NRConstants.I_FOLDER_ID).toString()});
//						tempObject.getProperties().put(NRConstants.ATTR_FOLDER_PATH, folderPath);
//					}
//					
					tempObject.getProperties().put("action", "search");
					searchResult.add(tempObject);
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
		}
		
		return searchResult;
	}
	
	public List<NRJsonObject> advSearch(IDfSession session, NRJsonObject searchProperties) throws Exception
	{
		List<NRJsonObject> searchResult = new ArrayList<NRJsonObject>();
		IDfCollection col = null;
		String dqlFields = null;

		String objectType = (String) searchProperties.getProperties().get(NRConstants.R_OBJECT_TYPE);
		dqlFields = buildDqlFields(session, searchProperties, objectType);
		
		
		if(dqlFields != null)
		{
			try
			{
				IDfQuery query = new DfQuery();
				String search_textual = (String) searchProperties.getProperties().get(NRConstants.SEARCH_TEXTUAL);
				if (search_textual!= null && !search_textual.isEmpty())
				{
					search_textual = dqlizeAposrophsAndQuotes(search_textual);
					String dql = NRConstants.QUERY_ADVANCED_SEARCH_WITH_SEARCH_TEXTUAL.replace(NRConstants.PARAM_1, objectType).replace(NRConstants.PARAM_2, search_textual).replace(NRConstants.PARAM_3, dqlFields);
					//System.out.println("dql=" + dql);
					query.setDQL(dql);
				}
				else
				{
					String dql = NRConstants.QUERY_ADVANCED_SEARCH.replace(NRConstants.PARAM_1, objectType).replace(NRConstants.PARAM_2, dqlFields);
					//System.out.println("dql=" + dql);
					query.setDQL(dql);
				}
				col = query.execute(session, IDfQuery.DF_READ_QUERY);
				
				//For each row
				List<String> extraProperies = new ArrayList<String>();
				extraProperies.add(NRConstants.ATTR_FOLDER_PATH);
				long time1 = System.currentTimeMillis();
				
				while(col.next())
				{
					NRJsonObject tempObject = NRObjectUtils.getObjecAndPathtByTypeAndId(session, col.getString(NRConstants.R_OBJECT_ID), col.getString(NRConstants.R_OBJECT_TYPE), extraProperies);
					
					//NRJsonObject tempObject = NRObjectUtils.getObjectByTypeAndId(session, col.getString(NRConstants.R_OBJECT_ID), col.getString(NRConstants.R_OBJECT_TYPE));
					/*if(!NRUtils.isRecordFolder(tempObject.getProperties().get(NRConstants.R_OBJECT_ID).toString()))
					{
						String folderPath = getFolderPath(session,QUERY_FOLDERS_PATH, new String[]{tempObject.getProperties().get(NRConstants.I_FOLDER_ID).toString()});
						tempObject.getProperties().put(NRConstants.ATTR_FOLDER_PATH, folderPath);
					}*/
					tempObject.getProperties().put("action", "search");
					searchResult.add(tempObject);
				}
				
				long time2 = System.currentTimeMillis();
				long gapTime = time2 - time1;
				System.out.println(" Time gap is: " + gapTime);
			}
			catch(Exception e)
			{
				NRUtils.handleErrors(e);
			}
			finally
			{
				col.close();
			}
		}
		
		return searchResult;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private String buildDqlFields(IDfSession session, NRJsonObject searchProperties, String objectType) throws Exception
	{
		//object_name LIKE '%�����%' AND  not(doc_date is nulldate) AND doc_date >= DATE('02/08/2015 00:00:00', 'dd/mm/yyyy hh:mi:ss') AND doc_date <= DATE('05/08/2015 23:59:59', 'dd/mm/yyyy hh:mi:ss') AND doc_type = '20004' AND status = '999901' AND ( ANY LOWER(sender_id) LIKE '%or.fogel@ness.com%')

		String result = null;
		StringBuffer dqlFields = new StringBuffer("");

		IDfType dctmType = session.getType(objectType);
		
		Map<String, Object> properties = searchProperties.getProperties();
		Map<String, Object> singleJson = (Map<String, Object>) properties.get("singleProperties");
		Map<String, Object> repeatingJson = (Map<String, Object>) properties.get("repeatingProperties");
		Map<String, Object> outlookJson = (Map<String, Object>) properties.get("outlookProperties");
		Map<String, Object> typeAttributeJson = (Map<String, Object>) properties.get("typeAttributeProperties");
		
		for (Map.Entry entry : singleJson.entrySet())
		{
				String name  = (String) entry.getKey();
				Object value = entry.getValue();
					
				int dataType = dctmType.getTypeAttrDataType(name);
					
				switch (dataType)
				{
					case IDfType.DF_BOOLEAN:
						Boolean attrBoolean = Boolean.parseBoolean(value.toString());
						dqlFields = dqlFields.append(" AND " + name +" = " +attrBoolean);
						break;
		
					case IDfType.DF_DOUBLE:
						double attDouble = Double.parseDouble(value.toString());
						
						dqlFields = dqlFields.append(" AND " + name + " = " + attDouble + " ");
						break;
		
					case IDfType.DF_INTEGER:
						double attInteger = Integer.parseInt(value.toString());
						dqlFields = dqlFields.append(" AND " + name + " = " + attInteger + " ");
						break;
						
					case IDfType.DF_TIME:
						String attrDate = (String)value;
						if (attrDate!=null)
						{
							if (isValidDate(attrDate, NRDfcPropertiesDateFormat.getDfcPropertiesDateFormat()) ) {
								dqlFields.append(" AND " + buildDateExpression(name, attrDate, NRConstants.EQUAL));
							}
						}
						break;
						
					case IDfType.DF_STRING:
						String attrString = (String)value;
							
						if(name.equals("a_content_type"))
							convertContentType(attrString, dqlFields);
						else
							dqlFields = dqlFields.append(" AND " + name + " LIKE '%" + attrString + "%' ");
						
						break;
				}
			}
		
			for (Map.Entry repeatingEntry : repeatingJson.entrySet())
			{
				String name  = (String) repeatingEntry.getKey();
				Object value = repeatingEntry.getValue();
				String attrString = null;
				List repeatingLisString = null;
				if(value instanceof String)
				{
					attrString = (String)value;
					String attRepeating = attrString.replaceAll(NRConstants.APOSTROPHE, NRConstants.DOUBLE_APOSTROPHE).toLowerCase();
					dqlFields.append(" AND ANY LOWER("+name+") LIKE '%" + attRepeating + "%' ");
				}
				else if(value instanceof ArrayList)
				{
					repeatingLisString = (ArrayList) value;
					appendRepeatingAttribute(name, repeatingLisString, dqlFields);
				}
			}
			
			for (Map.Entry outlookEntry : outlookJson.entrySet())
			{
				String name  = (String) outlookEntry.getKey();
				Object value = outlookEntry.getValue();
				
				List attrString = (ArrayList) value;
				
				appendRepeatingAttribute(name, attrString, dqlFields);
			}
			
			for (Map.Entry typeAttributeEntry : typeAttributeJson.entrySet())
			{
				String[] values =
				{
					NRConstants.OP_SMALL_EQ,
					NRConstants.OP_GREAT_EQ
				};
				
				Object value = typeAttributeEntry.getValue();
				String attrDate = (String)value;
				String[] split = attrDate.split("__");
				if(split.length == 3)
				{
					for(int index = 0; index < operator.length; index++)
					{
						if(operator[index].equals(split[2]))
						{
							dqlFields.append(" AND " + buildDateExpression(split[1], split[0], values[index]));
						}
					}
				}
			}

		result = dqlFields.toString();
		return result;
	}
	
	private void convertContentType(String content_type, StringBuffer dqlFields) 
	{
		String[] values =
		{
			NRConstants.FORMAT_SUBQUERY_WORD,
			NRConstants.FORMAT_SUBQUERY_EXCEL,
			NRConstants.FORMAT_SUBQUERY_POWERPOINT,
			NRConstants.FORMAT_SUBQUERY_OUTLOOK,
			NRConstants.FORMAT_SUBQUERY_PDF,
			NRConstants.FORMAT_SUBQUERY_TIF,
			NRConstants.FORMAT_SUBQUERY_IMAGE,
			NRConstants.FORMAT_SUBQUERY_AUDIO,
			NRConstants.FORMAT_SUBQUERY_VIDEO,
			NRConstants.FORMAT_SUBQUERY_TEXT,
			NRConstants.FORMAT_SUBQUERY_HTML,
			NRConstants.FORMAT_SUBQUERY_ARCHIVE,
			NRConstants.FORMAT_SUBQUERY_XML,
			NRConstants.FORMAT_SUBQUERY_AUTOCAD,
			NRConstants.FORMAT_SUBQUERY_CSS,
			NRConstants.FORMAT_SUBQUERY_CSV,
			NRConstants.FORMAT_SUBQUERY_JAVA
		};
			
		for(int index = 0; index < lables.length; index++)
		{
			if(lables[index].equals(content_type))
			{
				dqlFields.append(" AND " + values[index] + " ");
			}
		}
	}

	private void appendRepeatingAttribute(String attributeName, List <String> repeatingList, StringBuffer dqlFields)
	{
		for (String item : repeatingList)
		{
			dqlFields.append(" AND ANY LOWER (" + attributeName + ") = '"+ item.replace(NRConstants.APOSTROPHE, NRConstants.DOUBLE_APOSTROPHE).toLowerCase() + "'");
		}
	}
	
	private boolean isValidDate(String docDate, String formatString) {
		if (StringUtil.isEmptyOrNull(docDate)) {
			return false;
		}
		SimpleDateFormat format = new SimpleDateFormat(formatString);
		try {
			format.parse(docDate);
		} catch (ParseException e) {
			return false;
		}
		return true;
	}
	
	private String buildDateExpression(String attribute, String date, String operand) throws IOException
	{
		StringBuffer result = new StringBuffer();
		
		result.append(attribute).append(operand);
		result.append("DATE('").append(date).append("', '");
		result.append(NRDfcPropertiesDateFormat.getDfcPropertiesDqlDateFormat()).append("')");
		
		return result.toString();
	}
	
	private String getFolderPath(IDfSession session,String query, String[] params) throws Exception
	{
		String queryFolderPath = NRUtils.buildText(query, params);
		return NRUtils.executeQuery(session, queryFolderPath,NRConstants.ATTR_FOLDER_PATH);
	}
	
	private String dqlizeAposrophsAndQuotes(String value)
	{
		if (value != null)
		{
			value = value.replace(NRConstants.APOSTROPHE, NRConstants.DOUBLE_APOSTROPHE);
			value = value.replace(NRConstants.QUOTE, "");
		}
		return value;
	}
}