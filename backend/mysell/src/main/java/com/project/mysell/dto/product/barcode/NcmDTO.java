package com.project.mysell.dto.product.barcode;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NcmDTO(
    String code,
    String description,
    @JsonProperty("full_description") String fullDescription
) {}
