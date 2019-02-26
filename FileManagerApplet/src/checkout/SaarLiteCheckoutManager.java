package checkout;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;
import constants.FileManagerConstants;

public class SaarLiteCheckoutManager implements ICheckoutManager
{
	private static final String CHECKOUT_PATH = System.getProperty("user.home") + "\\Documentum\\SaarLite\\checkout";
	private static final String VIEW_PATH = System.getProperty("user.home") + "\\Downloads\\Documentum\\SaarLite\\view";

	private static String propertiesFilePath = FileManagerConstants.CHECKOUT_REPOSITORY_PROPERTIES_PATH;

	public void updatePropertiesFileOnCheckout(String[] args, String rObjectId, String fullPath)
	{
		createPropertiesFileIfNotExists();

		try
		{
			Properties propertiesObject = new Properties();
			InputStreamReader in = new InputStreamReader(new FileInputStream(propertiesFilePath), "UTF-8");
			propertiesObject.load(in);
			in.close();

			propertiesObject.setProperty(rObjectId, fullPath);

			FileOutputStream out = new FileOutputStream(propertiesFilePath);
			propertiesObject.store(out, System.currentTimeMillis() + "");
			out.close();
		} catch (FileNotFoundException e)
		{
			e.printStackTrace();
		} catch (IOException e)
		{
			e.printStackTrace();
		}
	}

	public String getPathByRobjectId(String rObjectId)
	{
		String fullPath = null;
		File file = new File(propertiesFilePath);
		if (file.exists())
		{
			try
			{
				Properties propertiesObject = new Properties();
				FileInputStream in = new FileInputStream(propertiesFilePath);
				propertiesObject.load(in);
				in.close();
				fullPath = propertiesObject.getProperty(rObjectId);

			} catch (FileNotFoundException e)
			{
				e.printStackTrace();
			} catch (IOException e)
			{
				e.printStackTrace();
			}
		}
		return fullPath;
	}

	public void removePropertyEntryAndFileOnCheckin(String rObjectId)
	{
		try
		{
			Properties propertiesObject = new Properties();
			FileInputStream in = new FileInputStream(propertiesFilePath);
			propertiesObject.load(in);
			in.close();

			String fullPath = propertiesObject.getProperty(rObjectId);
			String directoryToDelete = fullPath.substring(0, fullPath.lastIndexOf('\\'));

			Files.delete(Paths.get(fullPath));
			Files.delete(Paths.get(directoryToDelete));

			propertiesObject.remove(rObjectId);

			FileOutputStream out = new FileOutputStream(propertiesFilePath);
			propertiesObject.store(out, System.currentTimeMillis() + "");
			out.close();

		} catch (FileNotFoundException e)
		{
			e.printStackTrace();
		} catch (IOException e)
		{
			e.printStackTrace();
		}
	}

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
		return CHECKOUT_PATH + "\\" + rObjectId ;
	}
	
	public String getViewPath(){
		return VIEW_PATH;
	}
}
