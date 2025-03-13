package com.project.mysell.service.report.ranking;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.product.ProductResponseDTO;
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


    public Mono<ProductPositionModel> createProductPosition(Long dailyRankingId, ProductPositionDTO productPositionDTO) {
        ProductPositionModel newPosition = createPositionModel(dailyRankingId, productPositionDTO);
        return productPositionRepository.save(newPosition);
    }

    public Mono<List<ProductPositionDTO>> getAllByIdDailyProductRankingId(Long dailyProductRankingId) {
        return productPositionRepository.findAllByDailyProductRankingId(dailyProductRankingId)
                .flatMap(this::convertToDTO)
                .collectSortedList(rankingService.SALE_COUNT_DESCENDING_COMPARATOR)
                .map(this::processSortedPositions);
    }

    private ProductPositionModel createPositionModel(Long dailyRankingId, ProductPositionDTO dto) {
        return new ProductPositionModel(dailyRankingId, dto);
    }

    private Mono<ProductPositionDTO> convertToDTO(ProductPositionModel model) {
        return productService.getProductResponseById(model.getProductId())
                .map(product -> buildProductPositionDTO(model, product));
    }

    private ProductPositionDTO buildProductPositionDTO(ProductPositionModel model, ProductResponseDTO product) {
        return new ProductPositionDTO(
            model.getPosition(),
            model.getSaleCount(),
            product
        );
    }

    private List<ProductPositionDTO> processSortedPositions(List<ProductPositionDTO> sortedPositions) {
        return rankingService.assignProductRanks(sortedPositions);
    }
}