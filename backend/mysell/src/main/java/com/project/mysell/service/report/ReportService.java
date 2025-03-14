package com.project.mysell.service.report;



import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.dto.report.SaleInformation;
import com.project.mysell.dto.report.ranking.SellsByProductDTO;
import com.project.mysell.dto.sell.SellResponseDTO;
import com.project.mysell.exceptions.report.DailyReportNotFoundException;
import com.project.mysell.exceptions.sell.UserHasNoSalesTodayException;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.model.report.DailyReportModel;
import com.project.mysell.repository.DailyReportRepository;
import com.project.mysell.service.SellService;
import com.project.mysell.service.UserService;
import com.project.mysell.service.report.ranking.SellsByProductService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ReportService {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private SellService sellService;
    @Autowired
    private SellsByProductService sellsByProductService;
    @Autowired
	private UserService userService;
    @Autowired
	private DailyReportRepository dailyReportRepository;
    

    public Mono<DailyReportResponseDTO> getDailyReportByDate(String token, LocalDate date) {
        UUID userId = extractUserIdFromToken(token);
        return findDailyReport(userId, date)
                .flatMap(this::createDailyReportResponse);
    }

    private Mono<DailyReportModel> findDailyReport(UUID userId, LocalDate date) {
        return dailyReportRepository.findDailyReportByDate(userId, date)
        		.switchIfEmpty(Mono.error(new DailyReportNotFoundException(date)));
    }

    private Mono<DailyReportResponseDTO> createDailyReportResponse(DailyReportModel dailyReport) {
    	 var sellsByProduct = sellsByProductService.getAllSellsByProductResponseByDailyReportId(dailyReport.getDailyReportsId());
    			return buildResponseDTO(dailyReport, sellsByProduct);
    }

 
    private Mono<DailyReportResponseDTO> buildResponseDTO(DailyReportModel dailyReport, Flux<SellsByProductDTO> sellsByProductDTO) {
        return sellsByProductDTO.collectList()
                .map(sellsList -> new DailyReportResponseDTO(
                    dailyReport.getDate(),
                    dailyReport.getProfit(),
                    dailyReport.getGrossRevenue(),
                    dailyReport.getNumberOfSales(),
                    sellsList
                ));
    }



    public Mono<DailyReportResponseDTO> getDailyReport(String token) {
        final UUID userId = extractUserIdFromToken(token);
        return generateDailyReportResponse(userId);
    }

    private Mono<DailyReportResponseDTO> generateDailyReportResponse(UUID userId) {
        Flux<SellResponseDTO> todaysSales = retrieveSalesForToday(userId);
        
        Mono<DailyReportAccumulator> reportAccumulator = calculateReportAccumulator(todaysSales);
        Flux<SellsByProductDTO> sellsByProducts = this.sellsByProductService.calculateSellsByProductId(todaysSales);
        return createDailyReportResponse(reportAccumulator, sellsByProducts);
    }
    private Mono<DailyReportResponseDTO> createDailyReportResponse(Mono<DailyReportAccumulator> accumulatorMono, Flux<SellsByProductDTO> sellsByProductFlux) {
        return Mono.zip(
                accumulatorMono,
                sellsByProductFlux.collectList()
            ).map(tuple -> 
                new DailyReportResponseDTO(
                    LocalDate.now(),
                    tuple.getT1().getProfit(),
                    tuple.getT1().getGrossRevenue(),
                    tuple.getT1().getSaleCount(),
                    tuple.getT2()
                )
            );
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
                .flatMap(this::processUserDailyReport)
                .then();
    }

    private Mono<Void> processUserDailyReport(UserModel user) {
        return generateDailyReportForUser(user.getUsersId())
                .onErrorResume(this::skipUserWithNoSales)
                .flatMap(dailyReport -> createAndSaveDailyReport(user, dailyReport));
    }

    private Mono<DailyReportResponseDTO> generateDailyReportForUser(UUID userId) {
        return generateDailyReportResponse(userId);
    }

    private Mono<Void> createAndSaveDailyReport(UserModel user, DailyReportResponseDTO dailyReport) {
    	return this.persistDailyReport(user, dailyReport)
    			.flatMap(persistDailyReport-> 
    			this.sellsByProductService.createSellsByProductByFlux(persistDailyReport.getDailyReportsId(), dailyReport.sellsByProduct()));
    }

    private Mono<DailyReportModel> persistDailyReport(UserModel user, DailyReportResponseDTO dailyReport) {
        DailyReportModel reportModel = createDailyReportModel(user, dailyReport);
        return dailyReportRepository.save(reportModel);
    }

    private DailyReportModel createDailyReportModel(UserModel user, DailyReportResponseDTO report) {
        return new DailyReportModel(
                user.getUsersId(),
                report
        );
    }

    private Mono<DailyReportResponseDTO> skipUserWithNoSales(Throwable error) {
        if (error instanceof UserHasNoSalesTodayException) {
            return Mono.empty();
        }
        return Mono.error(error);
    }


}