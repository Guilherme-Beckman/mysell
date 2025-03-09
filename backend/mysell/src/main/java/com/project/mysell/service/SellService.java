package com.project.mysell.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mysell.dto.CategoryDTO;
import com.project.mysell.dto.ProductDTO;
import com.project.mysell.dto.ProductResponseDTO;
import com.project.mysell.dto.ProductUnitOfMeasureResponseDTO;
import com.project.mysell.dto.SellDTO;
import com.project.mysell.dto.SellResponseDTO;
import com.project.mysell.dto.SellUpdateDTO;
import com.project.mysell.infra.security.jwt.JwtTokenProvider;
import com.project.mysell.model.ProductModel;
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

	public Mono<SellResponseDTO> createSell(@Valid SellDTO selltDTO, String token) {
		final UUID userId = extractUserIdFromToken(token);
		SellModel newSell = createNewSell(selltDTO, userId);
		return saveSellAndConvertToResponse(token, newSell);
	}

	public Flux<SellResponseDTO> getSellsByUserId(String token) {
		// TODO Auto-generated method stub
		return null;
	}

	public Mono<SellResponseDTO> getSellById(String token, Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	public Flux<SellResponseDTO> getAllSells() {
		// TODO Auto-generated method stub
		return null;
	}

	public Mono<SellResponseDTO> updateSell(Long id, @Valid SellUpdateDTO sellDTO, String token) {
		// TODO Auto-generated method stub
		return null;
	}

	public Mono<Void> deleteSell(Long id, String token) {
		// TODO Auto-generated method stub
		return null;
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
        return 
        retrieveProductDetails(token, sellModel.getProductId())
        .flatMap(productResponse -> {
        	SellResponseDTO sellResponseDTO = buildSellResponseDTO(sellModel, productResponse);
        	return Mono.just(sellResponseDTO);
        });
        
    }
    private Mono<ProductResponseDTO> retrieveProductDetails(String token, Long productId) {
        return productService.getProductById(token, productId);
        }
    private SellResponseDTO buildSellResponseDTO(
            SellModel sellModel,
            ProductResponseDTO productResponseDTO
        ) {
    	return new SellResponseDTO(sellModel.getQuantity(), sellModel.getCreatedAt(), productResponseDTO);
        }
}
