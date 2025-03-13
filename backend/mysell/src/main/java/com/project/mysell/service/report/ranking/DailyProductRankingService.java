package com.project.mysell.service.report.ranking;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.ranking.DailyProductRankingDTO;
import com.project.mysell.dto.report.ranking.ProductPositionDTO;
import com.project.mysell.model.report.ranking.DailyProductRankingModel;
import com.project.mysell.model.report.ranking.ProductPositionModel;
import com.project.mysell.repository.DailyProductRankingRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class DailyProductRankingService {
	@Autowired
    private DailyProductRankingRepository dailyProductRankingRepository;
	@Autowired
    private ProductPositionService productPositionService;
    public Mono<DailyProductRankingModel> createDailyProductRanking(DailyProductRankingDTO dailyProductRankingDTO) {
        return saveDailyProductRanking()
            .flatMap(savedRanking -> saveProductPositions(savedRanking, dailyProductRankingDTO));
    }

    public Mono<DailyProductRankingDTO> createDailyProductRankingDTO(Long dailyProductRankingId) {
        return productPositionService.getAllByIdDailyProductRankingId(dailyProductRankingId)
            .map(this::buildDailyProductRankingDTO);
    }

    private Mono<DailyProductRankingModel> saveDailyProductRanking() {
        return dailyProductRankingRepository.save(new DailyProductRankingModel());
    }

    private Mono<DailyProductRankingModel> saveProductPositions(
        DailyProductRankingModel savedRanking,
        DailyProductRankingDTO dailyProductRankingDTO
    ) {
        return Flux.fromIterable(dailyProductRankingDTO.productPositionDTO())
            .flatMap(productPositionDTO -> saveProductPosition(savedRanking, productPositionDTO))
            .then(Mono.just(savedRanking));
    }

    private Mono<ProductPositionModel> saveProductPosition(
        DailyProductRankingModel savedRanking,
        ProductPositionDTO productPositionDTO
    ) {
        return productPositionService.createProductPosition(
            savedRanking.getDailyRankingProductsId(),
            productPositionDTO
        );
    }

    private DailyProductRankingDTO buildDailyProductRankingDTO(List<ProductPositionDTO> productPositions) {
        return new DailyProductRankingDTO(productPositions);
    }
}