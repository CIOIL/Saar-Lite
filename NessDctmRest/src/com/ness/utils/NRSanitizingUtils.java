package com.ness.utils;

import org.apache.commons.lang.StringEscapeUtils;

public class NRSanitizingUtils
{
	public static String sanitizeApache (String input){
		String result = StringEscapeUtils.escapeHtml(input);
		return result;
	}
	
	public static String desanitize (String data){
		String result = StringEscapeUtils.unescapeHtml(data);
		return result;
	}
	
	public static String sanitize (String data){
		return data != null ? data.replace("<", "&lt;").replace(">", "&gt;") : null;
	}
	
	public static String removeHtml (String input){
		String result = input.replaceAll("<.*?>", "");
		return result;
	}
	
	
	public static void main (String ...strings ){
		//System.out.println(removeHtml("<script>alert('dfgdfgdfg')</script>"));
		System.out.println(sanitize("<script>alert('dfgdfgdfg')</script>"));
	}

}
