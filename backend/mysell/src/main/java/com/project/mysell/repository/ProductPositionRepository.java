package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.dto.report.ranking.ProductPositionDTO;
import com.project.mysell.model.report.ranking.ProductPositionModel;

import reactor.core.publisher.Flux;

@Repository
public interface ProductPositionRepository extends ReactiveCrudRepository<ProductPositionModel, Long> {

	Flux<ProductPositionModel> findAllByDailyProductRankingId(Long dailyProductRankingId);

}
