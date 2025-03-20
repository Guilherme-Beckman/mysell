package com.project.mysell.service;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mysell.dto.product.ProductResponseDTO;
import com.project.mysell.dto.sell.SellDTO;
import com.project.mysell.dto.sell.SellResponseDTO;
import com.project.mysell.dto.sell.SellUpdateDTO;
import com.project.mysell.exceptions.product.ProductNotFoundException;
import com.project.mysell.exceptions.sell.DoesNotOwnSellException;
import com.project.mysell.exceptions.sell.SellNotFoundException;
import com.project.mysell.exceptions.sell.UserHasNoSalesTodayException;
import com.project.mysell.infra.redis.RedisService;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.SellModel;
import com.project.mysell.repository.SellRepository;
import com.project.mysell.service.product.ProductService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class SellService {
    @Autowired
    private SellRepository sellRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private RedisService redisService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private static final Duration CACHE_TTL = Duration.ofDays(1);
    
    private String getSellCacheKey(Long id) {
        return "sell:" + id;
    }

    public Mono<SellResponseDTO> createSell(@Valid SellDTO sellDTO, String token) {
        return verifyIfProductExist(sellDTO.productId())
            .then(Mono.defer(() -> {
                final UUID userId = extractUserIdFromToken(token);
                SellModel newSell = createNewSell(sellDTO, userId);
                return saveSellAndConvertToResponse(token, newSell)
                    .flatMap(sellResponse -> 
                        cacheSell(newSell)
                            .thenReturn(sellResponse)
                    );
            }));
    }

    private Mono<Void> verifyIfProductExist(Long productId) {
        return productService.getProductById(productId).then();
    }

    public Flux<SellResponseDTO> getSellsByUserId(String token) {
        final UUID userId = extractUserIdFromToken(token);
        return sellRepository.findAllByUserId(userId)
            .flatMap(sell -> convertToSellResponseDTO(token, sell));
    }

    public Mono<SellResponseDTO> getSellResponseById(String token, Long id) {
        final UUID userId = extractUserIdFromToken(token);
        
        return getSellById(id) 
                .flatMap(existingSell -> {
                    return validateOwnership(existingSell.getUserId(), userId)
                    .then(convertToSellResponseDTO(token, existingSell));
                });
    }
    
    public Mono<SellModel> getSellById(Long id) {
        String cacheKey = getSellCacheKey(id);
        return redisService.getValue(cacheKey)
            .flatMap(value -> {
                if (value instanceof SellModel) {
                    return Mono.just((SellModel) value);
                } else if (value instanceof Map) {
                    SellModel sell = objectMapper.convertValue(value, SellModel.class);
                    return Mono.just(sell);
                }
                return Mono.empty();
            })
            .switchIfEmpty(
                sellRepository.findById(id)
                    .switchIfEmpty(Mono.error(new SellNotFoundException(id)))
                    .flatMap(sell -> 
                        redisService.setValueWithExpiration(cacheKey, sell, CACHE_TTL.getSeconds())
                            .thenReturn(sell)
                    )
            );
    }

    public Flux<SellResponseDTO> getAllSells() {
        return sellRepository.findAll()
            .flatMap(sell -> convertToSellResponseDTO(sell));
    }

    public Mono<SellResponseDTO> updateSell(Long id, @Valid SellUpdateDTO sellDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);

        return getSellById(id) 
            .flatMap(existingSell -> {
                return validateOwnership(existingSell.getUserId(), userId)
                        .then(update(existingSell, sellDTO, token));
            });
    }

    public Mono<Void> deleteSell(Long id, String token) {
        final UUID userId = extractUserIdFromToken(token);

        return getSellById(id) 
            .flatMap(existingSell -> {
                return validateOwnership(existingSell.getUserId(), userId)
                    .then(sellRepository.deleteById(existingSell.getSellsId()))
                    .then(redisService.deleteKey(getSellCacheKey(id)))
                    .then();
            });
    }

    private Mono<SellResponseDTO> update(
            SellModel existingSell,
            SellUpdateDTO sellDTO,
            String token) {
        updateSellFields(existingSell, sellDTO);
        return sellRepository.save(existingSell)
            .flatMap(updatedSell -> 
                cacheSell(updatedSell)
                    .then(convertToSellResponseDTO(token, updatedSell))
            );
    }

    private void updateSellFields(SellModel sell, SellUpdateDTO updateDTO) {
        if (updateDTO.quantity() != null) {
            sell.setQuantity(updateDTO.quantity());
        }
        if (updateDTO.productId() != null) {
            sell.setProductId(updateDTO.productId());
        }
    }

    private Mono<Void> validateOwnership(UUID existingSellUserId, UUID userId) {
        if (!existingSellUserId.equals(userId)) {
            return Mono.error(new DoesNotOwnSellException());
        }
        return Mono.empty();
    }

    private UUID extractUserIdFromToken(String token) {
        return jwtTokenProvider.getUserIdFromToken(jwtTokenProvider.extractJwtToken(token));
    }

    private SellModel createNewSell(SellDTO sellDTO, UUID userId) {
        SellModel sell = new SellModel(sellDTO);
        sell.setUserId(userId);
        return sell;
    }

    private Mono<SellResponseDTO> saveSellAndConvertToResponse(String token, SellModel sellModel) {
        return sellRepository.save(sellModel)
            .flatMap(savedSell -> getSellById(savedSell.getSellsId())
            .flatMap(foundSell -> convertToSellResponseDTO(token, foundSell)));
    }

    private Mono<SellResponseDTO> convertToSellResponseDTO(String token, SellModel sellModel) {
        return retrieveProductDetails(token, sellModel.getProductId())
            .flatMap(productResponse -> {
                SellResponseDTO sellResponseDTO = buildSellResponseDTO(sellModel, productResponse);
                return Mono.just(sellResponseDTO);
            });
    }
    
    private Mono<SellResponseDTO> convertToSellResponseDTO(SellModel sellModel) {
        return retrieveProductDetails(sellModel.getProductId())
            .flatMap(productResponse -> {
                SellResponseDTO sellResponseDTO = buildSellResponseDTO(sellModel, productResponse);
                return Mono.just(sellResponseDTO);
            });
    }

    private Mono<ProductResponseDTO> retrieveProductDetails(String token, Long productId) {
        return productService.getProductResponseById(token, productId);
    }
    
    private Mono<ProductResponseDTO> retrieveProductDetails(Long productId) {
        return productService.getAllProducts()
            .filter(product -> product.productsId().equals(productId))
            .next()
            .switchIfEmpty(Mono.error(new ProductNotFoundException(productId)));
    }

    private SellResponseDTO buildSellResponseDTO(
            SellModel sellModel,
            ProductResponseDTO productResponseDTO
        ) {
        return new SellResponseDTO(
            sellModel.getQuantity(),
            sellModel.getCreatedAt(),
            productResponseDTO
        );
    }

    public Flux<SellResponseDTO> getTodaySellByUserId(UUID userId) {
        return sellRepository.getTodaySellById(userId)
            .switchIfEmpty(Mono.error(new UserHasNoSalesTodayException()))
            .flatMap(this::convertToSellResponseDTO);
    }

    public Flux<SellResponseDTO> getThisWeekSellByUserId(UUID userId) {
        return sellRepository.getThisWeekSellByUserId(userId)
            .switchIfEmpty(Mono.error(new UserHasNoSalesTodayException()))
            .flatMap(this::convertToSellResponseDTO);
    }
    
    // Armazena a venda no cache com expiração
    private Mono<Boolean> cacheSell(SellModel sell) {
        String cacheKey = getSellCacheKey(sell.getSellsId());
        return redisService.setValueWithExpiration(cacheKey, sell, CACHE_TTL.getSeconds());
    }
}