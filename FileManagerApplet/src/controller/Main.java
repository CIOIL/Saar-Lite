package controller;

import interfaces.FileOperation;

/**
 * @author YURIN Used only for testing.
 *
 */
public class Main
{
	private static final String PACKAGE = "operations.";

	public static void main(String[] args)
	{
		String [] ar = new String [];
		
		try
		{
			FileOperation operation = (FileOperation) Class.forName(PACKAGE + ar[0]).newInstance();
			operation.execute(ar);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}