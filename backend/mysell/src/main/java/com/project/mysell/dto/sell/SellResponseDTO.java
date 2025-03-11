package com.project.mysell.dto.sell;

import java.time.LocalDateTime;

import com.project.mysell.dto.product.ProductResponseDTO;

public record SellResponseDTO (
		Long quantity,
		LocalDateTime createdAt,
		ProductResponseDTO productResponseDTO
		){

}
