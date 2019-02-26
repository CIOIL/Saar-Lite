package operations;

import static constants.FileManagerConstants.KERBEROS;

import checkout.CheckoutManagerFactory;
import checkout.ICheckoutManager;
import constants.FileManagerConstants;
import interfaces.FileOperation;
import utils.CleanUtil;
import utils.RestUtil;

public class Distribution implements FileOperation
{


	@Override
	public String execute(String[] args)
	{
		String restUrl = args[1];
		String authorization = args[2];
		String json = args[3];
		
		ICheckoutManager checkoutManager = CheckoutManagerFactory.createManager(args[4]);
        String path = checkoutManager.getViewPath();
        
        String authenticationType = args[5];
        
        String docbase = null;
		if (authenticationType != null && KERBEROS.equals(authenticationType)){
			docbase = args[6];
		}
        
        RestUtil.download(restUrl, authorization, json, path, FileManagerConstants.EMAIL_FILE, authenticationType, docbase);
        CleanUtil.cleanViewFiles();

		return null;
	}
	
}
