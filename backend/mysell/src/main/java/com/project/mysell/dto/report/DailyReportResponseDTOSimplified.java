package com.project.mysell.dto.report;

import java.time.LocalDate;
public record DailyReportResponseDTOSimplified(
		LocalDate date,
		Double profit,
		Double grossRevenue,
		Long numberOfSales
		) {

}
