package com.project.mysell.service.report.ranking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.ranking.ProductPositionDTO;
import com.project.mysell.model.report.ranking.ProductPositionModel;
import com.project.mysell.repository.ProductPositionRepository;

import reactor.core.publisher.Mono;

@Service
public class ProductPositionService {
	@Autowired
	private ProductPositionRepository productPositionRepository;

	public Mono<ProductPositionModel> createProductPosition(Long dailyRankingId, ProductPositionDTO productPosition) {
		ProductPositionModel newProductPosition = new ProductPositionModel(dailyRankingId, productPosition);
		return this.productPositionRepository.save(newProductPosition);
	}

}
