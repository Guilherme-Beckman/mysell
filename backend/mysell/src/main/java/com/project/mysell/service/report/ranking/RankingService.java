package com.project.mysell.service.report.ranking;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import com.project.mysell.dto.product.ProductResponseDTO;
import com.project.mysell.dto.report.ranking.DailyProductRankingDTO;
import com.project.mysell.dto.report.ranking.ProductPositionDTO;
import com.project.mysell.dto.sell.SellResponseDTO;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RankingService {

    private static final Comparator<ProductPositionDTO> SALE_COUNT_DESCENDING_COMPARATOR = 
        Comparator.comparing(ProductPositionDTO::saleCount).reversed();

    public Mono<DailyProductRankingDTO> calculateDailyProductRanking(Flux<SellResponseDTO> salesFlux) {
        return salesFlux
            .groupBy(sell -> sell.productResponseDTO().productsId())
            .flatMap(this::aggregateProductSales)
            .collectSortedList(SALE_COUNT_DESCENDING_COMPARATOR)
            .map(this::assignProductRanks)
            .map(DailyProductRankingDTO::new);
    }

    private Mono<ProductPositionDTO> aggregateProductSales(Flux<SellResponseDTO> productGroup) {
        return productGroup
            .reduce(
                new ProductPositionDTO(0L, 0L, null),
                this::accumulateProductSales
            );
    }

    private ProductPositionDTO accumulateProductSales(ProductPositionDTO accumulator, SellResponseDTO sell) {
        long updatedQuantity = accumulator.saleCount() + sell.quantity();
        var product = getProductFromAccumulator(accumulator, sell);
        return new ProductPositionDTO(0L, updatedQuantity, product);
    }

    private List<ProductPositionDTO> assignProductRanks(List<ProductPositionDTO> sortedProducts) {
        return IntStream.range(0, sortedProducts.size())
            .mapToObj(index -> createRankedPosition(index, sortedProducts.get(index)))
            .collect(Collectors.toList());
    }

    private ProductPositionDTO createRankedPosition(int index, ProductPositionDTO position) {
        return new ProductPositionDTO(
            (long) (index + 1),
            position.saleCount(),
            position.productResponseDTO()
        );
    }

    private static ProductResponseDTO getProductFromAccumulator(ProductPositionDTO accumulator, SellResponseDTO sell) {
        return accumulator.productResponseDTO() != null 
            ? accumulator.productResponseDTO() 
            : sell.productResponseDTO();
    }
}