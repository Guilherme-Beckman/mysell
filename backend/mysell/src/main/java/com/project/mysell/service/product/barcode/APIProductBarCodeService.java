package com.project.mysell.service.product.barcode;


import java.util.logging.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.client.WebClient;

import com.project.mysell.dto.product.barcode.APIProductBarCodeResponseDTO;
import com.project.mysell.dto.product.barcode.ProductStructure;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureResponseDTO;
import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.service.UnityOfMeasureService;

import reactor.core.publisher.Mono;
@Service
public class APIProductBarCodeService {
    private final WebClient webClient;
    private final APIProductBarCodeProperties properties;
    private final UnityOfMeasureService measureService;

    public APIProductBarCodeService(
            WebClient.Builder builder,
            APIProductBarCodeProperties properties,
            UnityOfMeasureService measureService) {
        this.properties = properties;
        this.measureService = measureService;
        this.webClient = builder.baseUrl(properties.getUrl()).build();
    }
    public Mono<ProductStructure> getProductByBarCode(Long barcode) {
        return webClient.get()
            .uri(barcode.toString())
            .header(properties.getHeader(), properties.getToken())
            .retrieve()
            .onStatus(status -> status.is4xxClientError(), response -> {
                // Lógica para tratar erros do cliente (4xx)
                return Mono.error(new HttpClientErrorException(response.statusCode()));
            })
            .onStatus(status -> status.is5xxServerError(), response -> {
                return null;
            })
            .bodyToMono(APIProductBarCodeResponseDTO.class)
            .flatMap(this::convertResponseToProduct);
    }
    private Mono<ProductStructure> convertResponseToProduct(APIProductBarCodeResponseDTO responseDTO) {
        ProductStructure productStructure = new ProductStructure();

        if (responseDTO.description() != null && !responseDTO.description().isEmpty()) {
            String[] components = APIProductBarCodeUtils.extractComponents(responseDTO.description());

            String name = components[0];
            Long quantity = Long.parseLong(components[1]);
            String unitName = components[2];

            productStructure.setName(name);

            Mono<ProductStructure> productMono;
            if (unitName != null && !unitName.isEmpty()) {
                productMono = measureService.getUnityOfMeasureByName(unitName.toLowerCase())
                    .flatMap(unit -> {
                        ProductUnitOfMeasureResponseDTO dto = 
                            new ProductUnitOfMeasureResponseDTO(quantity, new UnityOfMeasureDTO(unit.getName()));
                        productStructure.setProductUnitOfMeasureDTO(dto);
                        return Mono.just(productStructure);
                    });
            } else {
                productMono = Mono.just(productStructure);
            }

            if (responseDTO.avgPrice() != null) {
                productStructure.setPurchasedPrice(responseDTO.avgPrice());
            } else {
            }

            if (responseDTO.brand() != null && responseDTO.brand().name() != null 
                    && !responseDTO.brand().name().isEmpty()) {
                productStructure.setBrand(responseDTO.brand().name());
            } else {
            }

            return productMono;
        } else {
            return Mono.just(productStructure);
        }
    }



	}
	

