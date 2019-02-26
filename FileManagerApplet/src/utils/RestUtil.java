package utils;

import static constants.FileManagerConstants.*;

import java.awt.Desktop;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.nio.channels.OverlappingFileLockException;

import checkout.SaarCheckoutManager;

public class RestUtil
{

	public static String print(String restUrl, String authorization, String json, String path, String fileName, String authenticationType, String docbase)
	{
		String fullPath = null;
		try
		{
			URL url = new URL(restUrl);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();

			con.setDoOutput(true);
			con.setDoInput(true);

			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestMethod(POST);
			con.setRequestProperty(AUTHENTICATION_PROPERTY_KEY, authorization);
			con.setRequestProperty(AUTHTENTICATION_TYPE_PROPERTY_KEY, authenticationType);
			if (authenticationType != null && KERBEROS.equals(authenticationType)){
				con.setRequestProperty(DOCBASE_PROPERTY_KEY, docbase);
			}

			OutputStreamWriter wr = new OutputStreamWriter(con.getOutputStream());
			wr.write(json);
			wr.flush();

			if (fileName == null)
			{
				fileName = getDecodedFileName(con);
				fileName = fileName.replace("\"", "");
				SaarCheckoutManager.setFilename(fileName);
				//check file exists and opened by another process
				//in this case change filename to filename_1
				path = path + "\\" + fileName;
				boolean opened = isOpened(path);
				while (opened){
					fileName = changeFilename (fileName);
					path = path.substring(0, path.lastIndexOf("\\") + 1)+ fileName;
					opened = isOpened(path);
				}
				fullPath = path;
			} else {
				fullPath = path + fileName;
			}
			
			//String fileROjectId = getObjectIdFromJson(json);
			System.out.println("fullPath=" + fullPath);

			InputStream in = con.getInputStream();
			File file = new File(fullPath);
			file.getParentFile().mkdirs();
			if (!file.exists())
			{
				file.createNewFile();
			}

			OutputStream out = new FileOutputStream(file);
			int read = 0;
			byte[] bytes = new byte[1024];
			while ((read = in.read(bytes)) != -1)
			{
				out.write(bytes, 0, read);
			}

			in.close();
			out.close();

			if (Desktop.isDesktopSupported())
			{
				Desktop.getDesktop().print(new File(fullPath));
			}
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		return fullPath;
	}

	public static String download(String restUrl, String authorization, String json, String path, 
			                               String fileName, String authenticationType, String docbase)
	{
		String fullPath = null;
		try
		{
			URL url = new URL(restUrl);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();

			con.setDoOutput(true);
			con.setDoInput(true);

			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestMethod(POST);
			con.setRequestProperty(AUTHENTICATION_PROPERTY_KEY, authorization);
			con.setRequestProperty(AUTHTENTICATION_TYPE_PROPERTY_KEY, authenticationType);
			if (authenticationType != null && KERBEROS.equals(authenticationType)){
				con.setRequestProperty(DOCBASE_PROPERTY_KEY, docbase);
			}

			OutputStreamWriter wr = new OutputStreamWriter(con.getOutputStream());
			wr.write(json);
			wr.flush();

			if (fileName == null)
			{
				fileName = getDecodedFileName(con);
				fileName = fileName.replace("\"", "");
				SaarCheckoutManager.setFilename(fileName);
				//check file exists and opened by another process
				//in this case change filename to filename_1
				path = path + "\\" + fileName;
				boolean opened = isOpened(path);
				while (opened){
					fileName = changeFilename (fileName);
					path = path.substring(0, path.lastIndexOf("\\") + 1)+ fileName;
					opened = isOpened(path);
				}
				fullPath = path;
			} else {
				fullPath = path + fileName;
			}
			
			//String fileROjectId = getObjectIdFromJson(json);
			System.out.println("fullPath=" + fullPath);

			InputStream in = con.getInputStream();
			File file = new File(fullPath);
			file.getParentFile().mkdirs();
			if (!file.exists())
			{
				file.createNewFile();
			}

			OutputStream out = new FileOutputStream(file);
			int read = 0;
			byte[] bytes = new byte[1024];
			while ((read = in.read(bytes)) != -1)
			{
				out.write(bytes, 0, read);
			}

			in.close();
			out.close();

			if (Desktop.isDesktopSupported())
			{
				Desktop.getDesktop().open(new File(fullPath));
			}

		} catch (IOException e)
		{
			e.printStackTrace();
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		return fullPath;
	}
	
	private static String changeFilename(String newFilename) {
		int lastIndexOfUnderscore = newFilename.lastIndexOf("_");
		int lastIndexOfDot = newFilename.lastIndexOf(".");
		if (lastIndexOfUnderscore == - 1){
			if (lastIndexOfDot == -1){
				return newFilename + "_1";
			} else {
				return newFilename.substring(0, lastIndexOfDot)+ "_1" + newFilename.substring(lastIndexOfDot);
			}
		} else {
			String allegedNumber = newFilename.substring(lastIndexOfUnderscore + 1, lastIndexOfDot);
			int number = -1;
			try {
				number = Integer.parseInt(allegedNumber);
			} catch (Exception e){
				
			}
			if (number == - 1){
				if (lastIndexOfDot == -1){
					return newFilename + "_1";
				} else {
					return newFilename.substring(0, lastIndexOfDot)+ "_1" + newFilename.substring(lastIndexOfDot);
				}
			} else {
				number = number + 1;
				if (lastIndexOfDot == -1){
					return newFilename + "_" + number;
				} else {
					return newFilename.substring(0, lastIndexOfUnderscore)+ "_" + number  + newFilename.substring(lastIndexOfDot);
				}
			}
		}
	}

	static boolean isOpened(String path) throws Exception {
		File file = new File(path);
		System.out.println(file.exists());
		if (!file.exists()){
			return false;
		}
		System.out.println(file.canRead());
		System.out.println(file.canWrite());
		FileChannel channel = null;
		FileLock lock = null;
		try {
			channel = new RandomAccessFile(file, "rw").getChannel();
			lock = channel.lock();

			lock = channel.tryLock();
			System.out.print("file is not locked");
		} catch (OverlappingFileLockException e) {
			System.out.println("file is locked");
			return true;
		} catch (FileNotFoundException e) {
			System.out.println("file is locked");
			return true;
		} finally {
			if (lock != null) {
				lock.release();
			}
			if (channel != null) {
				channel.close();
			}

		}
		return false;
	}

	/**
	 * Retrieves objectId from json. For Edit operation there is only one
	 * objectId always.
	 * 
	 * @param json
	 * @return
	 */
	public static String getObjectIdFromJson(String json)
	{
		String rObjectId = json.substring(json.indexOf("[") + 2, json.indexOf("]") - 1).trim();
		return rObjectId;
	}

	private static String getDecodedFileName(HttpURLConnection connection)
	{

		String fileNameUnicode16 = connection.getHeaderField(RESPONSE_PROPERTY_CONTENT_DISPOSITION);
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < fileNameUnicode16.length(); i += 4)
		{
			String str = fileNameUnicode16.substring(i, i + 4);
			char a = (char) (Integer.parseInt(str, 16));
			buffer.append(a);
		}
		return new String(buffer);
	}
	
	public static String getObjectJson (String restUrl, String authorization, String objectType,  String rObjectId, String authenticationType, String docbase){
		try
		{
			restUrl = restUrl.replace("content/edit/", "os/get/") + objectType + "/" + rObjectId;
			URL url = new URL(restUrl);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestProperty(AUTHENTICATION_PROPERTY_KEY, authorization);
			connection.setRequestProperty(AUTHTENTICATION_TYPE_PROPERTY_KEY, authenticationType);
			if (authenticationType != null && KERBEROS.equals(authenticationType)){
				connection.setRequestProperty(DOCBASE_PROPERTY_KEY, docbase);
			}
			int responseCode = connection.getResponseCode();
			System.out.println(responseCode);
			BufferedReader in = new BufferedReader(
			        new InputStreamReader(connection.getInputStream()));
			String inputLine;
			StringBuilder jsonBuilder = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonBuilder.append(inputLine);
			    System.out.println(inputLine);
			}
			in.close();
			
			return jsonBuilder.toString();
			

		} catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}
	
	public static String getConfigJson(String restUrl, String authorization, String repositoryId, String authenticationType, String docbase){
		try
		{
			restUrl = restUrl.replace("content/edit/", "cs/config/") + repositoryId;
			URL url = new URL(restUrl);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestProperty(AUTHENTICATION_PROPERTY_KEY, authorization);
			connection.setRequestProperty(AUTHTENTICATION_TYPE_PROPERTY_KEY, authenticationType);
			if (authenticationType != null && KERBEROS.equals(authenticationType)){
				connection.setRequestProperty(DOCBASE_PROPERTY_KEY, docbase);
			}
			int responseCode = connection.getResponseCode();
			System.out.println(responseCode);
			BufferedReader in = new BufferedReader(
			        new InputStreamReader(connection.getInputStream()));
			String inputLine;
			StringBuilder jsonBuilder = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				jsonBuilder.append(inputLine);
			    System.out.println(inputLine);
			}
			in.close();
			
			return jsonBuilder.toString();
			

		} catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}
}
