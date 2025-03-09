package com.project.mysell.dto;

public record ProductUpdateDTO(
        		String name,
			    Long categoryId,
			    Double purchasedPrice,
			    Double priceToSell,
			    String brand,
			    ProductUnitOfMeasureDTO productUnitOfMeasureDTO
		){

}
