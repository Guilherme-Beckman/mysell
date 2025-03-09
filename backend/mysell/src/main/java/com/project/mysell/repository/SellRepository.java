package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.project.mysell.model.SellModel;

public interface SellRepository extends ReactiveCrudRepository<SellModel, Long>{

}
