package com.project.mysell.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.dto.sell.SellResponseDTO;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class ReportService {
	@Autowired
    private JwtTokenProvider jwtTokenProvider;
	@Autowired
	private SellService sellService;
	
	public Mono<DailyReportResponseDTO> getDailyReport(String token) {
    	final UUID userId = extractUserIdFromToken(token);
    	return generateDailyReportResponse(userId);
	
	}
  private Flux<SellResponseDTO> getSalesForToday(String userId) {
		  Flux<SellResponseDTO> sales = sellService.getTodaySellByUserId(userId);
	  }
	private Mono<DailyReportResponseDTO> generateDailyReportResponse(UUID userId) {
		// TODO Auto-generated method stub
		return null;
	}

	private UUID extractUserIdFromToken(String token) {
	        return jwtTokenProvider.getUserIdFromToken(jwtTokenProvider.extractJwtToken(token));
	    }

}
