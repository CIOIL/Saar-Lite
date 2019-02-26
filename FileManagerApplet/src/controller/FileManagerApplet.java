package controller;

import interfaces.FileOperation;

import java.applet.*;
import java.security.AccessController;
import java.security.PrivilegedAction;

public class FileManagerApplet extends Applet
{
	private static final long serialVersionUID = 8861703131581179340L;
	private static final String PACKAGE = "operations.";

	public String executeOperation(final String[] args)
	{
		 
		String rObjectId = AccessController.doPrivileged(new PrivilegedAction()
		{
			public Object run()
			{
				try
				{
					FileOperation operation = (FileOperation) Class.forName(PACKAGE + args[0]).newInstance();
					return operation.execute(args);
				} catch (Exception e)
				{
					e.printStackTrace();
				}
				return null;
			}
		});
		
		return rObjectId;

	}

}
