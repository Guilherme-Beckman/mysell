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
import com.project.mysell.model.report.DailyReportModel;
import com.project.mysell.repository.DailyReportRepository;
import com.project.mysell.service.SellService;
import com.project.mysell.service.UserService;
import com.project.mysell.service.report.ranking.DailyProductRankingService;
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
    @Autowired
	private UserService userService;
    @Autowired
	private DailyProductRankingService dailyProductRankingService;
    @Autowired
	private DailyReportRepository dailyReportRepository;


    public Mono<DailyReportResponseDTO> getDailyReport(String token) {
        final UUID userId = extractUserIdFromToken(token);
        return generateDailyReportResponse(userId);
    }

    private Mono<DailyReportResponseDTO> generateDailyReportResponse(UUID userId) {
        Flux<SellResponseDTO> todaysSales = retrieveSalesForToday(userId);
        
        Mono<DailyReportAccumulator> reportAccumulator = calculateReportAccumulator(todaysSales);
        Mono<DailyProductRankingDTO> productRanking = rankingService.calculateDailyProductRanking(todaysSales);

        return createDailyReportResponse(reportAccumulator, productRanking);
    }

    private Mono<DailyReportResponseDTO> createDailyReportResponse(Mono<DailyReportAccumulator> tuple1, Mono<DailyProductRankingDTO> tuple2) {
    	return Mono.zip(tuple1,tuple2)
    	.map(tuple -> {
    		 DailyReportAccumulator accumulator = tuple.getT1();
             DailyProductRankingDTO ranking = tuple.getT2();
             return new DailyReportResponseDTO(
                     LocalDate.now(),
                     accumulator.getProfit(),
                     accumulator.getGrossRevenue(),
                     accumulator.getSaleCount(),
                     ranking
                 );
    	});
    
    }

    private Mono<DailyReportAccumulator> calculateReportAccumulator(Flux<SellResponseDTO> sales) {
        return sales.map(this::createSaleInformation)
                    .reduce(new DailyReportAccumulator(), DailyReportAccumulator::accumulate);
    }

    private SaleInformation createSaleInformation(SellResponseDTO sell) {
        double unitProfit = sell.productResponseDTO().priceToSell() 
                          - sell.productResponseDTO().purchasedPrice();
        
        double totalProfit = unitProfit * sell.quantity();
        double totalRevenue = sell.productResponseDTO().priceToSell() * sell.quantity();
        
        return new SaleInformation(totalProfit, totalRevenue, sell.quantity());
    }

    private Flux<SellResponseDTO> retrieveSalesForToday(UUID userId) {
        return sellService.getTodaySellByUserId(userId);
    }

    private UUID extractUserIdFromToken(String token) {
        String jwtToken = jwtTokenProvider.extractJwtToken(token);
        return jwtTokenProvider.getUserIdFromToken(jwtToken);
    }

    public Mono<Void> saveDailyReport() {
        return userService.getAllUsers()
                .flatMap(user -> generateDailyReportResponse(user.getUsersId())
                    .flatMap(dailyReport -> dailyProductRankingService.createDailyProductRanking(dailyReport.dailyProductRankingDTO())
                        .flatMap(savedDailyRanking -> {
                            DailyReportModel newDailyReportModel = new DailyReportModel(savedDailyRanking.getDailyRankingProductsId(), dailyReport);
                            return dailyReportRepository.save(newDailyReportModel);
                        })
                    )
                )
                .then(); 
    }



}