package com.project.mysell.dto.report;

import java.time.LocalDate;
import java.util.List;

import com.project.mysell.dto.report.ranking.SellsByProductDTO;

public record DailyReportResponseDTO(
		LocalDate date,
		Double profit,
		Double grossRevenue,
		Long numberOfSales,
		List<SellsByProductDTO> sellsByProduct
		) {

}
