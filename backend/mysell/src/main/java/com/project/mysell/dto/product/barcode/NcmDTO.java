package com.project.mysell.dto.product.barcode;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
@JsonIgnoreProperties(ignoreUnknown = true)
public record NcmDTO(
    String code,
    String description,
    @JsonProperty("full_description") String fullDescription
) {}
