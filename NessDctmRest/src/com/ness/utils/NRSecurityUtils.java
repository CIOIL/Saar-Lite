package com.ness.utils;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPrivateKeySpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class NRSecurityUtils
{
	private static final String NR_PRIVATE_KEY_FILE = "nr-private.key";
	private static final String TRANSFORMATION = "RSA";
	private static final String UTF_8 = "UTF-8";
	
	private static PrivateKey readPrivateKey() throws IOException, ClassNotFoundException, NoSuchAlgorithmException, InvalidKeySpecException
	{
		InputStream privateKeyIn = NRSecurityUtils.class.getClassLoader().getResourceAsStream(NR_PRIVATE_KEY_FILE);

		if (privateKeyIn == null)
		{
			throw new RuntimeException("NRSecurityUtils.readPrivateKey exception, missing private key");
		}
		
		ObjectInputStream oin = new ObjectInputStream(new BufferedInputStream(privateKeyIn));
		
		try
		{
			BigInteger m = (BigInteger) oin.readObject();
			BigInteger e = (BigInteger) oin.readObject();

			RSAPrivateKeySpec keySpec = new RSAPrivateKeySpec(m, e);
			KeyFactory fact = KeyFactory.getInstance(TRANSFORMATION);
			PrivateKey privKey = fact.generatePrivate(keySpec);
			return privKey;
		}
		finally
		{
			if (oin != null) oin.close();
		}
	}
	
	public static String decrypt(String str) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException, IOException, ClassNotFoundException
	{
		BigInteger bi = new BigInteger(str, 16);
		PrivateKey privKey = readPrivateKey();
		Cipher cipher = Cipher.getInstance(TRANSFORMATION);
		cipher.init(Cipher.DECRYPT_MODE, privKey);
		byte[] cipherData = cipher.doFinal(bi.toByteArray());
		
		return new String(cipherData, UTF_8);
	}	
}
