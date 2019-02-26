package operations;

import static constants.FileManagerConstants.KERBEROS;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;

import javax.swing.JOptionPane;

import checkout.CheckoutManagerFactory;
import checkout.ICheckoutManager;
import checkout.SaarCheckoutManager;
import interfaces.FileOperation;
import utils.RestUtil;

public class Edit implements FileOperation
{
	String path2alreadyCheckedOutFile;

	@Override
	public String execute(String[] args)
	{
		String restUrl = args[1];
		String authorization = args[2];
		String json = args[3];
		boolean locked = "true".equals(args[4]);
		ICheckoutManager checkoutManager = CheckoutManagerFactory.createManager(args[5]);
		String checkoutPathArg =  args[6];
		if ("Saar".equals(args[5]) && !(checkoutPathArg == null || "".equals(checkoutPathArg))){
			SaarCheckoutManager.setCheckoutPath(checkoutPathArg);
		} 
		String authenticationType = args[7];
		String docbase = null;
		if (authenticationType != null && KERBEROS.equals(authenticationType)){
			docbase = args[8];
		}
		boolean fileExists = isFileExists(checkoutManager, args);
		if (locked && fileExists)
		{
			try
			{
				Desktop.getDesktop().open(new File(path2alreadyCheckedOutFile));
			} catch (IOException e)
			{
				e.printStackTrace();
			}
		} else if (locked && !fileExists)
		{
			// show message to user
			JOptionPane.showMessageDialog(null,
					"המיסמך נעל אל ידך בפעלת עריכה קודמת, המערחת תןץי אןתק חדש לקריאה בלבד.");
			String path = checkoutManager.getViewPath();	        
			RestUtil.download(restUrl, authorization, json, path, null, authenticationType, docbase);
		} else
		{
			String fileROjectId = RestUtil.getObjectIdFromJson(json);
			
			String path = checkoutManager.getCheckoutPath(fileROjectId);        
			String fullPath =  RestUtil.download(restUrl, authorization, json, path, null, authenticationType, docbase);
			
			
			checkoutManager.updatePropertiesFileOnCheckout(args, fileROjectId, fullPath);
		}
		return null;
	}

	private boolean isFileExists(ICheckoutManager checkoutManager, String[] args)
	{
		String json = args[3];
		String fileROjectId = RestUtil.getObjectIdFromJson(json);
		path2alreadyCheckedOutFile = checkoutManager.getPathByRobjectId(fileROjectId); 
		
		if (path2alreadyCheckedOutFile != null && new File(path2alreadyCheckedOutFile).exists()){
			return true;
		}

		return false;
	}
}
