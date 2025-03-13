package com.project.mysell.model.report.ranking;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("daily_product_rankings")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyProductRankingModel {
	@Id
	private Long dailyRankingProductsId;
}
