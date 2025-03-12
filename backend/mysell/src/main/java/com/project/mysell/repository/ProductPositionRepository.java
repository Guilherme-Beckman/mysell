package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.report.ranking.ProductPositionModel;

@Repository
public interface ProductPositionRepository extends ReactiveCrudRepository<ProductPositionModel, Long> {

}
