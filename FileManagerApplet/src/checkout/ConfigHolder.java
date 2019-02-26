package checkout;

public class ConfigHolder
{
	static String docbaseId;
	static String docbaseName;
	static String docbrokerName;
	
	public static String getDocbaseName()
	{
		return docbaseName;
	}
	public static void setDocbaseName(String docbaseName)
	{
		ConfigHolder.docbaseName = docbaseName;
	}
	public static String getDocbrokerName()
	{
		return docbrokerName;
	}
	public static void setDocbrokerName(String docbrokerName)
	{
		ConfigHolder.docbrokerName = docbrokerName;
	}
	public static String getDocbaseId()
	{
		return docbaseId;
	}
	public static void setDocbaseId(String docbaseId)
	{
		ConfigHolder.docbaseId = docbaseId;
	}
	
	
	
	
	
}
