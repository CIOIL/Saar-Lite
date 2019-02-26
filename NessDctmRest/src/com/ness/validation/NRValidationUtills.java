package com.ness.validation;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import com.ness.objects.NRJsonObject;
import com.ness.utils.NRConstants;
import com.ness.utils.NRDfcPropertiesDateFormat;
import com.ness.utils.NRUtils;

public class NRValidationUtills {
	
	private static SimpleDateFormat df = initDfcDateFormat();
	
	public static NRJsonObject validateFieldsArray(INRValidateFieldCommand command, NRJsonObject object, String[] fieldsArr, String error)
	{
		NRJsonObject validationObject = new NRJsonObject();
		
		for (int index = 0; index < fieldsArr.length; index++) 
		{
			Object fieldValue = object.getProperties().get(fieldsArr[index]);
			if(fieldValue != null)
			{
				List<Object> fieldAsArray = convertFieldValueToArray(fieldValue);
				try
				{
					if (!(fieldValue != null && command.execute(fieldAsArray)))
					{
	
						validationObject.getProperties().put(fieldsArr[index], error);
					}
				}
				catch (Exception e)
				{ //if any command.execute() throws an exception, report error for that field
					validationObject.getProperties().put(fieldsArr[index], error);
				}
			}
		}

		if (validationObject.getProperties().isEmpty()) 
		{
			return null;
		}
		else
		{
			return validationObject;
		}
	}
	
	private static SimpleDateFormat initDfcDateFormat()
	{
		SimpleDateFormat sdf = null;
		try
		{
			sdf = new SimpleDateFormat(NRDfcPropertiesDateFormat.getDfcPropertiesDateFormat());
		}
		catch (IOException e)
		{
			
		}
		return sdf;
	}

	public static boolean isValidFolderId(String folderId)
	{
		boolean result = true;
		if (!NRConstants.SPECIAL_FOLDERS_IDS.containsKey(folderId))
		{
			result = folderId.length() == NRConstants.R_OBJECT_ID_LENGTH && (folderId.startsWith(NRConstants.FOLDER_OBJECT_PREFIX) || folderId.startsWith(NRConstants.CABINET_OBJECT_PREFIX));
		}
		return result;
	}

	public static boolean isValidObjectId(String objectId)
	{
		return objectId.length() == NRConstants.R_OBJECT_ID_LENGTH && (objectId.startsWith(NRConstants.DOCUMENT_OBJECT_PREFIX) || objectId.startsWith(NRConstants.FOLDER_OBJECT_PREFIX));
	}
	
	public static boolean isValidGovId(String govId)
	{
		String govIdRegex = "[0-9\\\\-]{10,32}";
		return govId.matches(govIdRegex);
	}
	
/*	public static boolean isValidDocumentId(String objectId)
	{
		return objectId.length() == NRConstants.R_OBJECT_ID_LENGTH && (objectId.startsWith(NRConstants.DOCUMENT_OBJECT_PREFIX));
	}*/
	public static boolean isValidCabinetId(String cabinetId)
	{
		return cabinetId.length() == NRConstants.R_OBJECT_ID_LENGTH && (cabinetId.startsWith(NRConstants.CABINET_OBJECT_PREFIX));
	}
	
	public static List<Object> convertFieldValueToArray(Object fieldValue)
	{
		List<Object> result = new ArrayList<>();
		
		if (fieldValue instanceof Collection<?>)
		{
			result.addAll((Collection<?>) fieldValue);
		}
		else if (fieldValue instanceof Object) 
		{
			result.add(fieldValue);
		}
		
		return result;
	}
	
	public static class ValidateRequiredFieldCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValue)
		{
			for (Object object : fieldValue) {
				if (object.toString().isEmpty()) {
					return false;
				}
			}
			
			return true;
		}
	}
	
	public static class ValidateFolderIdsCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> folderIds)
		{
			//valid inputs: ["0b01b20780028739", "0c01b20780028956"]

			for (Object object : folderIds) {
				if (!isValidFolderId(object.toString().trim())) {
					return false;
				}
			}

			return true;
		}
	}
	
	
	public static class ValidateObjectIdsCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> objectIds)
		{
			//valid inputs: ["0901b20780028739", "0901b20780028956"]

			for (Object object : objectIds) {
				if (!isValidObjectId(object.toString().trim())) {
					return false;
				}
			}

			return true;
		}
	}
	
	public static class ValidateGovIdsCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> objectIds)
		{
			for (Object object : objectIds) {
				if (!isValidGovId(object.toString().trim())) {
					return false;
				}
			}

			return true;
		}
	}
	
	public static class ValidateDocumentFolderIdsCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> objectIds)
		{
			for(Object object : objectIds)
			{
				if(isValidCabinetId(object.toString().trim()))
				{
					return false;
				}
			}
			return true;
		}
	}

	public static class ValidateNumericCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValue)
		{
			for (Object object : fieldValue) {
				if (!object.toString().matches(NRConstants.REGEX_NUMERIC)) {
					return false;
				}
			}

			return true;
		}
	}
	
	public static class ValidateNumericOrEmptyCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValue)
		{
			for (Object object : fieldValue)
			{
				if(object.toString().length() == 0 || object == null){
					return true;
				}
				else if (!object.toString().matches(NRConstants.REGEX_NUMERIC)) {
					return false;
				}
			}

			return true;
		}
	}

	public static class ValidateLettersOnlyCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValue)
		{
			for (Object object : fieldValue)
			{
				if (!object.toString().matches(NRConstants.REGEX_LETTERS_ONLY) || object.toString().length() > NRConstants.MAX_FIELD_LENGTH) {
					return false;
				}
			}

			return true;
		}
	}
	
	public static class ValidateSenderNameValidCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValue)
		{
			for (Object object : fieldValue)
			{
				if (!object.toString().matches(NRConstants.REGEX_SENDER_NAME)) {
					return false;
				}
			}

			return true;
		}
	}
	
	
	public static class ValidateDateCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValue)
		{

			for (Object object : fieldValue) {

				String dateStr = object.toString();
				Date testDate = null;

				try
				{
					testDate = df.parse(dateStr);
				}
				catch (ParseException e)
				{
					return false;
				}

				if (!df.format(testDate).equals(dateStr))
				{
					return false;
				}
			}

			return true;
		}
	}
	
	public static class ValidateDateOrEmptyCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValue)
		{
			
			for (Object object : fieldValue)
			{
				String dateStr = object.toString();
				
				if(!dateStr.isEmpty())
				{
					Date testDate;
				
					try
					{
						testDate = df.parse(dateStr);
					}
					catch (ParseException e)
					{
						return false;
					}
	
					if (!df.format(testDate).equals(dateStr))
					{
						return false;
					}
				}
			}

			return true;
		}
	}
	
	public static class ValidateIsraeliIdCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValues) {
			
			if (fieldValues == null)
			{
				return false;
			}
			
			for (Object object : fieldValues)
			{
				String id = object.toString().trim();
				try
				{
					Integer.parseInt(id);
				}
				catch (NumberFormatException e)
				{
					return false;
				}
				
				if (id.length() > 9 || id.length() < 5)
				{
					return false;
				}
				
				String valueToValidate = id;
				
				while (valueToValidate.length() < 9)
				{
					valueToValidate = NRConstants.ZERO_CHAR + valueToValidate;
				}
				
				int totalNum = 0, incNum;
				for (int digit = 0; digit < 9; digit++)
				{
					incNum = Integer.parseInt(valueToValidate.substring(digit, digit + 1)) * ((digit % 2) + 1);
					if (incNum > 9)
					{
						incNum -= 9;
					}
					totalNum += incNum;
				}

				return totalNum % 10 == 0;
			}

			return true;
		}
	}
	
	public static class ValidateHebrewInputLengthObjectNameCommand implements INRValidateFieldCommand
	{
		@Override
		public boolean execute(List<Object> fieldValues)
		{
			if (fieldValues == null)
			{
				return false;
			}
			
			return NRUtils.validateHebrewInputLengthForAnAttribute(fieldValues.get(0).toString().trim(), 255);
		}
	}
}
