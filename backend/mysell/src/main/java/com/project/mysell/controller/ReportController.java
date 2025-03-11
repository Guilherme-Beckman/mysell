package com.project.mysell.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.service.report.ReportService;

import reactor.core.publisher.Mono;
@RestController
@RequestMapping("/report")
public class ReportController {
	@Autowired
	private ReportService reportService;
	@GetMapping("/daily")
	private ResponseEntity<Mono<DailyReportResponseDTO>> getDailyReport (@RequestHeader("Authorization") String token){
		Mono<DailyReportResponseDTO> dailyReport = this.reportService.getDailyReport(token);
		return ResponseEntity.ok().body(dailyReport);
	}
}
