package com.project.mysell.service.product;

import java.time.Duration;

import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.category.CategoryDTO;
import com.project.mysell.dto.product.ProductDTO;
import com.project.mysell.dto.product.ProductResponseDTO;
import com.project.mysell.dto.product.ProductUpdateDTO;
import com.project.mysell.dto.product.unit.ProductUnitOfMeasureResponseDTO;
import com.project.mysell.dto.unit.UnityOfMeasureDTO;
import com.project.mysell.exceptions.product.DoesNotOwnProductException;
import com.project.mysell.exceptions.product.ProductNotFoundException;
import com.project.mysell.infra.redis.RedisService;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.ProductModel;
import com.project.mysell.model.ProductUnitOfMeasureModel;
import com.project.mysell.repository.ProductRepository;
import com.project.mysell.repository.SellRepository;
import com.project.mysell.service.CategoryService;
import com.project.mysell.service.SellService;
import com.project.mysell.service.UnityOfMeasureService;

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
    
    @Autowired
    private RedisService redisService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SellRepository sellRepository;
    
    private static final Duration CACHE_TTL = Duration.ofDays(1);

    public Mono<ProductResponseDTO> createProduct(ProductDTO productDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);
        ProductModel newProduct = createNewProduct(productDTO, userId);

        return productUnitOfMeasureService
            .createProductUnitOfMeasure(productDTO.productUnitOfMeasureDTO())
            .flatMap(unitOfMeasure -> {
                newProduct.setProductUnitOfMeasureId(unitOfMeasure.getProductsUnitsOfMeasureId());
                return saveProductAndConvertToResponse(newProduct)
                    .flatMap(productResponse -> cacheProduct(productResponse)
                        .thenReturn(productResponse));
            });
    }

    public Flux<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
            .flatMap(this::convertToProductResponseDTO);
    }

    public Flux<ProductResponseDTO> getProductByUserId(String token) {
        final UUID userId = extractUserIdFromToken(token);
        return productRepository.findAllByUserId(userId)
            .flatMap(this::convertToProductResponseDTO);
    }
    
    public Mono<ProductResponseDTO> getProductResponseById(String token, Long id) {
        final UUID userId = extractUserIdFromToken(token);
        String cacheKey = getCacheKey(id);
        return redisService.getValue(cacheKey)
        		.flatMap(value -> {
                    if (value instanceof ProductResponseDTO) {
                        return Mono.just((ProductResponseDTO) value);
                    } else if (value instanceof Map) {
                    	ProductResponseDTO sell = objectMapper.convertValue(value, ProductResponseDTO.class);
                        return Mono.just(sell);
                    }
					return null;})
            .switchIfEmpty(
                getProductById(id)
                    .flatMap(existingProduct ->
                        validateOwnership(existingProduct.getUserId(), userId)
                            .then(convertToProductResponseDTO(existingProduct))
                    )
                    .flatMap(productResponse -> cacheProduct(productResponse)
                        .thenReturn(productResponse))
            );
    }
    
    public Mono<ProductResponseDTO> getProductResponseById(Long id) {
        String cacheKey = getCacheKey(id);
        return redisService.getValue(cacheKey)
        		.flatMap(value -> {
                    if (value instanceof ProductResponseDTO) {
                        return Mono.just((ProductResponseDTO) value);
                    } else if (value instanceof Map) {
                    	ProductResponseDTO sell = objectMapper.convertValue(value, ProductResponseDTO.class);
                        return Mono.just(sell);
                    }
					return null;})
            .switchIfEmpty(
                getProductById(id)
                    .flatMap(this::convertToProductResponseDTO)
                    .flatMap(productResponse -> cacheProduct(productResponse)
                        .thenReturn(productResponse))
            );
    }
    
    public Mono<ProductModel> getProductById(Long id) {
        return productRepository.findById(id)
                .switchIfEmpty(Mono.error(new ProductNotFoundException(id)));
    }
    
    public Mono<ProductResponseDTO> updateProduct(Long id, ProductUpdateDTO productDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);
        return getProductById(id)
            .flatMap(existingProduct ->
                validateOwnership(existingProduct.getUserId(), userId)
                    .then(update(existingProduct, productDTO))
                    .flatMap(updatedResponse -> evictProductCache(id)
                        .thenReturn(updatedResponse))
            );
    }
    
    public Mono<Void> deleteProduct(Long id, String token) {
        final UUID userId = extractUserIdFromToken(token);
        return getProductById(id)
            .flatMap(existingProduct ->
                validateOwnership(existingProduct.getUserId(), userId)
                	.then(deleteSellsByproductId(id))
                    .then(deleteProductAndMeasureUnit(existingProduct))
                    .then(evictProductCache(id))
                    .then()
            );
    
    }
    private Mono<Void> deleteSellsByproductId(Long id ){
    	return this.sellRepository.deleteAllSellByProduct(id);
    }
    private Mono<ProductResponseDTO> update(ProductModel existingProduct, ProductUpdateDTO productDTO) {
        updateProductFields(existingProduct, productDTO);
        if (productDTO.productUnitOfMeasureDTO() == null) {
            return productRepository.save(existingProduct)
                .flatMap(this::convertToProductResponseDTO);
        }
        return productUnitOfMeasureService
            .updateProductUnitOfMeasure(existingProduct.getProductUnitOfMeasureId(), productDTO.productUnitOfMeasureDTO())
            .flatMap(updatedUnit -> productRepository.save(existingProduct))
            .flatMap(this::convertToProductResponseDTO);
    }
    
    private Mono<Void> validateOwnership(UUID existingProductUserId, UUID userId) {
        if (!existingProductUserId.equals(userId)) {
            return Mono.error(new DoesNotOwnProductException());
        }
        return Mono.empty();
    }
    
    private void updateProductFields(ProductModel product, ProductUpdateDTO updateDTO) {
        updateFieldIfValid(product::setName, product.getName(), updateDTO.name());
        updateFieldIfValid(product::setCategoryId, product.getCategoryId(), updateDTO.categoryId());
        updateFieldIfValid(product::setPurchasedPrice, product.getPurchasedPrice(), updateDTO.purchasedPrice());
        updateFieldIfValid(product::setPriceToSell, product.getPriceToSell(), updateDTO.priceToSell());
        updateFieldIfValid(product::setBrand, product.getBrand(), updateDTO.brand());
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
    
    private UUID extractUserIdFromToken(String token) {
        return jwtTokenProvider.getUserIdFromToken(jwtTokenProvider.extractJwtToken(token));
    }
    
    private ProductModel createNewProduct(ProductDTO productDTO, UUID userId) {
        ProductModel product = new ProductModel(productDTO);
        product.setUserId(userId);
        return product;
    }
    
    private Mono<ProductResponseDTO> saveProductAndConvertToResponse(ProductModel product) {
        return productRepository.save(product)
            .flatMap(savedProduct -> getProductById(savedProduct.getProductsId()))
            .flatMap(this::convertToProductResponseDTO);
    }
    
    private Mono<Void> deleteProductAndMeasureUnit(ProductModel existingProduct) {
        return productRepository.deleteById(existingProduct.getProductsId())
                .then(productUnitOfMeasureService.deleteProductUnitOfMeasure(existingProduct.getProductUnitOfMeasureId()));
    }
    
    private Mono<ProductResponseDTO> convertToProductResponseDTO(ProductModel product) {
        Mono<CategoryDTO> categoryMono = retrieveCategoryDetails(product.getCategoryId());
        Mono<ProductUnitOfMeasureResponseDTO> unitOfMeasureMono = retrieveUnitOfMeasureDetails(product);
        return Mono.zip(categoryMono, unitOfMeasureMono)
            .map(tuple -> buildProductResponseDTO(product, tuple.getT1(), tuple.getT2()));
    }
    
    private Mono<CategoryDTO> retrieveCategoryDetails(Long categoryId) {
        return categoryService.getCategoryById(categoryId)
            .map(category -> new CategoryDTO(category.getName(), category.getGpcCode()));
    }
    
    private Mono<ProductUnitOfMeasureResponseDTO> retrieveUnitOfMeasureDetails(ProductModel product) {
        return productUnitOfMeasureService
            .getProductUnitOfMeasureById(product.getProductUnitOfMeasureId())
            .flatMap(this::buildUnitOfMeasureResponse);
    }
    
    private Mono<ProductUnitOfMeasureResponseDTO> buildUnitOfMeasureResponse(ProductUnitOfMeasureModel unitOfMeasure) {
        return unityOfMeasureService
            .getUnityOfMeasureById(unitOfMeasure.getUnitOfMeasureId())
            .map(measure -> new UnityOfMeasureDTO(measure.getName()))
            .map(measureDto -> new ProductUnitOfMeasureResponseDTO(
                unitOfMeasure.getQuantity(),
                measureDto
            ));
    }
    
    private ProductResponseDTO buildProductResponseDTO(
        ProductModel product,
        CategoryDTO category,
        ProductUnitOfMeasureResponseDTO unitOfMeasure
    ) {
        return new ProductResponseDTO(
            product.getProductsId(),
            product.getName(),
            category,
            product.getPurchasedPrice(),
            product.getPriceToSell(),
            product.getBrand(),
            unitOfMeasure
        );
    }
    
    private String getCacheKey(Long productId) {
        return "product:" + productId;
    }
    
  
    
    private Mono<Boolean> cacheProduct(ProductResponseDTO product) {
        String cacheKey = getCacheKey(product.productsId());
        return redisService.setValueWithExpiration(cacheKey, product, CACHE_TTL.getSeconds());
    }
    
    private Mono<Boolean> evictProductCache(Long productId) {
        String cacheKey = getCacheKey(productId);
        return redisService.deleteKey(cacheKey);
    }
}
