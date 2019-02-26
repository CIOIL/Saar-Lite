package operations;

import static constants.FileManagerConstants.KERBEROS;

import checkout.CheckoutManagerFactory;
import checkout.ICheckoutManager;
import interfaces.FileOperation;
import utils.CleanUtil;
import utils.RestUtil;

public class Print implements FileOperation
{
	@Override
	public String execute(String[] args)
	{
		String restUrl = args[1];
		String authorization = args[2];
		String json = args[3];
		ICheckoutManager checkoutManager = CheckoutManagerFactory.createManager(args[5]);
		String authenticationType = args[7];
		String docbase = null;
		if (authenticationType != null && KERBEROS.equals(authenticationType))
		{
			docbase = args[8];
		}
		String path = checkoutManager.getViewPath();

		RestUtil.print(restUrl, authorization, json, path, null, authenticationType, docbase);
		CleanUtil.cleanViewFiles();
		
		return null;
	}

}
