package com.project.mysell.service.product.barcode;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class APIProductBarCodeUtils {
	public static String[] extractComponents(String description) {
		if(description == null || description.isEmpty()) {
			return new String[] {description,"",""};
		}
		Pattern pattern = Pattern.compile("^(.*?)\\s+(\\d+)\\s*([A-Za-z]+)$", Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(description);
		
		if(matcher.matches()) {
			String name  = matcher.group(1).trim();
			String quantity = matcher.group(2).trim();
			String unit = matcher.group(3).trim();
			
			return new String[] {name, quantity, unit};
		}
		return new String[] {description, "", ""};
	}
}
