package com.project.mysell.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.service.ReportService;

import reactor.core.publisher.Mono;
@RestController
@RequestMapping("/report")
public class ReportController {
	private ReportService reportService;
	@GetMapping("/daily")
	private ResponseEntity<Mono<DailyReportDTO>> getDailyReport (@RequestHeader("Authorization") String token){
		Mono<DailyReportDTO> dailyReport = this.reportService.getDailyReport(token);
		return ResponseEntity.ok().body(dailyReport);
	}
}
