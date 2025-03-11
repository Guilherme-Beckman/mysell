package com.project.mysell.dto.product;

import com.project.mysell.dto.product.unit.ProductUnitOfMeasureDTO;

public record ProductUpdateDTO(
        		String name,
			    Long categoryId,
			    Double purchasedPrice,
			    Double priceToSell,
			    String brand,
			    ProductUnitOfMeasureDTO productUnitOfMeasureDTO
		){

}
