package com.ness.utils;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.container.ContainerRequestContext;

import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;
import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.common.DfException;
import com.documentum.fc.common.DfId;
import com.gov.base.sbo.IGovUnitService;
import com.ness.objects.NRFileObject;
import com.ness.objects.NRLoginInfo;
import com.ness.rest.userinfomethods.NRUserInfoMethods;

public class NRUtils
{	
	public static void handleErrors(Exception e)
	{
		e.printStackTrace();
		Logger.getLogger (NRUtils.class.getName()).log(Level.INFO, "!!!exception=" + e.getMessage());
	}
	
	public static boolean isEmpty(String value)
	{
		boolean isEmpty = false;
		
		if(value == null)
		{
			isEmpty = true;
		}
		else if(value.length() == 0)
		{
			isEmpty = true;
		}
		
		return isEmpty;
	}
	
	public static NRLoginInfo getRequestLoginInfo(ContainerRequestContext containerRequest)
	{
		NRLoginInfo loginInfo = null;
		
		loginInfo = (NRLoginInfo) containerRequest.getProperty(NRConstants.REQUEST_LOGIN_INFO);
		
		return loginInfo;
	}	
	
	public static ByteArrayOutputStream getByteArrayFromInputStream(InputStream inputStream) throws Exception
	{
		byte[] buff = new byte[8000];

		int bytesRead = 0;

        ByteArrayOutputStream bao = new ByteArrayOutputStream();

        while((bytesRead = inputStream.read(buff)) != -1)
        {
        	bao.write(buff, 0, bytesRead);
        }

        return bao;
	}
	
	public static String getFormatByFormData(IDfSession session, FormDataBodyPart file)
	{
		String formatName = null;
		
		try
		{
			formatName = getFormatNameFromDefaultFormats(session, getFileExtension(file.getContentDisposition().getFileName()));
			
			if (formatName == null)
			{
				formatName = getFormatNameByFileName(session, file.getContentDisposition().getFileName());
			}
			
			if(formatName == null)
			{
				formatName = getFormatNameByMimeType(session, file.getMediaType().toString());
			}
		}
		catch(Exception e)
		{
			handleErrors(e);
		}
		
		return formatName;
	}
	
	private static String getFormatNameFromDefaultFormats(IDfSession session, String dosExtension)
	{
		return NRDefaultFormats.getInstance().containsKey(dosExtension) ? NRDefaultFormats.getInstance().getValueByKey(dosExtension) : null;
	}	
	
	public static String getFormatNameByFileName(IDfSession session, String filename) throws Exception
	{
		String formatName = null;
		String fileExtension = getFileExtension(filename);
		
		if(fileExtension != null)
		{
			IDfCollection col = null;
			IDfQuery query = new DfQuery();
			
			try
			{
				query.setDQL(NRConstants.QUERY_FORMAT_BY_EXTENSION.replace(NRConstants.PARAM_1, fileExtension));
				
				col = query.execute(session, IDfQuery.DF_READ_QUERY);
				
				//If result was found
				if(col.next())
				{
					formatName = col.getString(NRConstants.NAME);
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
		}
		return formatName;		
	}
	
	public static String getFormatNameByMimeType(IDfSession session, String mimeType) throws Exception
	{
		String formatName = null;
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		try
		{
			query.setDQL(NRConstants.QUERY_FORMAT_BY_MIME.replace(NRConstants.PARAM_1, mimeType));
			
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			//If result was found
			if(col.next())
			{
				formatName = col.getString(NRConstants.NAME);
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
		
		return formatName;
	}
	
	public static String getMimeTypeByFormatName(IDfSession session, String formatName) throws Exception
	{
		String mimeType = null;
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		try
		{
			query.setDQL(NRConstants.QUERY_MIME_BY_FORMAT.replace(NRConstants.PARAM_1, formatName));
			
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			//If result was found
			if(col.next())
			{
				mimeType = col.getString(NRConstants.MIME_TYPE);
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
		
		return mimeType;
	}
	
	public static boolean executeUpdateQuery(IDfSession session, String queryDql) throws Exception
	{
		boolean sucessful = false;
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		try
		{
			query.setDQL(queryDql);
			
			col = query.execute(session, IDfQuery.DF_EXEC_QUERY);
			
			//If result was found
			sucessful = col.next();
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
		
		return sucessful;
	}	
	
	public static String executeQuery(IDfSession session, String queryDql, String attrName) throws Exception
	{
		String result = null;
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		try
		{
			query.setDQL(queryDql);
			
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			while(col.next())
			{
				result = col.getString(attrName);
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
		
		return result;
	}
	
	public static String[] getMimeTypeAndExtensionByFormatName(IDfSession session, String formatName) throws Exception
	{
		String[] mimeTypeAndExtension = null;
		
		IDfCollection col = null;
		IDfQuery query = new DfQuery();
		
		try
		{
			query.setDQL(NRConstants.QUERY_MIME_EXTENSION_BY_FORMAT.replace(NRConstants.PARAM_1, formatName));
			
			col = query.execute(session, IDfQuery.DF_READ_QUERY);
			
			//If result was found
			if(col.next())
			{
				mimeTypeAndExtension = new String[2];
				mimeTypeAndExtension[0] = col.getString(NRConstants.MIME_TYPE);
				mimeTypeAndExtension[1] = col.getString(NRConstants.DOS_EXTENSION);
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
		
		return mimeTypeAndExtension;
	}	
	
	private static String getFileExtension(String fileName)
	{
		String extension = null;

		int lastDotIndex = fileName.lastIndexOf(NRConstants.DOT);

		if(lastDotIndex > -1)
		{
		    extension = fileName.substring(lastDotIndex + 1);
		}
		
		return extension;
	}
	
	public static String getFileNameForUpload(String inputName) throws Exception
	{
		return new String(inputName.getBytes(NRConstants.ISO_8859_1), NRConstants.UTF_8);
	}
	
	public static String stringToUTF(String text)
	{
		String utfString = null;
		
		for(int index = 0 ; index < text.length() ; index++)
		{
			if(index == 0)
			{
				utfString = new String();
			}
			
			utfString += toUnicode(text.charAt(index));
		}
		
		return utfString;
	}

	private static String toUnicode(char ch)
	{
		return String.format(NRConstants.UTF_PREFIX, (int) ch);
	}

	public static List<String> objectToList(Object object)
	{
		List<String> list = null;
		
		if(object != null)
		{
			list = new ArrayList<String>();
			
			if(object instanceof ArrayList<?>)
			{
				List<?> tempList = (ArrayList<?>) object;
				
				for(int index = 0 ; index < tempList.size() ; index++)
				{
					list.add(tempList.get(index) != null ? tempList.get(index).toString() : null);
				}
			}
			else
			{
				list.add(object.toString());
			}
		}
		
		return list;
	}
	
	public static NRFileObject getObjectContent(IDfSession session, String objectId, String contentType) throws Exception
	{
		NRFileObject fileToReturn = new NRFileObject();
		
		try
		{
			IDfSysObject dctmObject = (IDfSysObject) session.getObject(new DfId(objectId));
			String unitLayer = getUnitLayerNameByObjectId(session, objectId);
			fileToReturn.setUnitLayer(unitLayer);
			
			if(contentType != null && contentType.length() > 0)
			{
				fileToReturn.setInputStream(dctmObject.getContentEx(contentType, 0));
				fileToReturn.setTypeAndExtension(NRUtils.getMimeTypeAndExtensionByFormatName(session, contentType));
			}
			else
			{
				fileToReturn.setInputStream(dctmObject.getContent());
				fileToReturn.setTypeAndExtension(NRUtils.getMimeTypeAndExtensionByFormatName(session, dctmObject.getString(NRConstants.A_CONTENT_TYPE)));
			}
			
			fileToReturn.setGovId(dctmObject.getString(NRConstants.GOV_ID));
			fileToReturn.setName(dctmObject.getObjectName());
		}
		catch(Exception e)
		{
			//NRUtils.handleErrors(e);
			fileToReturn = null;
		}
		
		return fileToReturn;
	}	
	
	private static String getUnitLayerNameByObjectId(IDfSession session, String objectId) throws DfException
	{
		boolean unitFound = false;
		String unitId = objectId;
		String result = null;
		
		while (!unitFound && unitId != null)
		{
			IDfSysObject unit = (IDfSysObject) session.getObject(new DfId(unitId));
			unitId = unit.getFolderId(0).getId();
			
			if (NRConstants.GOV_UNIT_FOLDER.equals(unit.getType().getName()))
			{
				unitFound = true;
				unitId = null;
				result = unit.getString(NRConstants.UNIT_LAYER_NAME);
			}
			
			if (NRConstants.DM_CABINET.equals(unit.getType().getName()))
			{
				throw new DfException("ERROR: unit not found!!!");
			}
		}
		return result;
	}

	/** 
	 * Build a text statement with the parameters embedded instead of the ? marks.
	 * @param src The source text
	 * @param parameters The parameters
	 * @return String
	 */ 
	public static String buildText(String src, String[] parameters)
	{
		StringBuffer sb = new StringBuffer(4096);
		String placeHolder;
		int point = 0;
		int lastPos = 0;
		
		for (int i = 0; i < parameters.length && point != -1 ; i++)
		{
			placeHolder = NRConstants.CHAR_PERCENTAGE + String.valueOf(i+1); 
			point = src.indexOf(placeHolder, lastPos);
			
			if (point != -1)
			{
				sb.append(src.substring(lastPos, point));
				sb.append(parameters[i]);
				lastPos = point + 2;
			}
		}
		
		if (lastPos < src.length())
		{
			sb.append(src.substring(lastPos, src.length()));
		}
		
		return sb.toString();
	}
	/**
	 * Getting UnitId from FolderId
	 * Using the GovUnitService Method
	 * @param session
	 * @param objectId
	 * @return String UnitId
	 * @throws Exception
	 */
	public static String getUnitId(IDfSession session,String objectId) throws Exception
	{	
		IGovUnitService unitService;
		String unitId = null;
		try 
		{
			unitService = (IGovUnitService) session.getClient().newService(NRConstants.UNIT_SERVICE_CLASS, session.getSessionManager());
			unitId = unitService.getUnitId(objectId, session.getDocbaseName());
		} 
		catch(Exception e) 
		{
			NRUtils.handleErrors(e);
		}
	
		return unitId;
	}
	
	public static String getRequestBody(ContainerRequestContext request) throws IOException {

        String body = null;
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        
        body = IOUtils.toString(request.getEntityStream(), "UTF-8");
        if (body != null){
        	return body;
        }

        try {
            InputStream inputStream = request.getEntityStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException ex) {
            throw ex;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }

        body = stringBuilder.toString();
        return body;
    }
	
	public static boolean isRecordFolder(String objectId){
		boolean isFolder = false;
		if((objectId.length() == 16) && (objectId.indexOf("0b") == 0 || objectId.indexOf("0c") == 0) )
		{
			isFolder = true;
		}

		return isFolder;
	}

	public static String processObjectNameLength(String eventDesc)
	{
		return trancateAttributeValueByAttributeLength(eventDesc, 255);
	}

	public static String processEventDescriptionLength(String eventDesc)
	{
		String result;
		String processedEventDesc = NRUtils.trancateAttributeValueByAttributeLength(eventDesc, 4000);

		if (processedEventDesc.length() >= 3996)
		{
			result = processedEventDesc.substring(0, 3997).concat("...");
		}
		else
		{
			result = processedEventDesc;
		}
		
		return result;
	}

	private static String trancateAttributeValueByAttributeLength(String attributeValue, int attributeLength) {
		
		int count = 0;
		boolean matches;
		String currentChar;
		
		for (int i = 0; i < attributeValue.length(); i++)
		{
			currentChar = String.valueOf(attributeValue.charAt(i));
			matches = currentChar.matches(NRConstants.NOT_A_HEBREW_CHAR_REGEX);
			count = matches ? count + 1 : count + 2;
			
			if (count >= attributeLength)
			{
				attributeValue = attributeValue.substring(0, i);
				break;
			}
		}
		
		return attributeValue;
	}

	public static boolean validateHebrewInputLengthForAnAttribute (String attributeValue, int attributeLength)
	{
		int count = 0;
		boolean matches;
		String currentChar;
		
		for (int i = 0; i < attributeValue.length(); i++)
		{
			currentChar = String.valueOf(attributeValue.charAt(i));
			matches = currentChar.matches(NRConstants.NOT_A_HEBREW_CHAR_REGEX);
			count = matches ? count + 1 : count + 2;
			
			if (count >= attributeLength)
			{
				return false;
			}
		}
		return true;
	}
//	public static String getResponseBody(ContainerResponseContext response){
//		ByteArrayOutputStream baos = new ByteArrayOutputStream();
//		return baos.write(response.getEntityStream()).toString( "UTF-8" );
//	}

	public static void clearSensitiveData(NRLoginInfo loginInfo)
	{
		if (loginInfo != null)
		{
			loginInfo.setDocbase(null);
			loginInfo.setDomain(null);
			loginInfo.setPassword(null);
			loginInfo.setUsername(null);
			loginInfo = null;
		}
	}
	
	public static List<String> getObjectsTypeByUnitId(IDfSession session, String unitLayerName) throws DfException
	{
		List<String> objectType = new ArrayList<String>();
		if(unitLayerName!= null && !unitLayerName.contains("-"))
		{
			NRUserInfoMethods nrUserInfoMethods =  new NRUserInfoMethods();
			Map <String, String> unitLayerObjectTypes = nrUserInfoMethods.getUnitLayerObjectTypes(unitLayerName, session, "document", false);
			for (Entry<String, String> entry : unitLayerObjectTypes.entrySet())
			{
				objectType.add(entry.getKey());
			}
		}
		else
		{
			objectType.add(NRConstants.GOV_DOCUMENT);
		}
		return objectType;
	}
}
