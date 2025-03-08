package com.project.mysell.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.CategoryDTO;
import com.project.mysell.dto.ProductDTO;
import com.project.mysell.dto.ProductResponseDTO;
import com.project.mysell.dto.ProductUnitOfMeasureResponseDTO;
import com.project.mysell.dto.UnityOfMeasureDTO;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.ProductModel;
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
	@Autowired
	private CategoryService categoryService;
	@Autowired
	private UnityOfMeasureService unityOfMeasureService;
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
	public Flux<ProductResponseDTO> getAllProducts() {

		return this.productRepository.findAll()
				.flatMap(product ->{
					Mono<CategoryDTO> categoryResponse = 
							this.categoryService
							.getCategoryById(product.getCategoryId())
							.map(category -> new CategoryDTO(category.getName()));
					Mono<ProductUnitOfMeasureResponseDTO> productUnitOfMeasureResponseDTO = 
							this.productUnitOfMeasureService
							.getProductUnitOfMeasureById(product.getProductUnitOfMeasureId())
							.flatMap(productUnitOfMeasureModel ->{
								return this.unityOfMeasureService.
										getUnityOfMeasureById(productUnitOfMeasureModel.getUnitOfMeasureId())
										.map(unityOfMeasure -> new UnityOfMeasureDTO(unityOfMeasure.getName()))
										.map(unityResponsedto -> new ProductUnitOfMeasureResponseDTO(productUnitOfMeasureModel.getQuantity(),unityResponsedto));
							});
					
					return Mono.zip(categoryResponse, productUnitOfMeasureResponseDTO)
					.map(tuple -> new ProductResponseDTO(
						     product.getProductsId(),
						     product.getName(),
						     tuple.getT1(),
						     product.getPurchasedPrice(),
						     product.getPriceToSell(),
						     product.getBrand(),
						     product.getUserId(),
						     tuple.getT2()));
				});
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
