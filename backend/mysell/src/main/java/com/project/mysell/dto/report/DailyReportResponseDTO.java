package com.project.mysell.dto.report;

public record DailyReportResponseDTO(
		LocalDate date,
		Double profit,
		Double grossRevenue,
		Long numberOfSales,
		DailyProductRankingDTO dailyProductRankingDTO
		
		) {

}
