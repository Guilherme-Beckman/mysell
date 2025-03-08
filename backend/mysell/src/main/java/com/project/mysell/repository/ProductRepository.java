package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.ProductModel;

import reactor.core.publisher.Flux;

@Repository
public interface ProductRepository extends ReactiveCrudRepository<ProductModel, Long>{
	}


