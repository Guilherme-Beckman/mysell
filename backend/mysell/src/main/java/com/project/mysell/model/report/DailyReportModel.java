package com.project.mysell.model.report;

import java.time.LocalDate;

import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.dto.report.ranking.DailyProductRankingDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("daily_reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyReportModel {

	private LocalDate date;
	private Double profit;
	private Double grossRevenue;
	private Long numberOfSales;
	private Long dailyProductRankingDTId;
	
	
	public DailyReportModel(Long dailyRankingProductsId, DailyReportResponseDTO dailyReport) {
		this.date = dailyReport.date();
		this.profit = dailyReport.profit();
		this.grossRevenue = dailyReport.grossRevenue();
		this.numberOfSales = dailyReport.numberOfSales();
		this.dailyProductRankingDTId = dailyRankingProductsId;
		
	}
	
}
