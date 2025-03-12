package com.project.mysell.service.report.ranking;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.report.ranking.ProductPositionDTO;
import com.project.mysell.model.report.ranking.ProductPositionModel;
import com.project.mysell.repository.ProductPositionRepository;
import com.project.mysell.service.ProductService;

import reactor.core.publisher.Mono;

@Service
public class ProductPositionService {
	@Autowired
	private RankingService rankingService;
	@Autowired
	private ProductPositionRepository productPositionRepository;
	@Autowired
	private ProductService productService;
	public Mono<ProductPositionModel> createProductPosition(Long dailyRankingId, ProductPositionDTO productPosition) {
		ProductPositionModel newProductPosition = new ProductPositionModel(dailyRankingId, productPosition);
		return this.productPositionRepository.save(newProductPosition);
	}

	public Mono<List<ProductPositionDTO>> getAllByIdDailyProductRankingId(Long dailyProductRankingId) {
	    return productPositionRepository.findAllByDailyProductRankingId(dailyProductRankingId)
	            .flatMap(productPositionModel -> 
	                productService.getProductById(productPositionModel.getProductId())
	                    .map(product -> new ProductPositionDTO(
	                        productPositionModel.getPosition(),
	                        productPositionModel.getSaleCount(),
	                        product))
	            )
	            .collectSortedList(rankingService.SALE_COUNT_DESCENDING_COMPARATOR)
	            .flatMap(list ->{
	            	return Mono.just(this.rankingService.assignProductRanks(list));
	            });
	}


}
