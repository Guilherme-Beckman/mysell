package com.project.mysell.service.product;

import java.time.Duration;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureDTO;
import com.project.mysell.exceptions.product.ProductUnitOfMeasureByIdNotFoundException;
import com.project.mysell.infra.redis.RedisService;
import com.project.mysell.model.ProductUnitOfMeasureModel;
import com.project.mysell.repository.ProductUnitOfMeasureRepository;

import reactor.core.publisher.Mono;

@Service
public class ProductUnitOfMeasureService {

    @Autowired
    private ProductUnitOfMeasureRepository productUnitOfMeasureRepository;
    
    @Autowired
    private RedisService redisService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Tempo de expiração para os itens em cache (10 minutos)
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);
    
    // Gera a chave de cache para o ProductUnitOfMeasureModel
    private String getCacheKey(Long id) {
        return "productUnitOfMeasure:" + id;
    }
    
    public Mono<ProductUnitOfMeasureModel> createProductUnitOfMeasure(ProductUnitOfMeasureDTO productUnitOfMeasureDTO) {
        final ProductUnitOfMeasureModel newModel = new ProductUnitOfMeasureModel(productUnitOfMeasureDTO);
        return productUnitOfMeasureRepository.save(newModel)
            .flatMap(model -> {
                String cacheKey = getCacheKey(model.getProductsUnitsOfMeasureId());
                return redisService.setValueWithExpiration(cacheKey, model, CACHE_TTL.getSeconds())
                    .thenReturn(model);
            });
    }
    
    public Mono<ProductUnitOfMeasureModel> getProductUnitOfMeasureById(Long id) {
        String cacheKey = getCacheKey(id);
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof ProductUnitOfMeasureModel) {
                    return Mono.just((ProductUnitOfMeasureModel) value);
                } else if (value instanceof Map) { 
                    ProductUnitOfMeasureModel model = objectMapper.convertValue(value, ProductUnitOfMeasureModel.class);
                    return Mono.just(model);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                productUnitOfMeasureRepository.findById(id)
                    .switchIfEmpty(Mono.error(new ProductUnitOfMeasureByIdNotFoundException()))
                    .flatMap(model ->
                        redisService.setValueWithExpiration(cacheKey, model, CACHE_TTL.getSeconds())
                            .thenReturn(model)
                    )
            );
    }
    
    public Mono<ProductUnitOfMeasureModel> updateProductUnitOfMeasure(Long id, ProductUnitOfMeasureDTO productUnitOfMeasureDTO) {
        String cacheKey = getCacheKey(id);
        return getProductUnitOfMeasureById(id)
            .flatMap(existingUnit -> {
                updateProductUnitOfMeasureFields(existingUnit, productUnitOfMeasureDTO);
                return productUnitOfMeasureRepository.save(existingUnit)
                    .flatMap(updatedModel ->
                        redisService.setValueWithExpiration(cacheKey, updatedModel, CACHE_TTL.getSeconds())
                            .thenReturn(updatedModel)
                    );
            });
    }
    
    private void updateProductUnitOfMeasureFields(ProductUnitOfMeasureModel product, ProductUnitOfMeasureDTO updateDTO) {
        updateFieldIfValid(product::setQuantity, product.getQuantity(), updateDTO.quantity());
        updateFieldIfValid(product::setUnitOfMeasureId, product.getUnitOfMeasureId(), updateDTO.unitOfMeasureId());
    }
    
    private <T> void updateFieldIfValid(Consumer<T> setter, T currentValue, T newValue) {
        if (newValue != null && !newValue.equals(currentValue)) {
            if (newValue instanceof String str && !str.isBlank()) {
                setter.accept(newValue);
            } else if (!(newValue instanceof String)) {
                setter.accept(newValue);
            }
        }
    }
    
    public Mono<Void> deleteProductUnitOfMeasure(Long id) {
        String cacheKey = getCacheKey(id);
        return getProductUnitOfMeasureById(id)
            .flatMap(unit -> productUnitOfMeasureRepository.delete(unit))
            .then(redisService.deleteKey(cacheKey))
            .then();
    }
}
