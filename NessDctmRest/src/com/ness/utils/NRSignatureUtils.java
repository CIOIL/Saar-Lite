package com.ness.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Transparency;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.imageio.ImageIO;
import javax.xml.bind.JAXBElement;

import org.docx4j.wml.*;
import org.apache.commons.io.IOUtils;
import org.docx4j.dml.wordprocessingDrawing.Inline;
import org.docx4j.openpackaging.io.SaveToZipFile;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.BinaryPartAbstractImage;
import org.docx4j.wml.P;

public class NRSignatureUtils
{
	public static final String SIGNATURE_IMAGE_FILE_PATH = "E:\\Signature.jpg";
	public static final String SIGNED_IMAGE_FILE_PATH = "E:\\Signed.jpg";
	public static final String DOT = ".";
	public static final String JPG = "jpg";
	public static final String DATE_FORMAT = "dd.MM.yyyy";
	public static final String FONT = "Courier New";
	public static final int MAX_ANGLE = 360;
	public static final int MIN_ANGLE = 0;

	private static InputStream combineWithDate(InputStream signatureIS)
	{
		PipedInputStream signatureWithDateIS = new PipedInputStream();
		try
		{
			//Get Date String
			Date date = new Date(System.currentTimeMillis());
			SimpleDateFormat df = new SimpleDateFormat(DATE_FORMAT);
			String today = df.format(date);

			//Get Signature
			final BufferedImage signatureImage = ImageIO.read(signatureIS);
			int width = signatureImage.getWidth();
			int height = signatureImage.getHeight();

			//Create Transparent images
			BufferedImage dateImage = new BufferedImage(width, height, Transparency.BITMASK);
			BufferedImage rotatedDateImage = new BufferedImage(width, height, Transparency.BITMASK);

			//Draw date String
			Graphics2D dateImageGraphics = dateImage.createGraphics();
			dateImageGraphics.setPaint(Color.black);
			Font font = new Font(FONT, Font.BOLD, height / 9);
			dateImageGraphics.setFont(font);

			//Center the date string
			FontMetrics metrics = dateImageGraphics.getFontMetrics(font);
			dateImageGraphics.drawString(today, (width - metrics.stringWidth(today)) / 2,
					((height - metrics.getHeight()) / 2) + metrics.getAscent());
			dateImageGraphics.drawImage(dateImage, 0, 0, null);

			//Rotate image around the center
			AffineTransform at = new AffineTransform();
			at.rotate(Math.toRadians(Math.random() * ((MAX_ANGLE - MIN_ANGLE) + 1) + MIN_ANGLE), width / 2, height / 2);

			//Draw rotated image
			Graphics2D rotatedImageGraphics = rotatedDateImage.createGraphics();
			rotatedImageGraphics.drawImage(dateImage, at, null);

			//Overlay rotated image over Signature
			Graphics2D signatureImageGraphics = signatureImage.createGraphics();
			signatureImageGraphics.drawImage(signatureImage, 0, 0, null);
			signatureImageGraphics.drawImage(rotatedDateImage, 0, 0, null);

			//Save signed image
			//			File signedImage = new File(SIGNED_IMAGE_FILE_PATH);
			//			ImageIO.write(signatureImage, JPG, signedImage);

			final PipedOutputStream out = new PipedOutputStream(signatureWithDateIS);

			new Thread(new Runnable()
			{
				@Override
				public void run()
				{
					try
					{
						ImageIO.write(signatureImage, JPG, out);
					} catch (IOException e)
					{
						e.printStackTrace();
					} finally 
					{
						IOUtils.closeQuietly(out);
					}
				}

			}).start();
			
			

			//Dispose of graphic objects
			dateImageGraphics.dispose();
			signatureImageGraphics.dispose();
			rotatedImageGraphics.dispose();

			//Report success
			System.out.println("Signed!");
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		return signatureWithDateIS;
	}

	public static InputStream sign(InputStream documentIS, InputStream signatureImageIS)
	{
		signatureImageIS = combineWithDate(signatureImageIS);

		try
		{
			documentIS = insertSignature(documentIS, signatureImageIS);
		} catch (Exception e)
		{
			e.printStackTrace();
		}

		return documentIS;
	}

	public static InputStream insertSignature(InputStream documentIS, InputStream signatureImageIS) throws Exception
	{
		//WordprocessingMLPackage wordprocessingMLPackage = WordprocessingMLPackage.createPackage();
		WordprocessingMLPackage wordprocessingMLPackage = WordprocessingMLPackage.load(documentIS);
		
		
		byte[] signatureImageBytes = IOUtils.toByteArray(signatureImageIS);

		String filenameHint = null;
		String altText = null;

		int id1 = 0;
		int id2 = 1;

		P p = newImage(wordprocessingMLPackage, signatureImageBytes, filenameHint, altText, id1, id2);

		//wordprocessingMLPackage.getMainDocumentPart().addObject(p);
		PipedInputStream documentWithSignatureIS = new PipedInputStream();
		final PipedOutputStream out = new PipedOutputStream(documentWithSignatureIS);
		final SaveToZipFile saver = new SaveToZipFile(wordprocessingMLPackage);
//        saver.save(out);
		new Thread(new Runnable()
		{
			@Override
			public void run()
			{
				try
				{
					saver.save(out);
				} catch (Exception e)
				{
					e.printStackTrace();
				} finally 
				{
					IOUtils.closeQuietly(out);
				}
			}

		}).start();
		//wordprocessingMLPackage.save(new File("E://signedDoc.docx"));
        return documentWithSignatureIS;
	}

	public static P newImage(WordprocessingMLPackage wordMLPackage, byte[] bytes, String filenameHint, String altText,
			int id1, int id2) throws Exception
	{
		BinaryPartAbstractImage imagePart = BinaryPartAbstractImage.createImagePart(wordMLPackage, bytes);
		Inline inline = imagePart.createImageInline(filenameHint, altText, id1, id2);

		ObjectFactory factory = new ObjectFactory();

		//P p = factory.createP();
		P p = findParagraf(wordMLPackage);
		R run = factory.createR();

		p.getParagraphContent().add(run);
		Drawing drawing = factory.createDrawing();
		run.getRunContent().add(drawing);
		drawing.getAnchorOrInline().add(inline);

		return p;
	}
	
	public static P findParagraf(WordprocessingMLPackage doc){
	    List<Object> paragraphs = getAllElementFromObject(doc.getMainDocumentPart(), P.class);
	    P lastP = null;
	    for(Object par : paragraphs){
	        P p = (P) par;
	        lastP = (P) par;
	        List<Object> texts = getAllElementFromObject(p, Text.class);
	        for(Object text : texts){
	            Text t = (Text)text;
	            if(t.getValue().contains("signature")){
	               return p;
	            }
	        }
	    }
	    return lastP;
	}
	
	public static List<Object> getAllElementFromObject(Object obj, Class<?> toSearch) {
	    List<Object> result = new ArrayList<Object>();
	    if (obj instanceof JAXBElement) obj = ((JAXBElement<?>) obj).getValue();

	    if (obj.getClass().equals(toSearch))
	        result.add(obj);
	    else if (obj instanceof ContentAccessor) {
	        List<?> children = ((ContentAccessor) obj).getContent();
	        for (Object child : children) {
	            result.addAll(getAllElementFromObject(child, toSearch));
	        }
	    }
	    return result;
	}
	
	public static void main (String[] args) throws Exception{
		sign(new FileInputStream("E:\\docToSign.docx"), new FileInputStream("E:\\signature.jpg"));
	}
}
