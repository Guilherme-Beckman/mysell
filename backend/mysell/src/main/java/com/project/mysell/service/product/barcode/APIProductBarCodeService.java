package com.project.mysell.service.product.barcode;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.category.CategoryDTO;
import com.project.mysell.dto.product.barcode.APIProductBarCodeResponseDTO;
import com.project.mysell.dto.product.barcode.ProductStructure;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureResponseDTO;
import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.exceptions.product.ProductNotFoundException;
import com.project.mysell.exceptions.server.InternalServerErrorException;
import com.project.mysell.exceptions.server.TooManyRequestsException;
import com.project.mysell.infra.redis.RedisService;
import com.project.mysell.service.CategoryService;
import com.project.mysell.service.UnityOfMeasureService;

import reactor.core.publisher.Mono;

@Service
public class APIProductBarCodeService {
    private static final int MIN_CATEGORY_CODE_LENGTH = 2;
    private final WebClient webClient;
    private final APIProductBarCodeProperties properties;
    private final UnityOfMeasureService measureService;
    private final CategoryService categoryService;
    
    @Autowired
    private RedisService redisService;
    
    @Autowired
    private ObjectMapper objectMapper;

    public APIProductBarCodeService(
            WebClient.Builder webClientBuilder,
            APIProductBarCodeProperties properties,
            UnityOfMeasureService measureService,
            CategoryService categoryService) {
        this.properties = properties;
        this.measureService = measureService;
        this.categoryService = categoryService;
        this.webClient = webClientBuilder.baseUrl(properties.getUrl()).build();
    }
    
    private String getBarcodeCacheKey(Long barcode) {
        return "barcode:" + barcode;
    }

    public Mono<ProductStructure> getProductByBarCode(Long barcode) {
        String cacheKey = getBarcodeCacheKey(barcode);
        
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof ProductStructure) {
                    return Mono.just((ProductStructure) value);
                } else if (value instanceof Map) {
                    ProductStructure product = objectMapper.convertValue(value, ProductStructure.class);
                    return Mono.just(product);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                fetchProductFromAPI(barcode)
                    .flatMap(product -> 
                        cacheProduct(cacheKey, product)
                            .thenReturn(product)
                    )
            );
    }
    
    private Mono<ProductStructure> fetchProductFromAPI(Long barcode) {
        return webClient.get()
            .uri(barcode.toString())
            .header(properties.getHeader(), properties.getToken())
            .retrieve()
            .onStatus(status -> status.value() == 429, 
                response -> Mono.error(new TooManyRequestsException()))
            .onStatus(status -> status.value() == 404, 
                response -> Mono.error(new ProductNotFoundException(barcode)))
            .onStatus(status -> status.is5xxServerError(), 
                response -> Mono.error(new InternalServerErrorException()))
            .bodyToMono(APIProductBarCodeResponseDTO.class)
            .flatMap(this::convertToProductStructure);
    }
    
    private Mono<Boolean> cacheProduct(String cacheKey, ProductStructure product) {
        return redisService.setValue(cacheKey, product);
    }

    private Mono<ProductStructure> convertToProductStructure(APIProductBarCodeResponseDTO response) {
        ProductStructure product = new ProductStructure();
        Mono<ProductStructure> productMono = Mono.just(product);
        
        productMono = processProductDescription(response, productMono);
        productMono = processProductCategory(response, productMono);
        productMono = setAdditionalProductInfo(response, productMono);
        
        return productMono;
    }

    private Mono<ProductStructure> processProductDescription(APIProductBarCodeResponseDTO response, 
                                                           Mono<ProductStructure> productMono) {
        if (response.description() == null || response.description().isEmpty()) {
            return productMono;
        }
        
        return productMono.flatMap(product -> 
            measureService.getListUnitsName().flatMap(units -> {
                String[] parsedComponents = APIProductBarCodeUtils.parseProductDescription(
                    response.description(), 
                    units
                );
                
                return updateProductWithParsedComponents(product, parsedComponents);
            })
        );
    }

    private Mono<ProductStructure> updateProductWithParsedComponents(ProductStructure product, String[] components) {
        String productName = components[0];
        String quantityString = components[1];
        String unitName = components[2];
        
        if (productName != null && !productName.isEmpty()) {
            product.setName(productName);
        }
        
        Double quantity = parseQuantitySafely(quantityString);
        UnityOfMeasureDTO unitDto = new UnityOfMeasureDTO(unitName);
        product.setProductUnitOfMeasureDTO(new ProductUnitOfMeasureResponseDTO(quantity, unitDto));
        
        return Mono.just(product);
    }

    private Double parseQuantitySafely(String quantityString) {
        try {
            return quantityString != null ? Double.parseDouble(quantityString) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Mono<ProductStructure> processProductCategory(APIProductBarCodeResponseDTO response, 
                                                        Mono<ProductStructure> productMono) {
        if (response.gpc() == null || response.gpc().code() == null || response.gpc().code().isEmpty()) {
            return productMono;
        }
        return productMono.flatMap(product -> 
            categoryService.getListCategories().flatMap(categories -> {
                
                Long categoryCode = APIProductBarCodeUtils.findMatchingCategoryCode(
                    response.gpc().code(), 
                    categories.stream()
                        .map(CategoryDTO::gpcCode)
                        .collect(Collectors.toList())
                );
                
                return handleCategoryMapping(product, categoryCode, categories);
            })
        );
    }

    private Mono<ProductStructure> handleCategoryMapping(ProductStructure product, Long categoryCode, 
                                                       List<CategoryDTO> categories) {
        if (categoryCode == null) {
            return Mono.just(product);
        }
        if (String.valueOf(categoryCode).length() > MIN_CATEGORY_CODE_LENGTH) {
            return handleExtendedCategoryMapping(product, categoryCode);
        }
        
        return handleSimpleCategoryMapping(product, categoryCode, categories);
    }

    private Mono<ProductStructure> handleExtendedCategoryMapping(ProductStructure product, Long categoryCode) {
        return categoryService.getBrickCodeModel(categoryCode)
            .flatMap(brickModel -> categoryService.getCategoryByGpcCode(brickModel.getGpcCode())
                .map(categoryModel -> {
                    product.setCategory(new CategoryDTO(
                        categoryModel.getName(), 
                        brickModel.getGpcCode()
                    ));
                    return product;
                })
            ).onErrorResume(e->  Mono.just(product));
    }

    private Mono<ProductStructure> handleSimpleCategoryMapping(ProductStructure product, Long categoryCode,
                                                            List<CategoryDTO> categories) {
        Optional<CategoryDTO> matchingCategory = categories.stream()
            .filter(c -> c.gpcCode().equals(categoryCode))
            .findFirst();
        
        matchingCategory.ifPresent(category -> 
            product.setCategory(new CategoryDTO(category.name(), categoryCode))
        );
        
        return Mono.just(product);
    }

    private Mono<ProductStructure> setAdditionalProductInfo(APIProductBarCodeResponseDTO response,
                                                          Mono<ProductStructure> productMono) {
        return productMono.doOnNext(product -> {
            if (response.brand() != null && response.brand().name() != null && 
                !response.brand().name().isEmpty()) {
                product.setBrand(response.brand().name());
            }
            if (response.avgPrice() != null) {
                product.setPurchasedPrice(response.avgPrice());
            }
        });
    }
    
    // Method to invalidate cached barcode data if needed
    public Mono<Boolean> invalidateBarCodeCache(Long barcode) {
        String cacheKey = getBarcodeCacheKey(barcode);
        return redisService.deleteKey(cacheKey);
    }
}