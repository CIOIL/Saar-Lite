package operations;


import static constants.FileManagerConstants.AUTHENTICATION_PROPERTY_KEY;
import static constants.FileManagerConstants.AUTHTENTICATION_TYPE_PROPERTY_KEY;
import static constants.FileManagerConstants.DOCBASE_PROPERTY_KEY;
import static constants.FileManagerConstants.KERBEROS;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import checkout.CheckoutManagerFactory;
import checkout.ICheckoutManager;
import checkout.SaarCheckoutManager;
import interfaces.FileOperation;

/**
 * Parameters to pass in the array: [0] - operation class name, [1] - restUrl,
 * [2] - authorization String base64 encoded, [3] - record's r_object_id
 */

public class Checkin implements FileOperation
{



	@Override
	public String execute(String[] args)
	{
		ICheckoutManager checkoutManager = CheckoutManagerFactory.createManager(args[4]);
		String r_object_id = null;

		String restUrl = args[1];
		String authorization = args[2];
		String rObjectId = args[3];
		String checkoutPathArg =  args[5];
		String versionPolicy = args[8];
		if ("Saar".equals(args[4]) && !(checkoutPathArg == null || "".equals(checkoutPathArg))){
			SaarCheckoutManager.setCheckoutPath(checkoutPathArg);
		} 
		String authenticationType = args[6];
		String docbase = null;
		if (authenticationType != null && KERBEROS.equals(authenticationType)){
			docbase = args[7];
		}
		
		String filePath = null;

		try
		{

			filePath = checkoutManager.getPathByRobjectId(rObjectId).trim();
			System.out.println(filePath);

			URL serverUrl = new URL(restUrl);
			HttpURLConnection urlConnection = (HttpURLConnection) serverUrl.openConnection();

			String boundaryString = "----SomeRandomText";
			File fileToUpload = new File(filePath);

			// Indicate that we want to write to the HTTP request body
			urlConnection.setDoOutput(true);
			urlConnection.setRequestMethod("POST");
			urlConnection.addRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundaryString);
			urlConnection.addRequestProperty(AUTHENTICATION_PROPERTY_KEY, authorization);
			urlConnection.addRequestProperty(AUTHTENTICATION_TYPE_PROPERTY_KEY, authenticationType);
			if (authenticationType != null && KERBEROS.equals(authenticationType)){
				urlConnection.addRequestProperty(DOCBASE_PROPERTY_KEY, docbase);
			}

			// Indicate that we want to write some data as the HTTP request body
			urlConnection.setDoOutput(true);

			OutputStream outputStreamToRequestBody = urlConnection.getOutputStream();
			BufferedWriter httpRequestBodyWriter = new BufferedWriter(
					new OutputStreamWriter(outputStreamToRequestBody));
			
			httpRequestBodyWriter.write("\n--" + boundaryString + "\n");
			httpRequestBodyWriter.write("Content-Disposition: form-data; name=\"objectId\"\n\n" + rObjectId);
			httpRequestBodyWriter.write("\n--" + boundaryString + "\n");
			httpRequestBodyWriter.write("Content-Disposition: form-data; name=\"versionPolicy\"\n\n" + versionPolicy);
			// Include the section to describe the file
			httpRequestBodyWriter.write("\n--" + boundaryString + "\n");
			httpRequestBodyWriter.write("Content-Disposition: form-data;" + "name=\"file\";" + "filename=\""
					+ fileToUpload.getName() + "\"" + "\nContent-Type: text/plain\n\n");
			
			httpRequestBodyWriter.flush();

			// Write the actual file contents

			FileInputStream inputStreamToFile = new FileInputStream(fileToUpload);

			int bytesRead;
			byte[] dataBuffer = new byte[1024];
			while ((bytesRead = inputStreamToFile.read(dataBuffer)) != -1)
			{
				outputStreamToRequestBody.write(dataBuffer, 0, bytesRead);
			}

			outputStreamToRequestBody.flush();

			// Mark the end of the multipart http request
			httpRequestBodyWriter.write("\n--" + boundaryString + "--\n");
			httpRequestBodyWriter.flush();

			// Close the streams
			outputStreamToRequestBody.close();
			httpRequestBodyWriter.close();
			inputStreamToFile.close();

			// read response
			BufferedReader httpResponseReader = new BufferedReader(
					new InputStreamReader(urlConnection.getInputStream()));
			String lineRead;
			StringBuilder stringBuilder = new StringBuilder();
			while ((lineRead = httpResponseReader.readLine()) != null)
			{
				System.out.println(lineRead);
				stringBuilder.append(lineRead);
			}
			httpResponseReader.close();
			r_object_id = stringBuilder.toString();
			System.out.println("r_object_id=" + r_object_id);
			
			checkoutManager.removePropertyEntryAndFileOnCheckin(rObjectId);
		} catch (Exception e)
		{
			e.printStackTrace();
		}

		return r_object_id;
	}
}