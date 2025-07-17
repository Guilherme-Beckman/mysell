package com.project.mysell.dto.product.barcode;

import com.project.mysell.dto.category.CategoryDTO;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductStructure {
    private String name;
    private CategoryDTO category;
    private Double purchasedPrice;
    private Double priceToSell;
    private String brand;
    private ProductUnitOfMeasureResponseDTO  productUnitOfMeasureDTO;

}
