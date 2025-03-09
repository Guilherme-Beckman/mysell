package com.project.mysell.service;

import java.util.function.Consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.ProductUnitOfMeasureDTO;
import com.project.mysell.dto.ProductUpdateDTO;
import com.project.mysell.model.ProductModel;
import com.project.mysell.model.ProductUnitOfMeasureModel;
import com.project.mysell.repository.ProductUnitOfMeasureRepository;

import reactor.core.publisher.Mono;

@Service
public class ProductUnitOfMeasureService {
    @Autowired
    private ProductUnitOfMeasureRepository productUnitOfMeasureRepository;
    
    public Mono<ProductUnitOfMeasureModel> createProductUnitOfMeasure(ProductUnitOfMeasureDTO productUnitOfMeasureDTO) {
        final ProductUnitOfMeasureModel newProductUnitOfMeasureModel = new ProductUnitOfMeasureModel(productUnitOfMeasureDTO);
        return productUnitOfMeasureRepository.save(newProductUnitOfMeasureModel);
    }
    
    public Mono<ProductUnitOfMeasureModel> getProductUnitOfMeasureById(Long id) {
        return productUnitOfMeasureRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("ProductUnitOfMeasure not found with id: " + id)));
    }
    
    public Mono<ProductUnitOfMeasureModel> updateProductUnitOfMeasure(Long id, ProductUnitOfMeasureDTO productUnitOfMeasureDTO) {
        return productUnitOfMeasureRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("ProductUnitOfMeasure not found with id: " + id)))
            .flatMap(existingUnitOfMeasure -> {
            	updateProductUnitOfMeasureFields(existingUnitOfMeasure, productUnitOfMeasureDTO);
                return productUnitOfMeasureRepository.save(existingUnitOfMeasure);
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
        return productUnitOfMeasureRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("ProductUnitOfMeasure not found with id: " + id)))
            .flatMap(unitOfMeasure -> productUnitOfMeasureRepository.delete(unitOfMeasure));
    }
}