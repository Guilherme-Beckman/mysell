package com.project.mysell.service.report;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.product.ProductResponseDTO;
import com.project.mysell.dto.report.SellsByProductDTO;
import com.project.mysell.dto.sell.SellResponseDTO;
import com.project.mysell.model.report.SellsByProductsModel;
import com.project.mysell.repository.SellsByProductRepository;
import com.project.mysell.service.ProductService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class SellsByProductService {
	
	@Autowired
	private SellsByProductRepository sellsByProductRepository;
	@Autowired
	private ProductService productService;
	
	public Mono<Void> createSellsByProductByFlux(Long dailyReportsId, List<SellsByProductDTO> sellsByProduct) {
	    return Flux.fromIterable(sellsByProduct)
	        .flatMap(dto -> createSellsByProducts(dailyReportsId, dto))
	        .then();
	}

	private Mono<SellsByProductsModel> createSellsByProducts(Long dailyReportsId, SellsByProductDTO sellsByProduct) {
	    SellsByProductsModel newSellsByProduct = new SellsByProductsModel(dailyReportsId, sellsByProduct);
	    return this.sellsByProductRepository.save(newSellsByProduct);
	}

	public Flux<SellsByProductsModel> getAllSellsByProductByDailyReportId(Long dailyReportId){
		return this.sellsByProductRepository.findAllByDailyReportId(dailyReportId);
	}

	public Flux<SellsByProductDTO> getAllSellsByProductResponseByDailyReportId(Long dailyReportId){
	    return this.sellsByProductRepository.findAllByDailyReportId(dailyReportId)
	            .flatMap(this::convertToSellsByProductDTO);
	}

	private Mono<SellsByProductDTO> convertToSellsByProductDTO(SellsByProductsModel model) {
	    return this.productService.getProductResponseById(model.getProductId())
	        .map(product -> new SellsByProductDTO(
	            model.getSaleCount(),
	            model.getProfit(),
	            model.getGrossRevenue(),
	            product
	        ));
	}


	
	public Flux<SellsByProductDTO> calculateSellsByProductId(Flux<SellResponseDTO> salesFlux) {
	    return salesFlux
	        .groupBy(sell -> sell.productResponseDTO().productsId())
	        .flatMap(this::aggregateProductSales);
	}

    private Mono<SellsByProductDTO> aggregateProductSales(Flux<SellResponseDTO> productGroup) {
        return productGroup
            .reduce(
                new SellsByProductDTO(0L,0D,0D, null),
                this::accumulateSalesInformation
            );
    }

    private SellsByProductDTO accumulateSalesInformation(SellsByProductDTO accumulator, SellResponseDTO sell) {
        var productSell = sell.productResponseDTO();
        long updatedQuantity = accumulator.saleCount() + sell.quantity();
        double unitProfit = productSell.priceToSell() - productSell.purchasedPrice();
        double updatedProfit = accumulator.profit() + (unitProfit * sell.quantity());
        double updatedGrossRevenue = accumulator.grossRevenue() + (productSell.priceToSell() * sell.quantity());
        var product = getProductFromAccumulator(accumulator, sell);
        return new SellsByProductDTO(updatedQuantity, updatedProfit, updatedGrossRevenue, product);
    }


 
    private static ProductResponseDTO getProductFromAccumulator(SellsByProductDTO accumulator, SellResponseDTO sell) {
        return accumulator.productResponseDTO() != null 
            ? accumulator.productResponseDTO() 
            : sell.productResponseDTO();
    }

	
	
	
}