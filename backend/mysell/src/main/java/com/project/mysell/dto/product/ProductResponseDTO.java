package com.project.mysell.dto.product;

import com.project.mysell.dto.category.CategoryDTO;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureResponseDTO;

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
