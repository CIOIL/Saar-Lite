package checkout;

import static constants.FileManagerConstants.KERBEROS;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import utils.FileUtil;
import utils.RestUtil;

public class SaarCheckoutManager implements ICheckoutManager
{
	private static  String CHECKOUT_PATH = System.getProperty("user.home") + "\\Documentum\\Checkout";
	public static  String VIEW_PATH = System.getProperty("user.home") + "\\Downloads\\Documentum\\SaarLite\\view";
	private static String propertiesFilePath = System.getProperty("user.home") + "\\Documentum\\documentum.ini";
	private static String propertiesFileCopyPath = System.getProperty("user.home") + "\\Documentum\\documentum.copy";
    private static String fileName;
	@Override
	public void updatePropertiesFileOnCheckout(String[] args, String rObjectId, String fullPath)
	{
		createPropertiesFileIfNotExists();

		String properties = requestProperties(args, rObjectId, fullPath);
		System.out.println(properties);
		System.out.println("Start write: " + new Date().getTime());
		try
		{
			FileUtil.copyFile(new File(propertiesFilePath), new File(propertiesFileCopyPath));
		} catch (IOException e1)
		{
			e1.printStackTrace();
			return; // ?? return in case cannot make copy
		}
		try
		{

			String content = readFile(propertiesFilePath, "UTF-8");
			content = content + properties;
			writeFile(propertiesFilePath, content, "UTF-8");

		} catch (Exception e)
		{
			e.printStackTrace();
			// rename copy back
			new File(propertiesFilePath).delete(); // delete corrupted properties file
			FileUtil.renameFile(propertiesFileCopyPath, "documentum.ini");
			return; // don't remove file if entry was not deleted from documentum.ini
		}
		new File(propertiesFileCopyPath).delete(); // delete copy of properties file
		System.out.println("Finish write: " + new Date().getTime());
	}

	private void writeFile(String propertiesFilePath, String content, String encoding) throws Exception
	{
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(propertiesFilePath), encoding));
		try
		{
			out.write(content);
		} finally
		{
			out.close();
		}

	}

	private String requestProperties(String[] args, String rObjectId, String fullPath)
	{
		String restUrl = args[1];
		String authorization = args[2];
		String authenticationType = args[7];
		String docbase = null;
		if (authenticationType != null && KERBEROS.equals(authenticationType)){
			docbase = args[8];
		}
		String json = RestUtil.getObjectJson(restUrl, authorization, "gov_document", rObjectId, authenticationType, docbase);
		Map<String, String> jsonMap = parseJson(json);
		String repositoryId = Integer.parseInt(rObjectId.substring(2, 8), 16) + "";
		if (ConfigHolder.getDocbaseName() == null || ConfigHolder.getDocbrokerName() == null
				|| ConfigHolder.docbaseId != repositoryId)
		{
			initConfig(restUrl, authorization, repositoryId, authenticationType, docbase);
		}

		StringBuilder propertiesBuilder = new StringBuilder();
		propertiesBuilder.append(System.lineSeparator()).append("[documentum\\Common\\WorkingFiles\\");
		propertiesBuilder.append(rObjectId).append("]").append(System.lineSeparator());
		//String objName = getObjNameFromPath(fullPath);
		int filenameIndexOfDot = fileName.indexOf(".");
		String objName = fileName;
		if (filenameIndexOfDot > -1){
			objName = fileName.substring(0, filenameIndexOfDot);
		}
		propertiesBuilder.append("ObjName=").append(objName).append(System.lineSeparator());
		propertiesBuilder.append("Type=").append(jsonMap.get("r_object_type")).append(System.lineSeparator());
		propertiesBuilder.append("FileName=").append(fullPath).append(System.lineSeparator());
		propertiesBuilder.append("VStamp=").append(jsonMap.get("i_vstamp")).append(System.lineSeparator());
		propertiesBuilder.append("FolderPath=").append(System.lineSeparator());
		propertiesBuilder.append("DocbaseId=").append(repositoryId).append(System.lineSeparator());
		propertiesBuilder.append("DocbaseName=").append(ConfigHolder.getDocbaseName()).append(System.lineSeparator());
		propertiesBuilder.append("DocbrokerName=").append(ConfigHolder.getDocbrokerName())
				.append(System.lineSeparator());
		propertiesBuilder.append("DomainName=").append(System.lineSeparator());
		propertiesBuilder.append("User=").append(jsonMap.get("r_creator_name")).append(System.lineSeparator());
		propertiesBuilder.append("Format=").append(jsonMap.get("a_content_type")).append(System.lineSeparator());
		propertiesBuilder.append("FormatDescription=").append(System.lineSeparator());
		propertiesBuilder.append("Title=").append(System.lineSeparator());
		propertiesBuilder.append("CreatedAsLocalCopy=false").append(System.lineSeparator());
		propertiesBuilder.append("KeepLocalFile=false").append(System.lineSeparator());
		String modified = new SimpleDateFormat("EEE MMM dd HH:mm:ss yyyy").format(new Date());
		propertiesBuilder.append("Modified=").append(modified).append(System.lineSeparator());
		propertiesBuilder.append("UserName=").append(jsonMap.get("r_creator_name")).append(System.lineSeparator());
		propertiesBuilder.append("Version=").append(jsonMap.get("r_version_label")).append(System.lineSeparator());
		return propertiesBuilder.toString();
	}

	private String getObjNameFromPath(String fullPath)
	{
		int indexOfLastSlash = fullPath.lastIndexOf("\\");
		int lastIndexOfDot = fullPath.lastIndexOf(".");
		if (lastIndexOfDot > -1)
		{
			return fullPath.substring(indexOfLastSlash + 1, lastIndexOfDot);
		} else
		{
			return fullPath.substring(indexOfLastSlash);
		}
	}

	private void initConfig(String restUrl, String authorization, String repositoryId, String authenticationType, String docbase)
	{
		String json = RestUtil.getConfigJson(restUrl, authorization, repositoryId, authenticationType, docbase);
		Map<String, String> jsonMap = new HashMap<String, String>();
		json = json.replace("{\"properties\":{", "");
		json = json.replace("}}", "");
		String[] jsonData = json.replace("\"", "").split(",{1}");
		for (String s : jsonData)
		{
			String[] sData = s.split(":");
			jsonMap.put(sData[0], sData.length > 1 ? sData[1] : "");
		}
		ConfigHolder.setDocbaseId(repositoryId);
		ConfigHolder.setDocbaseName(jsonMap.get("docbaseName"));
		ConfigHolder.setDocbrokerName(jsonMap.get("hostName") + ",," + jsonMap.get("portNumber"));
	}

	private Map<String, String> parseJson(String json)
	{
		Map<String, String> jsonMap = new HashMap<String, String>();
		json = json.replace("{\"properties\":{", "");
		json = json.replace("}}", "");
		if (json.indexOf("r_version_label\":[") > 0)
		{
			int indexOfVersionLabel = json.indexOf(",\"r_version_label");
			String beforeVersionLabel = json.substring(0, indexOfVersionLabel);
			String[] beforeVersionLabelData = beforeVersionLabel.replace("\"", "").split(",");
			for (String s : beforeVersionLabelData)
			{
				String[] sData = s.split(":");
				jsonMap.put(sData[0], sData.length > 1 ? sData[1] : "");
			}

			int indexOfSquareBracket = json.indexOf("]", indexOfVersionLabel);
			String versionLabel = json.substring(indexOfVersionLabel, indexOfSquareBracket);
			versionLabel = versionLabel.substring(versionLabel.indexOf("[") + 1).replace("\"", "");
			jsonMap.put("r_version_label", versionLabel);
			String afterVersionLabel = json.substring(indexOfSquareBracket + 3);
			String[] afterVersionLabelData = afterVersionLabel.replace("\"", "").split(",");
			for (String s : afterVersionLabelData)
			{
				String[] sData = s.split(":");
				jsonMap.put(sData[0], sData.length > 1 ? sData[1] : "");
			}
		} else
		{
			String[] jsonData = json.replace("\"", "").split(",");
			for (String s : jsonData)
			{
				String[] sData = s.split(":");
				jsonMap.put(sData[0], sData.length > 1 ? sData[1] : "");
			}
		}
		return jsonMap;
	}

	@Override
	public String getPathByRobjectId(String rObjectId)
	{
		String fullPath = null;
		File file = new File(propertiesFilePath);
		if (file.exists())
		{
			try
			{
				String content = readFile(file.getAbsolutePath(), "UTF-8");
				int indexOfRObjectId = content.indexOf(rObjectId);
				if (indexOfRObjectId > -1)
				{
					int indexOfDiskLetter = content.indexOf(":", indexOfRObjectId) - 1;
					int indexOfVStamp = content.indexOf("VStamp", indexOfDiskLetter);
					fullPath = content.substring(indexOfDiskLetter, indexOfVStamp).replace("\r\n|\r|\n|\n\r", "").trim();

				}
			} catch (Exception e)
			{
				e.printStackTrace();
			}
		}
		return fullPath;
	}

	@Override
	public void removePropertyEntryAndFileOnCheckin(String rObjectId)
	{
		String content = null;
		String path = null;
		// make copy to file
		System.out.println("Start remove: " + new Date().getTime());
		try
		{
			FileUtil.copyFile(new File(propertiesFilePath), new File(propertiesFileCopyPath));
		} catch (IOException e1)
		{
			e1.printStackTrace();
			return; // ?? return in case cannot make copy
		}
		try
		{
			content = readFile(propertiesFilePath, "UTF-8");
			int indexOfRObjectId = content.indexOf(rObjectId);
			if (indexOfRObjectId > -1)
			{
				int removeStart = indexOfRObjectId - 32;
				System.out.println("removeStart =" + removeStart);
				int removeFinish = content.indexOf("[documentum", indexOfRObjectId);
				System.out.println("removeFinish =" + removeFinish);
				path = content.substring(content.indexOf("FileName", indexOfRObjectId) + 9,
						content.indexOf("VStamp", indexOfRObjectId)).replace("\r\n|\r|\n|\n\r", "").trim();
				System.out.println("path =" + path);
				if (removeFinish > -1)
				{
					content = content.substring(0, removeStart) + content.substring(removeFinish);
				} else
				{
					content = content.substring(0, removeStart);
				}
				//				FileWriter writer = new FileWriter(propertiesFilePath, false);
				//				writer.write(content.trim());
				//				writer.close();
				writeFile(propertiesFilePath, content, "UTF-8");
			}
		} catch (Exception e)
		{
			e.printStackTrace();
			// rename copy back
			new File(propertiesFilePath).delete(); // delete corrupted
													// properties file
			FileUtil.renameFile(propertiesFileCopyPath, "documentum.ini");
			return; // don't remove file if entry was not deleted from
					// documentum.ini
		}
		new File(path).delete(); // delete document
		new File(propertiesFileCopyPath).delete(); // delete copy of properties
													// file
		System.out.println("Finish remove: " + new Date().getTime());
	}

	@Override
	public void createPropertiesFileIfNotExists()
	{
		File file = new File(propertiesFilePath);
		file.getParentFile().mkdirs();
		if (!file.exists())
		{
			try
			{
				file.createNewFile();
			} catch (IOException e)
			{
				e.printStackTrace();
			}
		}
		
	}

	@Override
	public String getCheckoutPath(String rObjectId)
	{
		return CHECKOUT_PATH;
		
	}

	@Override
	public String getViewPath()
	{
		return VIEW_PATH;
	}

	static String readFile(String path, String encoding) throws IOException
	{
		BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(path), encoding));
		String str;
		StringBuilder contentBuilder = new StringBuilder();
		try
		{
			while ((str = in.readLine()) != null)
			{
				System.out.println(str);
				contentBuilder.append(str).append(System.lineSeparator());
			}

			in.close();
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		return contentBuilder.toString();
	}
	
	public static void setCheckoutPath(String checkoutPathArg)
	{
//		CHECKOUT_PATH = checkoutPathArg + "\\Documentum\\Checkout";
//		//VIEW_PATH = checkoutPathArg + "\\Downloads\\Documentum\\SaarLite\\view";
//		propertiesFilePath = checkoutPathArg + "\\Documentum\\documentum.ini";
//		propertiesFileCopyPath = checkoutPathArg + "\\Documentum\\documentum.copy";
		
		CHECKOUT_PATH = checkoutPathArg;
		//VIEW_PATH = checkoutPathArg;
		propertiesFilePath = checkoutPathArg.substring(0, checkoutPathArg.lastIndexOf("\\")) + "\\documentum.ini";
		propertiesFileCopyPath = checkoutPathArg.substring(0, checkoutPathArg.lastIndexOf("\\")) + "\\documentum.copy";
	}
	
	public static void setFilename(String fileName)
	{
		SaarCheckoutManager.fileName = fileName;		
	}

	public static String getFileName()
	{
		return fileName;
	}
}
