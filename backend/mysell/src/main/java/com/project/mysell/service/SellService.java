package com.project.mysell.service;

import org.springframework.stereotype.Service;

import com.project.mysell.dto.SellDTO;
import com.project.mysell.dto.SellResponseDTO;
import com.project.mysell.dto.SellUpdateDTO;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class SellService {

	public Mono<SellResponseDTO> createSell(@Valid SellDTO selltDTO, String token) {
		// TODO Auto-generated method stub
		return null;
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

}
