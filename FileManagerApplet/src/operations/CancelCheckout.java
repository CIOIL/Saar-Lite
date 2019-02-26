package operations;

import static constants.FileManagerConstants.AUTHENTICATION_PROPERTY_KEY;
import static constants.FileManagerConstants.AUTHTENTICATION_TYPE_PROPERTY_KEY;
import static constants.FileManagerConstants.DOCBASE_PROPERTY_KEY;
import static constants.FileManagerConstants.KERBEROS;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import checkout.CheckoutManagerFactory;
import checkout.ICheckoutManager;
import checkout.SaarCheckoutManager;
import interfaces.FileOperation;

public class CancelCheckout implements FileOperation {
		
	@Override
	public String execute(String[] args) {
		String success = "success";
		ICheckoutManager checkoutManager = CheckoutManagerFactory.createManager(args[4]);
		String restUrl = args[1];
		String authorization = args[2];
		String rObjectId = args[3];
		String checkoutPathArg =  args[5];
		if ("Saar".equals(args[4]) && !(checkoutPathArg == null || "".equals(checkoutPathArg))){
			SaarCheckoutManager.setCheckoutPath(checkoutPathArg);
		}
		String authenticationType = args[6];
		String docbase = null;
		if (authenticationType != null && KERBEROS.equals(authenticationType)){
			docbase = args[7];
		}
		try
		{
			URL serverUrl = new URL(restUrl);
			HttpURLConnection urlConnection = (HttpURLConnection) serverUrl.openConnection();
			// Indicate that we want to write to the HTTP request body
			urlConnection.setDoOutput(true);
			urlConnection.setRequestMethod("POST");
			urlConnection.addRequestProperty(AUTHENTICATION_PROPERTY_KEY, authorization);
			urlConnection.addRequestProperty(AUTHTENTICATION_TYPE_PROPERTY_KEY, authenticationType);
			if (authenticationType != null && KERBEROS.equals(authenticationType)){
				urlConnection.addRequestProperty(DOCBASE_PROPERTY_KEY, docbase);
			}
			// read response
			BufferedReader httpResponseReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
			String lineRead;
			StringBuilder stringBuilder = new StringBuilder();
			while ((lineRead = httpResponseReader.readLine()) != null)
			{
				System.out.println(lineRead);
				stringBuilder.append(lineRead);
			}
			httpResponseReader.close();
			String response = stringBuilder.toString();
			System.out.println("Cancel Checkout: " + response);
			try {
			   checkoutManager.removePropertyEntryAndFileOnCheckin(rObjectId);
			} catch (Exception e){
				return success;
			}
		}
		catch (Exception e)
		{
			success = "error";
			e.printStackTrace();
		}
		return success;
	}

}
