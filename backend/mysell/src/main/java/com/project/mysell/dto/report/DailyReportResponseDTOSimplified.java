package com.project.mysell.dto.report;

import java.time.LocalDate;
import java.util.List;

public record DailyReportResponseDTOSimplified(
		LocalDate date,
		Double profit,
		Double grossRevenue,
		Long numberOfSales
		) {

}
