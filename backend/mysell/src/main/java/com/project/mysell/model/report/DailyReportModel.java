package com.project.mysell.model.report;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.report.DailyReportResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("daily_reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyReportModel {
	@Id
	private Long dailyReportsId;
	private LocalDate date;
	private Double profit;
	private Double grossRevenue;
	private Long numberOfSales;
	private Long dailyProductRankingId;
	
	
	public DailyReportModel(Long dailyRankingProductsId, DailyReportResponseDTO dailyReport) {
		this.date = dailyReport.date();
		this.profit = dailyReport.profit();
		this.grossRevenue = dailyReport.grossRevenue();
		this.numberOfSales = dailyReport.numberOfSales();
		this.dailyProductRankingId = dailyRankingProductsId;
		
	}
	
}
