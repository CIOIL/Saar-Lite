package utils;

import java.io.File;
import java.util.Date;

import checkout.SaarCheckoutManager;

public class CleanUtil
{
	private static long NUMBER_OF_MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
	
	public static void cleanViewFiles(){
		File dir = new File (SaarCheckoutManager.VIEW_PATH);
		for(File file: dir.listFiles()) {
			boolean isOld = new Date().getTime() - file.lastModified() > NUMBER_OF_MILLISECONDS_IN_ONE_DAY;
			if (!file.isDirectory() && isOld) {
				file.delete();
			}		        
		}
		    
	}

	public static void main(String[] args)
	{
		cleanViewFiles();

	}

}
