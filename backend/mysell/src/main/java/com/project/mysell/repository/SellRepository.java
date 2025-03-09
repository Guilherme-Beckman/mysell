package com.project.mysell.repository;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.project.mysell.model.SellModel;

import reactor.core.publisher.Flux;

public interface SellRepository extends ReactiveCrudRepository<SellModel, Long>{
	Flux<SellModel> findAllByUserId (UUID userId);
}
