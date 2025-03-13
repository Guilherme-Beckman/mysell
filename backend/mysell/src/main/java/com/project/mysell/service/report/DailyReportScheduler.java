package com.project.mysell.service.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
@Component
public class DailyReportScheduler {
	@Autowired
	private ReportService reportService;
	/*
	@Scheduled(initialDelay = 5000)
	private void saveDailyReport() {
	    reportService.saveDailyReport().subscribe();
	}*/


}
