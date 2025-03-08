package com.project.mysell.dto;
import java.util.UUID;

public record ProductResponseDTO (
     Long productsId,
     String name,
     CategoryDTO category,
     Double purchasedPrice,
     Double priceToSell,
     String brand,
     UUID userId,
     ProductUnitOfMeasureResponseDTO  productUnitOfMeasureDTO
)
{}
