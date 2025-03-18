package com.project.mysell.service.product.barcode;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



public class APIProductBarCodeUtils {
	
	
	public static String[] parse(String productStr, List<String> UNITS) {
	    String unitRegex = String.join("|", UNITS);
	    
	    String regex = "^(.*?)\\s*(\\d+[\\.,]?\\d*)\\s*(" + unitRegex + ")(\\s+.*)?$";	    
	    Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
	    Matcher matcher = pattern.matcher(productStr);

	    if (matcher.matches()) {
	        String name = matcher.group(1).trim();
	        String quantity = matcher.group(2).replace(",", "."); 
	        String unit = matcher.group(3).toLowerCase();

	        return new String[] {name, quantity, unit};
	    } else {
	        return new String[] {productStr, null, null};
	    }
	}

}
