package com.project.mysell.service.product.barcode;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;

import com.project.mysell.dto.category.CategoryDTO;
import com.project.mysell.dto.product.barcode.APIProductBarCodeResponseDTO;
import com.project.mysell.dto.product.barcode.ProductStructure;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureResponseDTO;
import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.exceptions.product.ProductNotFoundException;
import com.project.mysell.exceptions.server.InternalServerErrorException;
import com.project.mysell.service.CategoryService;
import com.project.mysell.service.UnityOfMeasureService;

import reactor.core.publisher.Mono;
@Service
public class APIProductBarCodeService {
    private final WebClient webClient;
    private final APIProductBarCodeProperties properties;
    @Autowired
    private UnityOfMeasureService measureService;
    @Autowired
    private CategoryService categoryService;
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
        
        Mono<ProductStructure> productMono = Mono.just(product);
        
        if(responseDTO.description() != null && !responseDTO.description().isEmpty()) {
            productMono = productMono.flatMap(prod -> 
                measureService.getListUnitsName().flatMap(list -> {
                    String[] components = APIProductBarCodeUtils.parse(responseDTO.description(), list);
                    String name = components[0];
                    Double quantity = null;
                    try {
                        quantity = Double.parseDouble(components[1]);
                    } catch (Exception e) {
                    }
                    String unit = components[2];
                    
                    if (name != null && !name.isEmpty()) {
                        prod.setName(name);
                    }
                    prod.setProductUnitOfMeasureDTO(new ProductUnitOfMeasureResponseDTO(quantity, new UnityOfMeasureDTO(unit)));
                    return Mono.just(prod);
                })
            );
        }
        
        if(responseDTO.gpc() != null && responseDTO.gpc().description() != null && !responseDTO.gpc().description().isEmpty()) {
            productMono = productMono.flatMap(prod ->
                categoryService.getListCategoriesName().flatMap(list -> {
                    String category = APIProductBarCodeUtils.containsCategory(responseDTO.gpc().description(), list);
                    prod.setCategory(new CategoryDTO(category));
                    return Mono.just(prod);
                })
            );
        }
        
        productMono = productMono.doOnNext(prod -> {
            if (responseDTO.brand() != null && responseDTO.brand().name() != null && !responseDTO.brand().name().isEmpty())
                prod.setBrand(responseDTO.brand().name());
            if (responseDTO.avgPrice() != null)
                prod.setPurchasedPrice(responseDTO.avgPrice());
        });
        
        return productMono;
    }

}	

