package com.project.mysell.dto.report;

import java.time.LocalDate;

import com.project.mysell.dto.report.ranking.DailyProductRankingDTO;

public record DailyReportResponseDTO(
		LocalDate date,
		Double profit,
		Double grossRevenue,
		Long numberOfSales,
		DailyProductRankingDTO dailyProductRankingDTO
		
		) {

}
