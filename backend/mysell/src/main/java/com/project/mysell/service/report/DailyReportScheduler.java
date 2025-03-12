package com.project.mysell.service.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

public class DailyReportScheduler {
	@Autowired
	private ReportService reportService;
	
	@Scheduled(cron = "0 0 0 * * ?")
	private void saveDailyReport() {
		reportService.saveDailyReport();
	}
}
