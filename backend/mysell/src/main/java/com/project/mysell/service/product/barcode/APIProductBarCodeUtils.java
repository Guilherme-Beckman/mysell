package com.project.mysell.service.product.barcode;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class APIProductBarCodeUtils {
    private static final String QUANTITY_REGEX = "\\d+[\\.,]?\\d*";
    private static final int CODE_PREFIX_LENGTH = 2;
    private static final String SPECIAL_CODE_PREFIX = "10";
    
    public static String[] parseProductDescription(String productDescription, List<String> validUnits) {
        String unitRegex = String.join("|", validUnits);
        String fullRegex = String.format("^(.*?)\\s*(%s)\\s*(%s)(\\s+.*)?$", QUANTITY_REGEX, unitRegex);
        
        Matcher matcher = Pattern.compile(fullRegex, Pattern.CASE_INSENSITIVE)
            .matcher(productDescription);
        
        if (!matcher.matches()) {
            return new String[]{productDescription, null, null};
        }
        
        String name = matcher.group(1).trim();
        String quantity = matcher.group(2).replace(",", ".");
        String unit = matcher.group(3).toLowerCase();
        return new String[]{name, quantity, unit};
    }

    public static Long findMatchingCategoryCode(String codeString, List<Long> existingCategoryCodes) {
        Long codeValue = Long.parseLong(codeString);
        String codePrefix = codeString.substring(0, CODE_PREFIX_LENGTH);
        
        if (codeString.startsWith(SPECIAL_CODE_PREFIX)) {
            return handleSpecialCodePrefix(codeString, codeValue);
        }
        
        return existingCategoryCodes.stream()
            .filter(code -> code.equals(Long.parseLong(codePrefix)))
            .findFirst()
            .orElse(null);
    }

    private static Long handleSpecialCodePrefix(String codeString, Long fullCodeValue) {
        if (codeString.length() > CODE_PREFIX_LENGTH && codeString.charAt(CODE_PREFIX_LENGTH) == '1') {
            return 10L;
        }
        return fullCodeValue;
    }
}