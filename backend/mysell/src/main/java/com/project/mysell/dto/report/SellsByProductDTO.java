package com.project.mysell.dto.report;

import com.project.mysell.dto.product.ProductResponseDTO;

public record SellsByProductDTO(
	    Long saleCount,
	    Double profit,
	    Double grossRevenue,
		ProductResponseDTO productResponseDTO
		
		) {

}
