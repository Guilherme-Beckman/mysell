package com.project.mysell.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.dto.report.WeeklyReportResponseDTO;
import com.project.mysell.service.report.ReportService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/report")
public class ReportController {
	@Autowired
	private ReportService reportService;

	@GetMapping("/daily")
	private ResponseEntity<Mono<DailyReportResponseDTO>> getDailyReport(@RequestHeader("Authorization") String token) {
		Mono<DailyReportResponseDTO> dailyReport = this.reportService.getDailyReport(token);
		return ResponseEntity.ok().body(dailyReport);
	}

	@GetMapping("/daily/{date}")
	private ResponseEntity<Mono<DailyReportResponseDTO>> getDailyReportByDate(
			@RequestHeader("Authorization") String token, @PathVariable LocalDate date) {
		Mono<DailyReportResponseDTO> dailyReport = this.reportService.getDailyReportByDate(token, date);
		return ResponseEntity.ok().body(dailyReport);
	}

	@GetMapping("/weekly")
	private ResponseEntity<Mono<WeeklyReportResponseDTO>> getWeeklyReport(
			@RequestHeader("Authorization") String token) {
		Mono<WeeklyReportResponseDTO> dailyReport = this.reportService.getWeeklyReport(token);
		return ResponseEntity.ok().body(dailyReport);
	}

	@GetMapping("/daily/all")
	private ResponseEntity<Flux<DailyReportResponseDTO>> getAllDailyReports (@RequestHeader("Authorization") String token){
		Flux<DailyReportResponseDTO> dailyReports = this.reportService.getAllDailyReports(token);
		return ResponseEntity.ok().body(dailyReports);
	}
}
