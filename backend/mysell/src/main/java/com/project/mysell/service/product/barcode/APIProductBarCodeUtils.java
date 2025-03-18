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

    private static final double SIMILARITY_THRESHOLD = 0.85;

    public static String containsCategory(String categoryStr, List<String> categories) {
    	System.out.println(categoryStr);
        for (String category : categories) {
            double similarity = JaroWinklerDistance.computeJaroWinklerDistance(
                    categoryStr.toLowerCase(), category.toLowerCase());

            if (similarity >= SIMILARITY_THRESHOLD) {
                return category;
            }
        }
        return "OTHERS";
    }

    public static class JaroWinklerDistance {
        private static final double PREFIX_SCALE = 0.1;

        public static double computeJaroWinklerDistance(String s1, String s2) {
            int s1Length = s1.length();
            int s2Length = s2.length();
            if (s1Length == 0) {
                double result = s2Length == 0 ? 1.0 : 0.0;
                return result;
            }
            if (s2Length == 0) {
                return 0.0;
            }

            int matchDistance = Math.max(s1Length, s2Length) / 2 - 1;
            boolean[] s1Matches = new boolean[s1Length];
            boolean[] s2Matches = new boolean[s2Length];

            int matches = 0;
            for (int i = 0; i < s1Length; i++) {
                int start = Math.max(0, i - matchDistance);
                int end = Math.min(i + matchDistance + 1, s2Length);
                for (int j = start; j < end; j++) {
                    if (s2Matches[j]) {
                        continue;
                    }
                    if (s1.charAt(i) != s2.charAt(j)) {
                        continue;
                    }
                    s1Matches[i] = true;
                    s2Matches[j] = true;
                    matches++;
                    break;
                }
            }

            if (matches == 0) {
                return 0.0;
            }

            double transpositions = 0;
            int k = 0;
            for (int i = 0; i < s1Length; i++) {
                if (!s1Matches[i])
                    continue;
                while (!s2Matches[k])
                    k++;
                if (s1.charAt(i) != s2.charAt(k)) {
                    transpositions++;
                }
                k++;
            }
            transpositions /= 2.0;
            double jaro = ((matches / (double) s1Length) +
                           (matches / (double) s2Length) +
                           ((matches - transpositions) / matches)) / 3.0;
            int prefix = 0;
            for (int i = 0; i < Math.min(4, Math.min(s1Length, s2Length)); i++) {
                if (s1.charAt(i) == s2.charAt(i)) {
                    prefix++;
                } else {
                    break;
                }
            }
            double finalResult = jaro + prefix * PREFIX_SCALE * (1 - jaro);
            return finalResult;
        }
    }

}
