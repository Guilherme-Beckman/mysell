package com.project.mysell.model.report;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.report.SellsByProductDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("sells_by_products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellsByProductsModel{
	@Id
	private Long sellsByProductsId;
	private Long saleCount;
	private Double profit;
	private Double grossRevenue;
	private Long productId;
	private Long dailyReportId;
	
	public SellsByProductsModel(Long dailyReportId, SellsByProductDTO productPosition) {
		this.saleCount = productPosition.saleCount();
		this.profit = productPosition.profit();
		this.grossRevenue = productPosition.grossRevenue();
		this.productId = productPosition.productResponseDTO().productsId();
		this.dailyReportId = dailyReportId;
		
	}
}
