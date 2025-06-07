package com.project.mysell.service.report;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.DailyReportResponseDTO;
import com.project.mysell.dto.report.DailyReportResponseDTOSimplified;
import com.project.mysell.dto.report.SaleInformation;
import com.project.mysell.dto.report.SellsByProductDTO;
import com.project.mysell.dto.report.WeeklyReportResponseDTO;
import com.project.mysell.dto.sell.SellResponseDTO;
import com.project.mysell.exceptions.report.DailyReportNotFoundException;
import com.project.mysell.exceptions.sell.UserHasNoSalesTodayException;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.UserModel;
import com.project.mysell.model.report.DailyReportModel;
import com.project.mysell.model.report.WeeklyReportModel;
import com.project.mysell.repository.DailyReportRepository;
import com.project.mysell.repository.WeeklyReportRepository;
import com.project.mysell.service.SellService;
import com.project.mysell.service.UserService;

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
    @Autowired
    private WeeklyReportRepository weeklyReportRepository;
    

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
    public Mono<WeeklyReportResponseDTO> getWeeklyReport(String token) {
        final UUID userId = extractUserIdFromToken(token);
        return generateWeeklyReportResponse(userId);
    }

    private Mono<DailyReportResponseDTO> generateDailyReportResponse(UUID userId) {
        Flux<SellResponseDTO> todaysSales = retrieveSalesForToday(userId);
        
        Mono<ReportAccumulator> reportAccumulator = calculateReportAccumulator(todaysSales);
        Flux<SellsByProductDTO> sellsByProducts = this.sellsByProductService.calculateSellsByProductId(todaysSales);
        return createDailyReportResponse(reportAccumulator, sellsByProducts);
    }
    private Mono<DailyReportResponseDTO> createDailyReportResponse(Mono<ReportAccumulator> accumulatorMono, Flux<SellsByProductDTO> sellsByProductFlux) {
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



    private Mono<ReportAccumulator> calculateReportAccumulator(Flux<SellResponseDTO> sales) {
        return sales.map(this::createSaleInformation)
                    .reduce(new ReportAccumulator(), ReportAccumulator::accumulate);
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
                .flatMap(dailyReport -> createAndSaveDailyReport(user, dailyReport))
                .onErrorResume(this::skipUserWithNoSales);
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

    private Mono<Void> skipUserWithNoSales(Throwable error) {
        if (error instanceof UserHasNoSalesTodayException) {
            return Mono.empty();
        }
        return Mono.error(error);
    }
    public Mono<Void> saveWeeklyReport() {
        return userService.getAllUsers()
                .flatMap(this::processUserWeeklyReport)
                .then();
    }
    private Mono<Void> processUserWeeklyReport(UserModel user) {
        return generateWeeklyReportResponse(user.getUsersId())
                .flatMap(dailyReport -> createAndSaveWeeklyReport(user, dailyReport))
                .onErrorResume(this::skipUserWithNoSales);
    }

    private Mono<WeeklyReportResponseDTO> generateWeeklyReportResponse(UUID userId) {
        Flux<SellResponseDTO> weekSales = retrieveSalesForThisWeek(userId);
        
        Mono<ReportAccumulator> reportAccumulator = calculateReportAccumulator(weekSales);
        Flux<DailyReportResponseDTOSimplified> dailyReportsPersisted = this.dailyReportRepository
        	    .getThisWeekDailyReportByUserId(userId)
        	    .flatMap(this::createDailyReportResponseSimplified);

        	Mono<DailyReportResponseDTOSimplified> todayReport = generateDailyReportResponse(userId)
        	    .map(daily -> new DailyReportResponseDTOSimplified(
        	        daily.date(),
        	        daily.profit(),
        	        daily.grossRevenue(),
        	        daily.numberOfSales()
        	    ));

        	Flux<DailyReportResponseDTOSimplified> dailyReportsWeek = Flux.concat(dailyReportsPersisted, todayReport);

        return createWeeklyReportResponse(reportAccumulator, dailyReportsWeek);
    }

    private Mono<DailyReportResponseDTOSimplified> createDailyReportResponseSimplified(DailyReportModel dailyReport) {
    			return buildResponseDTOSimplified(dailyReport);
    }

    private Mono<DailyReportResponseDTOSimplified> buildResponseDTOSimplified(DailyReportModel dailyReport) {
    	return Mono.just(new DailyReportResponseDTOSimplified(
    			dailyReport.getDate(),
    			dailyReport.getProfit(),
    			dailyReport.getGrossRevenue(),
    			dailyReport.getNumberOfSales()
    			));
    }
    private Mono<WeeklyReportResponseDTO> createWeeklyReportResponse(Mono<ReportAccumulator> accumulatorMono, Flux<DailyReportResponseDTOSimplified> dailyReportsWeek) {
        return Mono.zip(
                accumulatorMono,
                dailyReportsWeek.collectList()
            )
            .map(tuple -> {
                ReportAccumulator accumulator = tuple.getT1();
                List<DailyReportResponseDTOSimplified> dailyReports = tuple.getT2();
                LocalDate now = LocalDate.now();
                LocalDate monday = now.with(DayOfWeek.MONDAY);
                Date firstDay = Date.valueOf(monday);
                Date lastDay = Date.valueOf(now);
                return new WeeklyReportResponseDTO(
                    firstDay,
                    lastDay,
                    accumulator.getProfit(),
                    accumulator.getGrossRevenue(),
                    accumulator.getSaleCount(),
                    dailyReports
                );
            });
    }

    private Flux<SellResponseDTO> retrieveSalesForThisWeek(UUID userId) {
        return sellService.getThisWeekSellByUserId(userId);
    }
    private Mono<Void> createAndSaveWeeklyReport(UserModel user, WeeklyReportResponseDTO weeklyReport) {
    	return this.persistWeeklyReport(user, weeklyReport).then();
    }
    private Mono<WeeklyReportModel> persistWeeklyReport(UserModel user, WeeklyReportResponseDTO weeklyReport) {
    	WeeklyReportModel newWeeklyReport = new WeeklyReportModel(user.getUsersId(), weeklyReport);
        return this.weeklyReportRepository.save(newWeeklyReport);
    }


}