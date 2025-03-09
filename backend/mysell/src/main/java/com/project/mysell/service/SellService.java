package com.project.mysell.service;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.ProductResponseDTO;
import com.project.mysell.dto.SellDTO;
import com.project.mysell.dto.SellResponseDTO;
import com.project.mysell.dto.SellUpdateDTO;
import com.project.mysell.exceptions.DoesNotOwnSellException;
import com.project.mysell.exceptions.ProductNotFoundException;
import com.project.mysell.exceptions.SellNotFoundException;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.SellModel;
import com.project.mysell.repository.SellRepository;

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

    public Mono<SellResponseDTO> createSell(@Valid SellDTO sellDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);
        SellModel newSell = createNewSell(sellDTO, userId);
        return saveSellAndConvertToResponse(token, newSell);
    }

    public Flux<SellResponseDTO> getSellsByUserId(String token) {
        final UUID userId = extractUserIdFromToken(token);
        return sellRepository.findAllByUserId(userId)
            .flatMap(sell -> convertToSellResponseDTO(token, sell));
    }

    public Mono<SellResponseDTO> getSellById(String token, Long id) {
        final UUID userId = extractUserIdFromToken(token);
        
        return sellRepository.findById(id)
                .switchIfEmpty(Mono.error(new SellNotFoundException(id)))
                .flatMap(existingSell -> {
                    return validateOwnership(existingSell.getUserId(), userId)
                    .then(convertToSellResponseDTO(token, existingSell));
                });
    }

    public Flux<SellResponseDTO> getAllSells() {
        return sellRepository.findAll()
            .flatMap(sell -> convertToSellResponseDTO(sell));
    }

    public Mono<SellResponseDTO> updateSell(Long id, @Valid SellUpdateDTO sellDTO, String token) {
        final UUID userId = extractUserIdFromToken(token);

        return sellRepository.findById(id)
            .switchIfEmpty(Mono.error(new SellNotFoundException(id)))
            .flatMap(existingSell -> {
                return validateOwnership(existingSell.getUserId(), userId)
                        .then(update(existingSell, sellDTO, token));
            });
    }

    public Mono<Void> deleteSell(Long id, String token) {
        final UUID userId = extractUserIdFromToken(token);

        return sellRepository.findById(id)
            .switchIfEmpty(Mono.error(new SellNotFoundException(id)))
            .flatMap(existingSell -> {
                return validateOwnership(existingSell.getUserId(), userId)
                    .then(sellRepository.deleteById(existingSell.getSellsId()));
            });
    }

    private Mono<SellResponseDTO> update(
            SellModel existingSell,
            SellUpdateDTO sellDTO,
            String token) {
        updateSellFields(existingSell, sellDTO);
        return sellRepository.save(existingSell)
            .flatMap(updatedSell -> convertToSellResponseDTO(token, updatedSell));
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
            .flatMap(savedSell -> sellRepository.findById(savedSell.getSellsId())
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
        return productService.getProductById(token, productId);
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
}