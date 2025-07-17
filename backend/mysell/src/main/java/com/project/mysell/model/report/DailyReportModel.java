package com.project.mysell.model.report;

import java.time.LocalDate;
import java.util.UUID;

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
	private UUID userId;
	
	
	public DailyReportModel(UUID uuid, DailyReportResponseDTO dailyReport) {
		this.date = dailyReport.date();
		this.profit = dailyReport.profit();
		this.grossRevenue = dailyReport.grossRevenue();
		this.numberOfSales = dailyReport.numberOfSales();
		this.userId = uuid;
	}
	
}
