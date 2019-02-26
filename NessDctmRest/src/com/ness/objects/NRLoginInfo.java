package com.ness.objects;

public class NRLoginInfo
{
	private char [] username = null;
	private char [] password = null;
	private char [] domain = null;
	private char [] docbase = null;
	private boolean canUseSuperUser;
	
	
	public String getUsername()
	{
		return username == null ? null : String.valueOf(username);
	}
	
	public void setUsername(String username)
	{
		this.username = username != null && username.length() > 0 ? username.toCharArray() : null;
	}
	
	public String getPassword()
	{
		return password == null ? null : String.valueOf(password);
	}
	
	public void setPassword(String password)
	{
		this.password = password != null && password.length() > 0 ? password.toCharArray() : null;
	}
	
	public String getDomain()
	{
		return domain == null ? null : String.valueOf(domain);
	}
	
	public void setDomain(String domain)
	{
		this.domain = domain != null && domain.length() > 0 ? domain.toCharArray() : null;
	}
	
	public String getDocbase()
	{
		return docbase == null ? null : String.valueOf(docbase);
	}
	
	public void setDocbase(String docbase)
	{
		this.docbase = docbase != null && docbase.length() > 0 ? docbase.toCharArray(): null;
	}

	public boolean isCanUseSuperUser()
	{
		return canUseSuperUser;
	}

	public void setCanUseSuperUser(boolean canUseSuperUser)
	{
		this.canUseSuperUser = canUseSuperUser;
	}
}