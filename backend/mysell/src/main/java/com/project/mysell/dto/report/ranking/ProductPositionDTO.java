package com.project.mysell.dto.report.ranking;

import com.project.mysell.dto.product.ProductResponseDTO;

public record ProductPositionDTO(
		Long position,
		ProductResponseDTO productResponseDTO
		
		) {

}
