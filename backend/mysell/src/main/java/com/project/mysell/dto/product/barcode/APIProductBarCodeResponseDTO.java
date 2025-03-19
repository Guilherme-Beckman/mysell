package com.project.mysell.dto.product.barcode;

import com.fasterxml.jackson.annotation.JsonProperty;

public record APIProductBarCodeResponseDTO(
    @JsonProperty("avg_price") Double avgPrice,
    BrandDTO brand,
    String description,
    GpcDTO gpc,
    @JsonProperty("gross_weight") Double grossWeight,
    Long gtin,
    Double height,
    Double length,
    @JsonProperty("max_price") Double maxPrice,
    NcmDTO ncm,
    @JsonProperty("net_weight") Double netWeight,
    String price,
    String thumbnail,
    Double width
) {}




