package com.project.mysell.model.report.ranking;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.report.ranking.ProductPositionDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("product_positions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPositionModel {
	@Id
	private Long productPositionsId;
	private Long position;
	private Long saleCount;
	private Long productId;
	private Long dailyProductRankingId;
	
	public ProductPositionModel(Long dailyRankingId, ProductPositionDTO productPosition) {
		this.position = productPosition.position();
		this.saleCount = productPosition.saleCount();
		this.productId = productPosition.productResponseDTO().productsId();
		this.dailyProductRankingId = dailyRankingId;
		
	}
}
