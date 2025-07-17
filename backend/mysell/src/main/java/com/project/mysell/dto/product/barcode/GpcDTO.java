package com.project.mysell.dto.product.barcode;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
 public record GpcDTO(
    String code,
    String description
) {}