package com.project.mysell.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductDTO(
        		@NotNull(message = "Name must not be null")
        		@NotBlank(message = "Name must not be blank")
        		String name,
			    Long categoryId,
			    @NotNull(message = "Purchased price must not be null")
			    Double purchasedPrice,
			    @NotNull(message = "Price to sell Price must not be null")
			    Double priceToSell,
			    String brand,
			    ProductUnitOfMeasureDTO productUnitOfMeasureDTO
		){

}
