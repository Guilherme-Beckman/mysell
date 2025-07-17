package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.CategoryModel;

import reactor.core.publisher.Mono;
@Repository
public interface CategoryRepository extends ReactiveCrudRepository<CategoryModel, Long>{

	Mono<CategoryModel> findByGpcCode(Long code);

}
