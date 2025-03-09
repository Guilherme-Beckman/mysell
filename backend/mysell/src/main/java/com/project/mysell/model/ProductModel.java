package com.project.mysell.model;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.ProductDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductModel {
	@Id
    private Long productsId;
    private String name;
    private Long categoryId;
    private Double purchasedPrice;
    private Double priceToSell;
    private String brand;
    private UUID userId;
    private Long productUnitOfMeasureId;
	public ProductModel(ProductDTO productDTO) {
		this.name = productDTO.name();
		this.purchasedPrice = productDTO.purchasedPrice();
		this.categoryId = productDTO.categoryId();
		this.priceToSell = productDTO.priceToSell();
		this.brand = productDTO.brand();
	}
    
    
}
