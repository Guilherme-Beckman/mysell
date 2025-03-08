package com.project.mysell.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.project.mysell.dto.ProductDTO;
import com.project.mysell.infra.security.CustomUserDetails;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.ProductModel;
import com.project.mysell.model.ProductUnitOfMeasureModel;
import com.project.mysell.repository.ProductRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProductService {
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private ProductUnitOfMeasureService productUnitOfMeasureService;
	public Mono<ProductModel> createProduct(ProductDTO productDTO, String token) {
	    final String extractedToken = jwtTokenProvider.extractJwtToken(token);
	    final UUID userId = jwtTokenProvider.getUserIdFromToken(extractedToken);

	    ProductModel newProduct = new ProductModel(productDTO);
	    newProduct.setUserId(userId);

	    return productUnitOfMeasureService
	        .createProductUnitOfMeasure(productDTO.productUnitOfMeasureDTO())
	        .flatMap(p -> {
	            newProduct.setProductUnitOfMeasureId(p.getProductsUnitsOfMeasureId());
	            return productRepository.save(newProduct);
	        });
	}


	public Flux<ProductModel> getProductById() {
		// TODO Auto-generated method stub
		return null;
	}
	public Flux<ProductModel> getAllProducts() {
		return this.productRepository.findAll();
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
