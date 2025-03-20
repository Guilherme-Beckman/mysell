package com.project.mysell.service;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.category.CategoryDTO;
import com.project.mysell.exceptions.category.CategoryNotFoundException;
import com.project.mysell.infra.redis.RedisService;
import com.project.mysell.model.BrickCodeModel;
import com.project.mysell.model.CategoryModel;
import com.project.mysell.repository.BrickCodeRepository;
import com.project.mysell.repository.CategoryRepository;

import jakarta.annotation.PostConstruct;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private BrickCodeRepository brickCodeRepository;
    
    @Autowired
    private RedisService redisService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Tempo de expiração para os itens em cache (10 minutos)
    private static final Duration CACHE_TTL = Duration.ofDays(1);
    
    private Flux<CategoryDTO> cachedFlux;
    
    @PostConstruct
    public void init() {
        this.cachedFlux = getAllCategories()
            .map(unit -> new CategoryDTO(unit.getName(), unit.getGpcCode()))
            .cache();
    }
    
    private String getCategoryCacheKey(Long id) {
        return "category:" + id;
    }
    
    private String getCategoryGpcCacheKey(Long code) {
        return "category:gpc:" + code;
    }
    
    public Mono<CategoryModel> createCategory(CategoryDTO categoryDTO) {
        CategoryModel categoryModel = new CategoryModel(categoryDTO);
        return categoryRepository.save(categoryModel)
            .flatMap(category ->
                redisService.setValueWithExpiration(getCategoryCacheKey(category.getCategoriesId()), category, CACHE_TTL.getSeconds())
                    .thenReturn(category)
            );
    }
    
    public Flux<CategoryModel> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Mono<CategoryModel> getCategoryById(Long id) {
        String cacheKey = getCategoryCacheKey(id);
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof CategoryModel) {
                    return Mono.just((CategoryModel) value);
                } else if (value instanceof Map) {
                    CategoryModel category = objectMapper.convertValue(value, CategoryModel.class);
                    return Mono.just(category);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                categoryRepository.findById(id)
                    .switchIfEmpty(Mono.error(new CategoryNotFoundException()))
                    .flatMap(category ->
                        redisService.setValueWithExpiration(cacheKey, category, CACHE_TTL.getSeconds())
                            .thenReturn(category)
                    )
            );
    }
    
    public Mono<CategoryModel> getCategoryByGpcCode(Long code) {
        String cacheKey = getCategoryGpcCacheKey(code);
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof CategoryModel) {
                    return Mono.just((CategoryModel) value);
                } else if (value instanceof Map) {
                    CategoryModel category = objectMapper.convertValue(value, CategoryModel.class);
                    return Mono.just(category);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                categoryRepository.findByGpcCode(code)
                    .switchIfEmpty(Mono.error(new CategoryNotFoundException()))
                    .flatMap(category ->
                        redisService.setValueWithExpiration(cacheKey, category, CACHE_TTL.getSeconds())
                            .thenReturn(category)
                    )
            );
    }
    
    public Mono<CategoryModel> updateCategory(Long id, CategoryDTO categoryDTO) {
        return getCategoryById(id)
            .flatMap(category -> {
                category.setName(categoryDTO.name());
                category.setGpcCode(categoryDTO.gpcCode());
                return categoryRepository.save(category)
                    .flatMap(updatedCategory ->
                        redisService.setValueWithExpiration(getCategoryCacheKey(id), updatedCategory, CACHE_TTL.getSeconds())
                            .thenReturn(updatedCategory)
                    );
            });
    }
    
    public Mono<Void> deleteCategory(Long id) {
        return getCategoryById(id)
            .flatMap(category ->
                categoryRepository.deleteById(id)
            )
            .then(redisService.deleteKey(getCategoryCacheKey(id)))
            .then();
    }
    
    public Mono<List<CategoryDTO>> getListCategories() {
        return cachedFlux.collectList();
    }
    
    public Mono<BrickCodeModel> getBrickCodeModel(Long id) {
        return brickCodeRepository.findById(id)
            .switchIfEmpty(Mono.error(new CategoryNotFoundException()));
    }
}
