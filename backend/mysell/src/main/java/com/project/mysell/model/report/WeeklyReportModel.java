package com.project.mysell.model.report;

import java.sql.Date;
import java.util.UUID;

import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.report.WeeklyReportResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("weekly_reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyReportModel {

	private Long weeklyReportsId;
	private Date firstDay;
	private Date lastDay;
	private Double profit;
	private Double grossRevenue;
	private Long numberOfSales;
	private UUID userId;
	public WeeklyReportModel(UUID usersId, WeeklyReportResponseDTO weeklyReport) {
	    this.userId = usersId;
	    this.firstDay = weeklyReport.firstDay();
	    this.lastDay = weeklyReport.lastDay();
	    this.profit = weeklyReport.profit();
	    this.grossRevenue = weeklyReport.grossRevenue();
	    this.numberOfSales = weeklyReport.numberOfSales();
	}

}