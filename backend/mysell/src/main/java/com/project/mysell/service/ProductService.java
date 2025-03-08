package com.project.mysell.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.mysell.dto.ProductDTO;
import com.project.mysell.model.ProductModel;
import com.project.mysell.repository.ProductRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProductService {
	@Autowired
	private ProductRepository productRepository;
	public Mono<ProductModel> createProduct(ProductDTO productDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	public Flux<ProductModel> getAllProducts() {
		// TODO Auto-generated method stub
		return null;
	}

	public Mono<ProductModel> updateProduct(Long id, ProductDTO productDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	public Mono<Void> deleteProduct(Long id) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
