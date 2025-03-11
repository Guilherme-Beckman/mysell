package com.project.mysell.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.product.unit.ProductUnitOfMeasureDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Table("products_units_of_measure")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductUnitOfMeasureModel {
	@Id
	private Long productsUnitsOfMeasureId;
    private Long quantity;
    private Long unitOfMeasureId;
	public ProductUnitOfMeasureModel(ProductUnitOfMeasureDTO productUnitOfMeasureDTO) {
		this.quantity = productUnitOfMeasureDTO.quantity();
		this.unitOfMeasureId = productUnitOfMeasureDTO.unitOfMeasureId();
	}
    
    
}
