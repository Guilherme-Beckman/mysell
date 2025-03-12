package com.project.mysell.service.report.ranking;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.ranking.DailyProductRankingDTO;
import com.project.mysell.dto.report.ranking.ProductPositionDTO;
import com.project.mysell.model.report.ranking.DailyProductRankingModel;
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
	    DailyProductRankingModel newDailyProductRanking = new DailyProductRankingModel();
	    return dailyProductRankingRepository.save(newDailyProductRanking)
	        .flatMap(savedRanking -> 
	            Flux.fromIterable(dailyProductRankingDTO.productPositionDTO())
	                .flatMap(productPosition -> 
	                    this.productPositionService.createProductPosition(savedRanking.getDailyRankingProductsId(), productPosition)
	                )
	                .then(Mono.just(savedRanking))
	        );
	}

	public Mono<DailyProductRankingDTO> createDailyProductRankingDTO(Long dailyProductRankingId) {
		return this.productPositionService.getAllByIdDailyProductRankingId(dailyProductRankingId)
		.map(list -> new DailyProductRankingDTO(list));
	}

}
