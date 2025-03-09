package com.project.mysell.repository;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.ProductModel;

import reactor.core.publisher.Flux;

@Repository
public interface ProductRepository extends ReactiveCrudRepository<ProductModel, Long>{
	Flux<ProductModel> findAllByUserId (UUID userId);
	}


