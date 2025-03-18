package com.project.mysell.service.product.barcode;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;

import com.project.mysell.dto.product.barcode.APIProductBarCodeResponseDTO;
import com.project.mysell.dto.product.barcode.ProductStructure;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureResponseDTO;
import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.exceptions.product.ProductNotFoundException;
import com.project.mysell.exceptions.server.InternalServerErrorException;
import com.project.mysell.service.UnityOfMeasureService;

import reactor.core.publisher.Mono;
@Service
public class APIProductBarCodeService {
    private final WebClient webClient;
    private final APIProductBarCodeProperties properties;
    @Autowired
    private UnityOfMeasureService measureService;
    public APIProductBarCodeService(
            WebClient.Builder builder,
            APIProductBarCodeProperties properties) {
        this.properties = properties;
        this.webClient = builder.baseUrl(properties.getUrl()).build();
    }
    public Mono<ProductStructure> getProductByBarCode(Long barcode) {
        return webClient.get()
            .uri(barcode.toString())
            .header(properties.getHeader(), properties.getToken())
            .retrieve()
            .onStatus(status -> status.is4xxClientError(), response -> {
                return Mono.error(new ProductNotFoundException(barcode));
            })
            .onStatus(status -> status.is5xxServerError(), response -> {
            	return Mono.error(new InternalServerErrorException());
            })
            .bodyToMono(APIProductBarCodeResponseDTO.class)
            .flatMap(this::convertResponseToProduct);
    }
    private Mono<ProductStructure> convertResponseToProduct(APIProductBarCodeResponseDTO responseDTO) {
    	ProductStructure product = new ProductStructure();
    	 Mono<ProductStructure> productMono;
    	if(responseDTO.description() != null && !responseDTO.description().isEmpty()) {
    		productMono = measureService.getListUnitsName().flatMap(list->{
    			String[] components = APIProductBarCodeUtils.parse(responseDTO.description(), list);
    			String name = components[0];
    			Long quantity = null;
    			try {
    				System.out.println(components[1]);
					quantity = Long.parseLong(components[1]);
				} catch (Exception e) {
				}
    			String unit = components[2];
    			
    			if (name!=null && !name.isEmpty()) product.setName(name);
    			product.setProductUnitOfMeasureDTO(
    					new ProductUnitOfMeasureResponseDTO(quantity, 
    							new UnityOfMeasureDTO(unit)));
    			return Mono.just(product);
    		});
    	}else {
    		 productMono = Mono.just(product);
    	}
    	productMono = productMono.doOnNext(p ->{
    		if (responseDTO.brand() != null && responseDTO.brand().name()!=null && !responseDTO.brand().name().isEmpty())
    			p.setBrand(responseDTO.brand().name());

    		if (responseDTO.avgPrice()!=null) p.setPurchasedPrice(responseDTO.avgPrice());
    	});
	
		
		return productMono;
    	
	}
}	

