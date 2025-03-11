package com.project.mysell.dto.product;

import com.project.mysell.dto.product.unit.ProductUnitOfMeasureDTO;

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
