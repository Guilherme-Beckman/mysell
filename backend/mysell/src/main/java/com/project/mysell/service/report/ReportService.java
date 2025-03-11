package com.project.mysell.service.report;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.dto.report.SaleInformation;
import com.project.mysell.dto.report.ranking.DailyProductRankingDTO;
import com.project.mysell.dto.sell.SellResponseDTO;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.service.SellService;
import com.project.mysell.service.report.ranking.RankingService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class ReportService {
	@Autowired
    private JwtTokenProvider jwtTokenProvider;
	@Autowired
	private SellService sellService;
	@Autowired
	private RankingService rankingService;
	
	public Mono<DailyReportResponseDTO> getDailyReport(String token) {
    	final UUID userId = extractUserIdFromToken(token);
    	return generateDailyReportResponse(userId);
	}
	private Mono<DailyReportResponseDTO> generateDailyReportResponse(UUID userId) {
		var sales = getSalesForToday(userId);
		Mono<DailyReportAccumulator> dailyReportAccumulator = calculateForDailyReport(sales);
		Mono<DailyProductRankingDTO> ranking = rankingService.calculateDailyProductRanking(sales);
		
	    return Mono.zip(dailyReportAccumulator, ranking)
	            .map(tuple -> {
	                DailyReportAccumulator accumulator = tuple.getT1();
	                DailyProductRankingDTO rankingDTO = tuple.getT2();
	                return new DailyReportResponseDTO(
	                        LocalDate.now(),
	                        accumulator.getProfit(),
	                        accumulator.getGrossRevenue(),
	                        accumulator.getSaleCount(),
	                        rankingDTO
	                );
	            });
		
	};
	private Mono<DailyReportAccumulator> calculateForDailyReport (Flux<SellResponseDTO> sellResponseDTO) {
		return sellResponseDTO
				.map(this::getSaleInformation)
				.reduce(new DailyReportAccumulator(), DailyReportAccumulator::accumulate);
				
	}

	private SaleInformation getSaleInformation(SellResponseDTO sell) {
	    double profit = (sell.productResponseDTO().priceToSell() - sell.productResponseDTO().purchasedPrice()) * sell.quantity();
	    double grossRevenue = sell.productResponseDTO().priceToSell() * sell.quantity();
	    return new SaleInformation(profit, grossRevenue, sell.quantity());
	}

	
	private Flux<SellResponseDTO> getSalesForToday(UUID userId) {
		  return sellService.getTodaySellByUserId(userId);	  
		  }


	private UUID extractUserIdFromToken(String token) {
	        return jwtTokenProvider.getUserIdFromToken(jwtTokenProvider.extractJwtToken(token));
	    }

}
