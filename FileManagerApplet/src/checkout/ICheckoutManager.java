package checkout;

public interface ICheckoutManager
{
	 String getCheckoutPath(String rObjectId);
	 String getViewPath();
	 void updatePropertiesFileOnCheckout(String[] args, String rObjectId, String fullPath);
	 String getPathByRobjectId(String rObjectId);
	 void removePropertyEntryAndFileOnCheckin(String rObjectId);
	 void createPropertiesFileIfNotExists();
}
