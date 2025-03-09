package com.project.mysell.dto;

public record ProductResponseDTO (
     Long productsId,
     String name,
     CategoryDTO category,
     Double purchasedPrice,
     Double priceToSell,
     String brand,
     ProductUnitOfMeasureResponseDTO  productUnitOfMeasureDTO
)
{}
