package com.project.mysell.service.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
@Component
public class DailyReportScheduler {
	@Autowired
	private ReportService reportService;
	
	@Scheduled(cron = "0 0 0 * * ?")
	private void saveDailyReport() {
	    reportService.saveDailyReport().subscribe();
	}
	@Scheduled(cron = "0 0 0 ? * SUN")
	private void saveWeeklyReport() {
	    reportService.saveWeeklyReport().subscribe();
	}



}
