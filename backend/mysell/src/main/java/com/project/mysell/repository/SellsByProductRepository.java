package com.project.mysell.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.project.mysell.model.report.SellsByProductsModel;

import reactor.core.publisher.Flux;

@Repository
public interface SellsByProductRepository extends ReactiveCrudRepository<SellsByProductsModel, Long> {

	Flux<SellsByProductsModel> findAllByDailyReportId(Long dailyReportId);

}