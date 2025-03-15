package com.project.mysell.dto.report;

import java.sql.Date;
import java.util.List;

public record WeeklyReportResponseDTO(
		Date firstDay,
		Date lastDay,
		Double profit,
		Double grossRevenue,
		Long numberOfSales,
		List<DailyReportResponseDTO> dailyReports
		) {

}