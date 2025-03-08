package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.ProductUnitOfMeasureDTO;
import com.project.mysell.model.ProductUnitOfMeasureModel;
import com.project.mysell.repository.ProductUnitOfMeasureRepository;

import reactor.core.publisher.Mono;

@Service
public class ProductUnitOfMeasureService {
	@Autowired
	private ProductUnitOfMeasureRepository productUnitOfMeasureRepository;
	
	public Mono<ProductUnitOfMeasureModel> createProductUnitOfMeasure (ProductUnitOfMeasureDTO productUnitOfMeasureDTO){
		final ProductUnitOfMeasureModel newProductUnitOfMeasureModel = new ProductUnitOfMeasureModel(productUnitOfMeasureDTO);
		return productUnitOfMeasureRepository.save(newProductUnitOfMeasureModel);
	}
	
}
